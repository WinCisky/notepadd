import { get, set } from "idb-keyval";

export class FileManager {
  private _directoryHandle: FileSystemDirectoryHandle | undefined;
  private _isFolderOpen = false;

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

  // iteratively list all files inside of folder with subfolder and subfiles
  public async getFiles() {
    if (!this._directoryHandle) {
      return;
    }
    const hasPermission = await this.verifyFolderPermission(this._directoryHandle, false);
    if (!hasPermission) {
      console.log("No permission to read folder");
      return;
    }

    const folders: FileSystemDirectoryHandle[] = [this._directoryHandle];

    do {
      const folder = folders.pop();
      if (!folder) {
        break;
      }

      for await (const entry of folder.values()) {
        if (entry.kind === "file") {
          // files.push(entry as FileSystemFileHandle);
          const fileHandle = entry as FileSystemFileHandle;
          console.log(folder.name, fileHandle.name);
        } else if (entry.kind === "directory") {
          folders.push(entry as FileSystemDirectoryHandle);
        }
      }
    } while (folders.length > 0);
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
    this.getFiles();
  }

  public async hasPermission() {
    if (!this._directoryHandle) {
      return false;
    }
    return await this.verifyFolderPermission(this._directoryHandle, true);
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

  private async verifyFolderPermission(directoryHandle: FileSystemDirectoryHandle, readWrite: boolean, askPermission = false) {
    const options: FileSystemHandlePermissionDescriptor = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await directoryHandle.queryPermission(options)) === 'granted') {
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
}
