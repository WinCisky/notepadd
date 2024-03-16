import { get, set } from "idb-keyval";
import { nodeId } from "./stores";
import { rootDirectory } from "./stores";
import { get as getStore } from "svelte/store";

export interface TreeNode {
  name: string;
  id: number;
  type: "file" | "folder";
  handle: FileSystemDirectoryHandle | FileSystemFileHandle;
  children: TreeNode[];
  parentFolderHandle?: FileSystemDirectoryHandle;
}

export class FileManager {
  private _directoryHandle: FileSystemDirectoryHandle | undefined;
  private _isFolderOpen = false;
  public root: TreeNode | undefined;

  constructor() {
  }

  public async isFolderLoaded(): Promise<boolean> {
    if (this._isFolderOpen) {
      return true;
    }
    try {
      this._directoryHandle = await get("directory");
      if (this._directoryHandle) {
        this._isFolderOpen = true;
        return true;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.name, error.message);
      }
    }
    return false;
  }

  public async openFolder(): Promise<boolean> {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      await set("directory", directoryHandle);
      console.log("Directory handle", await get("directory"));
      this._directoryHandle = directoryHandle;
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.name, error.message);
      }
    }
    return false;
  }

  public async getNewFileHandle() {
    const options: SaveFilePickerOptions = {
    types: [
      {
      description: 'Text Files',
      accept: { 'text/plain': ['.json'] as `.${string}`[] },
      },
    ],
    };
    const handle = await window.showSaveFilePicker(options);
    return handle;
  }

  // iteratively list all files inside of folder with subfolder and subfiles
  public async getFiles(): Promise<void> {
    if (!this._directoryHandle) {
      return;
    }
    const hasPermission = await this.verifyFolderPermission(this._directoryHandle, false);
    if (!hasPermission) {
      console.log("No permission to read folder");
      return;
    }

    this.root = {
      id: getStore(nodeId),
      name: this._directoryHandle.name,
      type: "folder",
      handle: this._directoryHandle,
      children: [] as TreeNode[],
    };

    const folders: { handle: FileSystemDirectoryHandle, children: TreeNode[] }[] = [{
      handle: this._directoryHandle,
      children: this.root.children
    }];

    do {
      const folder = folders.pop();
      if (!folder) {
        break;
      }

      for await (const entry of folder.handle.values()) {
        nodeId.update((n) => n + 1);
        if (entry.kind === "file") {
          const fileHandle = entry as FileSystemFileHandle;
          folder.children.push({
            id: getStore(nodeId),
            name: fileHandle.name,
            type: "file",
            handle: fileHandle,
            children: [],
            parentFolderHandle: folder.handle
          });
        } else if (entry.kind === "directory") {
          const dirHandle = entry as FileSystemDirectoryHandle;
          const dirNode: TreeNode = {
            id: getStore(nodeId),
            name: dirHandle.name,
            type: "folder",
            handle: dirHandle,
            children: [],
            parentFolderHandle: folder.handle
          };
          folder.children.push(dirNode);
          folders.push({
            handle: dirHandle,
            children: dirNode.children
          });
        }
      }
    } while (folders.length > 0 && false); // only one level deep

    // sort alphabetically with folders first
    this.root.children.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") {
        return -1;
      }
      if (a.type === "file" && b.type === "folder") {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  public async getFileContent(file: FileSystemFileHandle): Promise<string | false> {
    const hasPermission = await this.verifyFilePermission(file, false);
    if (!hasPermission) {
      console.log("No permission to read file");
      return false;
    }

    const fileContent = await file.getFile();
    const content = await fileContent.text();
    return content;
  }

  public async getFolderContent(folder: FileSystemDirectoryHandle): Promise<TreeNode[] | false> {
    const hasPermission = await this.verifyFolderPermission(folder, false);
    if (!hasPermission) {
      console.log("No permission to read folder");
      return false;
    }

    const children: TreeNode[] = [];
    // get children of folder
    for await (const entry of folder.values()) {
      nodeId.update((n) => n + 1);
      if (entry.kind === "file") {
        const fileHandle = entry as FileSystemFileHandle;
        children.push({
          id: getStore(nodeId),
          name: fileHandle.name,
          type: "file",
          handle: fileHandle,
          children: [],
          parentFolderHandle: folder
        });
      } else if (entry.kind === "directory") {
        const dirHandle = entry as FileSystemDirectoryHandle;
        children.push({
          id: getStore(nodeId),
          name: dirHandle.name,
          type: "folder",
          handle: dirHandle,
          children: [],
          parentFolderHandle: folder
        });
      }
    }
    return children;
  }

  public async getFoldersAndFiles() {
    if (!this._directoryHandle) {
      return;
    }
    const hasPermission = await this.verifyFolderPermission(this._directoryHandle, false);
    if (!hasPermission) {
      console.log("No permission to read folder");
      return;
    }
    await this.getFiles();
  }

  public async hasPermission(): Promise<boolean> {
    if (!this._directoryHandle) {
      return false;
    }
    const hasFolderPermission = await this.verifyFolderPermission(this._directoryHandle, true);
    return hasFolderPermission;
  }

  public async askPermission() {
    if (!this._directoryHandle) {
      return false;
    }
    return await this.verifyFolderPermission(this._directoryHandle, true, true);
  }

  private async verifyFilePermission(fileHandle: FileSystemFileHandle, readWrite: boolean) {
    const options: FileSystemHandlePermissionDescriptor = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  private async verifyFolderPermission(
    directoryHandle: FileSystemDirectoryHandle,
    readWrite: boolean, askPermission = false
  ): Promise<boolean> {
    const options: FileSystemHandlePermissionDescriptor = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    const permission = await directoryHandle.queryPermission(options);
    if (permission === 'granted') {
      return true;
    }
    if (!askPermission) {
      return false;
    }
    // Request permission. If the user grants permission, return true.
    if ((await directoryHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  public static async writeFile(fileHandle: FileSystemFileHandle, contents: string) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
  }

  public static async createFile(folder: FileSystemDirectoryHandle, fileName: string) {
    const fileHandle = await folder.getFileHandle(fileName, { create: true });
    return fileHandle;
  }

  public static async getImgeFromPathAndName(path: string[], fileName: string) {
    // path is like ['zets', 'kappa', 'hooh.json']
    // where zets is a folder, kappa is a subfolder and hooh.json is a file
    // i'm not interested in the file, just the folders
    // skip the last element

    // navigate from root matching the folder names
    const root = getStore(rootDirectory);
    if (root instanceof FileSystemFileHandle || !root) {
      return;
    }
    let currentFolder = root;
    let i = 0;
    for (const folderName of path) {
      if (i === (path.length - 1)) {
        break;
      }
      const folder = currentFolder.children.find((node) => node.name === folderName);
      if (!folder) {
        return;
      }
      currentFolder = folder;
      i++;
    }
    if (currentFolder.handle instanceof FileSystemDirectoryHandle) {
        return await currentFolder.handle.getFileHandle(fileName);
    }
  }
}
