import { DirectoryViewerController } from '../DirectoryViewer.controller.ts';
import $ from 'jquery';
import { DirectoryStateService } from '../../../../Services/DirectoryState.service.ts';
import * as mockDirectory from '../../../../__mock__/example_directory.json';
import { TreeNode } from '../../../../Models/TreeNode.model.ts';

describe('Directory Viewer', () => {
  let rootElement: JQuery;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="directory-viewer"></div>
    `;

    rootElement = $('#directory-viewer');
  });

  it('should render the contents of the selected folder', () => {
    // Assemble
    const directoryStateService = new DirectoryStateService(
      mockDirectory as unknown as TreeNode,
    );
    const directoryViewerController = new DirectoryViewerController(
      rootElement,
      directoryStateService,
    );

    // Act
    directoryViewerController.renderView();

    // Assert
    expect($('.item-row .name-column').first().text()).toEqual(
      mockDirectory.children![0].name,
    );
  });

  it('should scale item size correctly', () => {
    // Assemble
    const directoryStateService = new DirectoryStateService(
      mockDirectory as unknown as TreeNode,
    );
    const directoryViewerController = new DirectoryViewerController(
      rootElement,
      directoryStateService,
    );

    // Act
    directoryViewerController.renderView();

    // Assert
    expect($('.item-row:contains("Description.rtf")').html()).toContain(
      '2.0 KB',
    );
  });

  it('should call directory state service to update the selected folder on row click', () => {
    // Assemble
    const directoryStateService = new DirectoryStateService(
      mockDirectory as unknown as TreeNode,
    );
    jest.spyOn(directoryStateService, 'setSelectedFolder');
    const directoryViewerController = new DirectoryViewerController(
      rootElement,
      directoryStateService,
    );
    directoryViewerController.renderView();

    const expectedSelectedFolder = mockDirectory.children!.find(
      (child) => child.name === 'Documents',
    );

    // Act
    $('.item-row:contains("Documents")').trigger('click');

    // Assert
    expect(directoryStateService.setSelectedFolder).toHaveBeenCalledWith(
      expectedSelectedFolder,
    );
  });

  it('should show the selected folder contents on row click', () => {
    // Assemble
    const directoryStateService = new DirectoryStateService(
      mockDirectory as unknown as TreeNode,
    );
    jest.spyOn(directoryStateService, 'setSelectedFolder');
    const directoryViewerController = new DirectoryViewerController(
      rootElement,
      directoryStateService,
    );
    directoryViewerController.renderView();

    // Act
    $('.item-row:contains("Documents")').trigger('click');

    // Assert
    expect($('.item-row .name-column').first().text()).toEqual('Example.txt');
  });

  it('should show the empty folder message when the selected folder is empty', () => {
    // Assemble
    const directoryStateService = new DirectoryStateService(
      mockDirectory as unknown as TreeNode,
    );
    jest.spyOn(directoryStateService, 'setSelectedFolder');
    const directoryViewerController = new DirectoryViewerController(
      rootElement,
      directoryStateService,
    );
    directoryViewerController.renderView();

    // Act
    $('.item-row:contains("Images")').trigger('click');

    // Assert
    expect($('.empty-folder-message').first().text().trim()).toEqual(
      'This folder is empty',
    );
  });
});
