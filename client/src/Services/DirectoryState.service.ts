import { TreeNode } from '../Models/TreeNode.model.ts';
import { DirectoryApiService } from './DirectoryApi.service.ts';

export class DirectoryStateService {
  directoryRoot: TreeNode;
  selectedFolder: TreeNode;
  directoryApiService?: DirectoryApiService;
  itemByName: Record<string, TreeNode> = {};
  itemPathByName: Record<string, string> = {};
  onSelectedFolderChangeCallbacks: Function[] = [];

  constructor(
    _directoryRoot: TreeNode,
    _directoryApiService?: DirectoryApiService,
  ) {
    this.directoryRoot = _directoryRoot;
    this.selectedFolder = _directoryRoot;
    this.directoryApiService = _directoryApiService;

    this.addItemToNameMap(_directoryRoot);
    this.addItemPathToNameMap(_directoryRoot);
  }

  getDirectoryRoot() {
    return this.directoryRoot;
  }

  getSelectedFolder() {
    return this.selectedFolder;
  }

  async setSelectedFolder(_selectedFolder: TreeNode) {
    if (!_selectedFolder.children && this.directoryApiService) {
      const childItems = await this.directoryApiService.retrieveSubDirectory(
        this.itemPathByName[_selectedFolder.name],
      );
      childItems.forEach((childItem) => {
        this.addItemToNameMap(childItem);
        this.addItemPathToNameMap(
          childItem,
          this.itemPathByName[_selectedFolder.name],
        );
      });

      _selectedFolder.children = childItems;
    }

    this.selectedFolder = _selectedFolder;

    this.onSelectedFolderChangeCallbacks.forEach((callback) =>
      callback(this.selectedFolder),
    );
  }

  addOnSelectedFolderChange(callback: (_selectedFolder: TreeNode) => void) {
    this.onSelectedFolderChangeCallbacks.push(callback);
  }

  getChildFolders(folder: TreeNode) {
    return folder.children?.filter((child) => child.type === 'folder');
  }

  getItemByName(folderName: string) {
    return this.itemByName[folderName];
  }

  private addItemToNameMap(folder: TreeNode) {
    this.itemByName[folder.name] = folder;

    folder?.children?.forEach(this.addItemToNameMap.bind(this));
  }

  private addItemPathToNameMap(folder: TreeNode, basePath: string = '') {
    const path = this.isRootDirectory(folder)
      ? ''
      : `${basePath}/${folder.name}`;

    if (!this.isRootDirectory(folder)) {
      this.itemPathByName[folder.name] = path;
    }

    folder?.children?.forEach((childItem) =>
      this.addItemPathToNameMap(childItem, path),
    );
  }

  private isRootDirectory(item: TreeNode) {
    return item.name === 'Root Folder';
  }
}
