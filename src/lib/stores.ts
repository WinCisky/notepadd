import { writable } from 'svelte/store';
import type { TreeNode } from './filemanager';

export const openFile = writable<TreeNode | null>(null);
