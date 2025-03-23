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
  childFolderStates: FolderSidebarState[];
}

const folderView = (
  folderState: FolderSidebarState,
  selectedFolder: TreeNode,
): string => `
  <div class="folder-row ${folderState.folder.name === selectedFolder.name ? 'selected' : ''}">
    ${
      folderState.childFolderStates.length > 0
        ? `<button id="${folderState.folder.name}" class="expand-button">
              <span class="material-icons">${folderState.isExpanded ? 'arrow_drop_down' : 'arrow_right'}</span>
           </button>`
        : '<div class="expand-button-placeholder"></div>'
    }
    <button id="${folderState.folder.name}" class="select-button">
        <span class="material-icons">folder</span>
        ${folderState.folder.name}
    </button>
  </div>
  ${
    folderState.isExpanded
      ? folderState.childFolderStates
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
  folderStateById: Record<string, FolderSidebarState> = {};

  constructor(
    rootElement: JQuery,
    directoryStateService: DirectoryStateService,
  ) {
    super(rootElement, directoryStateService);

    this.selectedFolder = this.directoryStateService.getSelectedFolder();
    this.folderState = this.convertTreeNodeToFolderSidebarStateAndAddToIdMap(
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

    this.folderStateById[clickedButtonId].isExpanded =
      !this.folderStateById[clickedButtonId].isExpanded;

    this.renderView();
  }

  private handleSelectClick(event: ClickEvent) {
    const clickedButtonId = event.currentTarget.id;

    this.directoryStateService.setSelectedFolder(
      this.folderStateById[clickedButtonId].folder,
    );
  }

  private handleSelectedFolderChange(_selectedFolder: TreeNode) {
    this.folderStateById[this.selectedFolder.name].isExpanded = true;
    this.selectedFolder = _selectedFolder;

    this.renderView();
  }

  private convertTreeNodeToFolderSidebarStateAndAddToIdMap(
    folder: TreeNode,
    level: number = 0,
  ): FolderSidebarState {
    const folderState: FolderSidebarState = {
      folder,
      isExpanded: false,
      level,
      childFolderStates: this.directoryStateService
        .getChildFolders(folder)
        .map((childFolder) =>
          this.convertTreeNodeToFolderSidebarStateAndAddToIdMap(
            childFolder,
            level + 1,
          ),
        ),
    };

    this.folderStateById[folderState.folder.name] = folderState;

    return folderState;
  }
}
