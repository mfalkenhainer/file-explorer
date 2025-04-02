import { SidebarFolderState } from '../Models/SidebarFolderState.model.ts';
import { TreeNode } from '../Models/TreeNode.model.ts';
import { DirectoryStateService } from './DirectoryState.service.ts';

export class SidebarStateService {
  directoryStateService: DirectoryStateService;
  sidebarFolderStatesByName: Record<string, SidebarFolderState>;

  constructor(directoryStateService: DirectoryStateService) {
    this.directoryStateService = directoryStateService;
    this.sidebarFolderStatesByName =
      this.convertTreeNodeToFolderSidebarStateRecursively(
        this.directoryStateService.getDirectoryRoot(),
      );

    this.directoryStateService.addOnItemAdditions(
      this.onItemAdditionsCallback.bind(this),
    );
  }

  public getState(): Record<string, SidebarFolderState> {
    return this.sidebarFolderStatesByName;
  }

  public getStateForName(name: string): SidebarFolderState {
    return this.sidebarFolderStatesByName[name];
  }

  public async toggleIsExpanded(folderName: string): Promise<void> {
    this.sidebarFolderStatesByName[folderName].isExpanded =
      !this.sidebarFolderStatesByName[folderName].isExpanded;

    if (this.sidebarFolderStatesByName[folderName].isExpanded) {
      const expandedFolder =
        this.directoryStateService.getItemByName(folderName);

      console.log(expandedFolder);
      if (!expandedFolder.children) {
        await this.directoryStateService.retrieveChildItemsFromApi(
          expandedFolder,
        );
      }
    }
  }

  private convertTreeNodeToFolderSidebarStateRecursively(
    folder: TreeNode,
    level: number = 0,
  ): Record<string, SidebarFolderState> {
    return {
      ...(folder.type === 'folder'
        ? {
            [folder.name]: {
              name: folder.name,
              isExpanded: level === 0,
              level,
            },
          }
        : {}),
      ...(folder.children && folder.children.length > 0
        ? folder.children.reduce(
            (map, child) => ({
              ...map,
              ...this.convertTreeNodeToFolderSidebarStateRecursively(
                child,
                level + 1,
              ),
            }),
            {},
          )
        : {}),
    };
  }

  private onItemAdditionsCallback(
    parentFolder: TreeNode,
    newItems: TreeNode[],
  ) {
    newItems.forEach((item) => {
      if (item.type === 'folder') {
        this.sidebarFolderStatesByName[item.name] = {
          name: item.name,
          isExpanded: false,
          level: this.sidebarFolderStatesByName[parentFolder.name].level + 1,
        };
      }
    });
  }
}
