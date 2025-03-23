export interface TreeNode {
  type: 'file' | 'folder';
  name: string;
  modified: Date;
  size: number;
  children?: TreeNode[];
}
