import { FileExplorerController } from './Components/FileExplorerView/FileExplorer.controller.ts';
import { DirectoryStateService } from './Services/DirectoryState.service.ts';
import $ from 'jquery';
import 'material-icons/iconfont/material-icons.css';
import './main.styles.css';
import { DirectoryApiService } from './Services/DirectoryApi.service.ts';
import * as exampleDirectory from './__mock__/example_directory.json';
import { TreeNode } from './Models/TreeNode.model.ts';

const useLiveData = true;

const appRoot = $('#app');

const directoryApiService = new DirectoryApiService('http://localhost:3000');
const rootDirectory = useLiveData
  ? await directoryApiService.retrieveRootDirectory()
  : (exampleDirectory as unknown as TreeNode);

const directoryLookupService = new DirectoryStateService(rootDirectory);

new FileExplorerController(appRoot, directoryLookupService).renderView();
