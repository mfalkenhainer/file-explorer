import { TreeNode } from '../Models/TreeNode.model.ts';

export class DirectoryApiService {
  baseUrl: string;

  constructor(_baseUrl: string) {
    this.baseUrl = _baseUrl;
  }

  async retrieveRootDirectory() {
    const response = await fetch(`${this.baseUrl}/root`);

    return (await response.json()) as TreeNode;
  }

  async retrieveSubDirectory(path: string) {
    const response = await fetch(
      `${this.baseUrl}/child/${path.replaceAll('/', '_')}`,
    );

    return (await response.json()) as TreeNode[];
  }
}
