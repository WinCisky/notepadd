import { get, set } from "idb-keyval";

export class FileManager {
  public isFolderOpen: boolean = false;
  private _directoryHandle: FileSystemDirectoryHandle | undefined;

  constructor() {
    try {
      get("directory").then((directoryHandleOrUndefined) => {
        if (directoryHandleOrUndefined) {
          this._directoryHandle = directoryHandleOrUndefined;
          this.isFolderOpen = true;
          return;
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.name, error.message);
      }
    }
  }

  public async openFolder() {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      await set("directory", directoryHandle);
      this._directoryHandle = directoryHandle;
      this.isFolderOpen = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.name, error.message);
      }
    }
  }
}
