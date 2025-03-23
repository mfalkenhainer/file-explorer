import { TreeNode } from '../Models/TreeNode.model.ts';

export class DirectoryStateService {
  directoryRoot: TreeNode;
  selectedFolder: TreeNode;
  itemByName: Record<string, TreeNode> = {};
  onSelectedFolderChangeCallbacks: Function[] = [];

  constructor(_directoryRoot: TreeNode) {
    this.directoryRoot = _directoryRoot;
    this.selectedFolder = _directoryRoot;

    this.addItemToNameMap(_directoryRoot);
  }

  getDirectoryRoot() {
    return this.directoryRoot;
  }

  getSelectedFolder() {
    return this.selectedFolder;
  }

  setSelectedFolder(_selectedFolder: TreeNode) {
    this.selectedFolder = _selectedFolder;

    this.onSelectedFolderChangeCallbacks.forEach((callback) =>
      callback(this.selectedFolder),
    );
  }

  addOnSelectedFolderChange(callback: (_selectedFolder: TreeNode) => void) {
    this.onSelectedFolderChangeCallbacks.push(callback);
  }

  getChildFolders(folder: TreeNode) {
    return (folder?.children || []).filter((child) => child.type === 'folder');
  }

  getItemByName(folderName: string) {
    return this.itemByName[folderName];
  }

  private addItemToNameMap(folder: TreeNode) {
    this.itemByName[folder.name] = folder;

    (folder?.children || []).forEach(this.addItemToNameMap.bind(this));
  }
}
