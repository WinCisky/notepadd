import { writable } from 'svelte/store';
import type { TreeNode } from './filemanager';

export const nodeId = writable<number>(0);
export const openFile = writable<TreeNode | null>(null);
