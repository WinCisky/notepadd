import type { TreeNode } from "./filemanager";

export function isNodeJson(node: TreeNode): boolean {
    return node.type === 'file' && node.name.match(/\.(json)$/i) !== null;
}

export function isNodeImage(node: TreeNode): boolean {
    return node.type === 'file' && node.name.match(/\.(png|jpg|jpeg|gif|svg)$/i) !== null;
}

export function removeFileExtension(filename: string): string {
    return filename.replace(/\.[^/.]+$/, '');
}