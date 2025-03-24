import { BaseComponentController } from '../../BaseComponentController.ts';
import { TreeNode } from '../../../Models/TreeNode.model.ts';
import { DirectoryStateService } from '../../../Services/DirectoryState.service.ts';
import $ from 'jquery';
import ClickEvent = JQuery.ClickEvent;
import './FolderSidebar.styles.css';

interface FolderSidebarState {
  folder: TreeNode;
  isExpanded: boolean;
  level: number;
  childFolderStates?: FolderSidebarState[];
}

const folderView = (
  folderState: FolderSidebarState,
  selectedFolder: TreeNode,
): string => `
  <div class="folder-row ${folderState.folder.name === selectedFolder.name ? 'selected' : ''}">
    ${[...Array(folderState.level)].map(() => '<div class="level-buffer"></div>').join('')}
    ${`<button id="${folderState.folder.name}" class="expand-button">
              <span class="material-icons">${folderState.isExpanded ? 'arrow_drop_down' : 'arrow_right'}</span>
         </button>`}
    <button id="${folderState.folder.name}" class="select-button">
        <span class="material-icons">folder</span>
        ${folderState.folder.name}
    </button>
  </div>
  ${
    folderState.isExpanded && folderState.childFolderStates
      ? folderState.childFolderStates
          .sort((_folderStateA, _folderStateB) =>
            _folderStateA.folder.name > _folderStateB.folder.name ? 1 : -1,
          )
          .map((childFolderState) =>
            folderView(childFolderState, selectedFolder),
          )
          .join('')
      : ''
  }
`;

const folderSidebarView = (
  folderState: FolderSidebarState,
  selectedFolder: TreeNode,
) => `
  <div class="folders-sidebar-container">
    ${folderView(folderState, selectedFolder)}
  </div>
`;

export class FolderSidebarController extends BaseComponentController {
  selectedFolder: TreeNode;
  folderState: FolderSidebarState;
  folderStateByName: Record<string, FolderSidebarState> = {};

  constructor(
    rootElement: JQuery,
    directoryStateService: DirectoryStateService,
  ) {
    super(rootElement, directoryStateService);

    this.selectedFolder = this.directoryStateService.getSelectedFolder();
    this.folderState =
      this.convertTreeNodeToFolderSidebarStateAndAddToIdMapRecursively(
        directoryStateService.getDirectoryRoot(),
      );
  }

  renderView() {
    this.rootElement.html(
      folderSidebarView(this.folderState, this.selectedFolder),
    );

    this.setupListeners();
  }

  setupListeners() {
    $('button.expand-button').click(this.handleExpandClick.bind(this));

    $('button.select-button').click(this.handleSelectClick.bind(this));

    this.directoryStateService.addOnSelectedFolderChange(
      this.handleSelectedFolderChange.bind(this),
    );
  }

  private handleExpandClick(event: ClickEvent) {
    const clickedButtonId = event.currentTarget.id;

    this.folderStateByName[clickedButtonId].isExpanded =
      !this.folderStateByName[clickedButtonId].isExpanded;

    this.renderView();
  }

  private handleSelectClick(event: ClickEvent) {
    const clickedButtonId = event.currentTarget.id;

    this.directoryStateService.setSelectedFolder(
      this.folderStateByName[clickedButtonId].folder,
    );
  }

  private handleSelectedFolderChange(_selectedFolder: TreeNode) {
    const selectedFolderState = this.folderStateByName[_selectedFolder.name];

    if (!selectedFolderState.childFolderStates) {
      selectedFolderState.childFolderStates = _selectedFolder.children?.reduce(
        (childStates, childItem) => {
          if (childItem.type === 'folder') {
            childStates.push(
              this.convertTreeNodeToFolderSidebarStateAndAddToIdMapRecursively(
                childItem,
                selectedFolderState.level + 1,
              ),
            );
          }
          return childStates;
        },
        [] as FolderSidebarState[],
      );
    }

    this.selectedFolder = _selectedFolder;
    selectedFolderState.isExpanded = true;

    this.renderView();
  }

  private convertTreeNodeToFolderSidebarStateAndAddToIdMapRecursively(
    folder: TreeNode,
    level: number = 0,
  ): FolderSidebarState {
    const folderState: FolderSidebarState = {
      folder,
      isExpanded: level === 0,
      level,
      childFolderStates: this.directoryStateService
        .getChildFolders(folder)
        ?.map((childFolder) =>
          this.convertTreeNodeToFolderSidebarStateAndAddToIdMapRecursively(
            childFolder,
            level + 1,
          ),
        ),
    };

    this.folderStateByName[folderState.folder.name] = folderState;

    return folderState;
  }
}
