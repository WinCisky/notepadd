import { writable } from 'svelte/store';

export const nodeId = writable<number>(0);
export const openFile = writable<FileSystemFileHandle | null>(null);
export const rootDirectory = writable<FileSystemDirectoryHandle | null>(null);
export const toDelete = writable<FileSystemFileHandle | null>(null);