import { TreeNode } from '../Models/TreeNode.model.ts';

export class DirectoryApiService {
  baseUrl: string;

  constructor(_baseUrl: string) {
    this.baseUrl = _baseUrl;
  }

  async retrieveRootDirectory() {
    const response = await fetch(`${this.baseUrl}/`);

    return (await response.json()) as TreeNode;
  }
}
