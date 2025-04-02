import { BaseComponentController } from '../../BaseComponentController.ts';
import { TreeNode } from '../../../Models/TreeNode.model.ts';
import { DirectoryStateService } from '../../../Services/DirectoryState.service.ts';
import $ from 'jquery';
import ClickEvent = JQuery.ClickEvent;
import './FolderSidebar.styles.css';
import { SidebarStateService } from '../../../Services/SidebarState.service.ts';
import { SidebarFolderState } from '../../../Models/SidebarFolderState.model.ts';

const folderView = (
  sidebarStateService: SidebarStateService,
  folderState: SidebarFolderState,
  folder: TreeNode,
  selectedFolder: TreeNode,
): string => `
  <div class="folder-row ${folderState.name === selectedFolder.name ? 'selected' : ''}">
    ${[...Array(folderState.level)].map(() => '<div class="level-buffer"></div>').join('')}
    ${`<button id="${folderState.name}" class="expand-button">
              <span class="material-icons">${folderState.isExpanded ? 'arrow_drop_down' : 'arrow_right'}</span>
         </button>`}
    <button id="${folderState.name}" class="select-button">
        <span class="material-icons">folder</span>
        ${folderState.name}
    </button>
  </div>
  ${
    folderState.isExpanded && folder.children
      ? folder.children
          .sort((_folderA, _folderB) =>
            _folderA.name > _folderB.name ? 1 : -1,
          )
          .map((childFolder) =>
            childFolder.type === 'folder'
              ? folderView(
                  sidebarStateService,
                  sidebarStateService.getStateForName(childFolder.name),
                  childFolder,
                  selectedFolder,
                )
              : '',
          )
          .join('')
      : ''
  }
`;

const folderSidebarView = (
  sidebarStateService: SidebarStateService,
  rootFolder: TreeNode,
  selectedFolder: TreeNode,
) => `
  <div class="folders-sidebar-container">
    ${folderView(sidebarStateService, sidebarStateService.getStateForName(rootFolder.name), rootFolder, selectedFolder)}
  </div>
`;

export class FolderSidebarController extends BaseComponentController {
  selectedFolder: TreeNode;
  sidebarStateService: SidebarStateService;

  constructor(
    rootElement: JQuery,
    directoryStateService: DirectoryStateService,
    sidebarStateService: SidebarStateService,
  ) {
    super(rootElement, directoryStateService);

    this.selectedFolder = this.directoryStateService.getSelectedFolder();

    this.sidebarStateService = sidebarStateService;
  }

  renderView() {
    this.rootElement.html(
      folderSidebarView(
        this.sidebarStateService,
        this.directoryStateService.getDirectoryRoot(),
        this.selectedFolder,
      ),
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

  private async handleExpandClick(event: ClickEvent) {
    const clickedButtonName = event.currentTarget.id;
    await this.sidebarStateService.toggleIsExpanded(clickedButtonName);

    this.renderView();
  }

  private handleSelectClick(event: ClickEvent) {
    const clickedButtonName = event.currentTarget.id;
    const folder = this.directoryStateService.getItemByName(clickedButtonName);

    this.directoryStateService.setSelectedFolder(folder);
  }

  private handleSelectedFolderChange(_selectedFolder: TreeNode) {
    const selectedFolderState = this.sidebarStateService.getStateForName(
      _selectedFolder.name,
    );

    this.selectedFolder = _selectedFolder;
    selectedFolderState.isExpanded = true;

    this.renderView();
  }
}
