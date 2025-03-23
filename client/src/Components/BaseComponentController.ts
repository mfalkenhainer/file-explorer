import { DirectoryStateService } from '../Services/DirectoryState.service.ts';

export interface BaseComponentControllerParams {
  rootElement: JQuery;
  directoryStateService: DirectoryStateService;
}

export abstract class BaseComponentController {
  rootElement: JQuery;
  directoryStateService: DirectoryStateService;

  constructor(
    _rootElement: JQuery,
    _directoryStateService: DirectoryStateService,
  ) {
    this.rootElement = _rootElement;
    this.directoryStateService = _directoryStateService;
  }

  abstract renderView(): void;
}
