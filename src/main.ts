import { FileExplorerController } from './Components/FileExplorerView/FileExplorer.controller.ts';
import { TreeNode } from './Models/TreeNode.model.ts';
import { DirectoryStateService } from './Services/DirectoryState.service.ts';
import $ from 'jquery';
import * as exampleDirectory from './__mock__/example_directory.json';
import 'material-icons/iconfont/material-icons.css';
import './main.styles.css';

const appRoot = $('#app');

const directoryLookupService = new DirectoryStateService(
  exampleDirectory as unknown as TreeNode,
);

new FileExplorerController(appRoot, directoryLookupService).renderView();
