import { BaseComponentController } from '../BaseComponentController.ts';
import { FolderSidebarController } from './FolderSidebar/FolderSidebar.controller.ts';
import { DirectoryViewerController } from './DirectoryViewer/DirectoryViewer.controller.ts';
import $ from 'jquery';
import './FileExplorer.styles.css';
import { SidebarStateService } from '../../Services/SidebarState.service.ts';

const fileExplorerView = `
  <div class="page-container">
    <nav id="folder-sidebar-navigation" class="nav-container"></nav>
    <main id="directory-viewer" class="main-container"></main>
  </div>
`;

export class FileExplorerController extends BaseComponentController {
  renderView() {
    this.rootElement.html(fileExplorerView);

    new FolderSidebarController(
      $('#folder-sidebar-navigation'),
      this.directoryStateService,
      new SidebarStateService(this.directoryStateService),
    ).renderView();

    new DirectoryViewerController(
      $('#directory-viewer'),
      this.directoryStateService,
    ).renderView();
  }
}
