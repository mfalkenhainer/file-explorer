import { BaseComponentController } from '../../BaseComponentController.ts';
import { TreeNode } from '../../../Models/TreeNode.model.ts';
import './DirectoryViewer.styles.css';
import { DirectoryStateService } from '../../../Services/DirectoryState.service.ts';
import ClickEvent = JQuery.ClickEvent;
import $ from 'jquery';

const KB = 1028;
const MB = KB * KB;
const GB = MB * KB;

const scaleSize = (size: number): string => {
  if (size < KB) {
    return `${size} B`;
  }

  if (size < MB) {
    return `${(size / KB).toFixed(1)} KB`;
  }

  if (size < GB) {
    return `${(size / MB).toFixed(1)} MB`;
  }

  return `${(size / GB).toFixed(1)} GB`;
};

const directoryViewerView = (selectedFolder: TreeNode) => `
  <div class="folder-contents-container">
    <div class="header-row">
      <span class="icon-column"></span>
      <span class="name-column">Name</span>
      <span class="modified-column">Date Modified</span>
      <span class="size-column">File Size</span>
    </div>
    ${
      selectedFolder?.children && selectedFolder.children.length > 0
        ? selectedFolder.children
            .sort((childA, childB) =>
              childA.type > childB.type
                ? -1
                : childA.name > childB.name
                  ? 1
                  : -1,
            )
            .map(
              (childItem): string => `
                <div class="item-row" id="${childItem.name}" tabindex="0">
                  <span class="icon-column">
                    ${
                      childItem.type === 'folder'
                        ? '<span class="material-icons">folder</span>'
                        : '<span class="material-icons">insert_drive_file</span>'
                    }
                  </span>
                  <span class="name-column">${childItem.name}</span>
                  <span class="modified-column">${new Date(childItem.modified).toDateString()}</span>
                  <span class="size-column">${scaleSize(childItem.size)}</span>
                </div>
              `,
            )
            .join('')
        : `
          <div class="empty-folder-message">
            This folder is empty
          </div>
        `
    }
  </div>
`;

export class DirectoryViewerController extends BaseComponentController {
  constructor(
    rootElement: JQuery,
    directoryStateService: DirectoryStateService,
  ) {
    super(rootElement, directoryStateService);

    this.directoryStateService.addOnSelectedFolderChange(
      this.renderView.bind(this),
    );
  }

  renderView() {
    this.rootElement.html(
      directoryViewerView(this.directoryStateService.getSelectedFolder()),
    );

    this.setupListeners();
  }

  setupListeners() {
    $('.item-row').click(this.handleRowClick.bind(this));
  }

  private handleRowClick(event: ClickEvent) {
    const clickedItem = this.directoryStateService.getItemByName(
      event.currentTarget.id,
    );

    if (clickedItem.type === 'folder') {
      this.directoryStateService.setSelectedFolder(clickedItem);
    }
  }
}
