import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TreeNode } from './Models/TreeNode.model';
import * as exampleDirectory from './__mock__/example_directory.json';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): TreeNode {
    return exampleDirectory as unknown as TreeNode;
  }
}
