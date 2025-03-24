import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { TreeNode } from './Models/TreeNode.model';
import * as exampleDirectory from './__mock__/example_directory.json';
import * as path from 'path';
import * as fs from 'fs';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStaticDirectory(): TreeNode {
    return exampleDirectory as unknown as TreeNode;
  }

  @Get('root')
  getSystemRootFolder(): TreeNode {
    const contents = fs.readdirSync('/');

    return {
      name: 'Root Folder',
      type: 'folder',
      modified: new Date(),
      size: 0,
      children: contents.map((item) =>
        this.convertDirectoryItemToTreeNode('/', item),
      ),
    };
  }

  @Get('child/:path')
  getSystemChildFolder(@Param() params): TreeNode[] {
    const baseDirectory = path.join('/', params.path.replaceAll('_', '/'));
    const contents = fs.readdirSync(baseDirectory);

    return contents.map((item) =>
      this.convertDirectoryItemToTreeNode(baseDirectory, item),
    );
  }

  private convertDirectoryItemToTreeNode(
    baseDirectory: string,
    itemName: string,
  ): TreeNode {
    const itemStats = fs.statSync(path.join(baseDirectory, itemName));

    return {
      name: itemName,
      type: itemStats.isDirectory() ? 'folder' : 'file',
      modified: itemStats.mtime,
      size: itemStats.size,
    };
  }
}
