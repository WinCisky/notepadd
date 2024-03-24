import { writable } from 'svelte/store';

// currently open file path
export const openFilePath = writable<string[] | null>(null);
// currently open file
export const openFile = writable<FileSystemFileHandle | null>(null);
// selected root directory
export const rootDirectory = writable<FileSystemDirectoryHandle | null>(null);
// file to delete
export const toDelete = writable<FileSystemFileHandle | null>(null);
// path of the deleted file
export const deletedFilePath = writable<string[] | null>(null);
// path of the created file
export const createdFilePath = writable<string[] | null>(null);