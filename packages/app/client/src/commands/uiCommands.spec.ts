//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
import { CommandRegistryImpl } from '@bfemulator/sdk-shared';
import { SharedConstants } from '@bfemulator/app-shared';

import { EditorActions, OpenEditorAction } from '../data/action/editorActions';
import {
  CONTENT_TYPE_APP_SETTINGS,
  DOCUMENT_ID_APP_SETTINGS,
} from '../constants';
import {
  NavBarActions,
  SelectNavBarAction,
} from '../data/action/navBarActions';
import {
  AzureLoginPromptDialogContainer,
  AzureLoginSuccessDialogContainer,
  BotCreationDialog,
  DialogService,
  SecretPromptDialogContainer,
} from '../ui/dialogs';
import * as editorHelpers from '../data/editorHelpers';
import { store } from '../data/store';
import {
  AzureAuthAction,
  AzureAuthWorkflow,
  invalidateArmToken,
} from '../data/action/azureAuthActions';

import { registerCommands } from './uiCommands';
jest.mock('../ui/dialogs', () => ({
  AzureLoginPromptDialogContainer: class {},
  AzureLoginSuccessDialogContainer: class {},
  BotCreationDialog: class {},
  DialogService: { showDialog: () => Promise.resolve(true) },
  SecretPromptDialog: class {},
}));

const Commands = SharedConstants.Commands.UI;

describe('the uiCommands', () => {
  let registry: CommandRegistryImpl;
  beforeAll(() => {
    registry = new CommandRegistryImpl();
    registerCommands(registry);
  });

  it('should showExplorer the welcome page when the ShowWelcomePage command is dispatched', async () => {
    const spy = jest.spyOn(editorHelpers, 'showWelcomePage');
    await registry.getCommand(Commands.ShowWelcomePage).handler();
    expect(spy).toHaveBeenCalled();
  });

  it('should call DialogService.showDialog when the ShowBotCreationDialog command is dispatched', async () => {
    const spy = jest.spyOn(DialogService, 'showDialog');
    const result = await registry
      .getCommand(Commands.ShowBotCreationDialog)
      .handler();
    expect(spy).toHaveBeenCalledWith(BotCreationDialog);
    expect(result).toBe(true);
  });

  it('should call DialogService.showDialog when the ShowSecretPromptDialog command is dispatched', async () => {
    const spy = jest.spyOn(DialogService, 'showDialog');
    const result = await registry
      .getCommand(Commands.ShowSecretPromptDialog)
      .handler();
    expect(spy).toHaveBeenCalledWith(SecretPromptDialogContainer);
    expect(result).toBe(true);
  });

  describe('should dispatch the appropriate action to the store', () => {
    it('when the SwitchNavBarTab command is dispatched', () => {
      // eslint-disable-next-line typescript/no-object-literal-type-assertion
      const arg: SelectNavBarAction = {} as SelectNavBarAction;
      store.dispatch = action => ((arg as any) = action);
      registry.getCommand(Commands.SwitchNavBarTab).handler('Do it Nauuuw!');
      expect(arg.type).toBe(NavBarActions.select);
      expect(arg.payload.selection).toBe('Do it Nauuuw!');
    });

    it('when the ShowAppSettings command is dispatched', () => {
      // eslint-disable-next-line typescript/no-object-literal-type-assertion
      const arg: OpenEditorAction = {} as OpenEditorAction;
      store.dispatch = action => ((arg as any) = action);
      registry.getCommand(Commands.ShowAppSettings).handler();
      expect(arg.type).toBe(EditorActions.open);
      expect(arg.payload.contentType).toBe(CONTENT_TYPE_APP_SETTINGS);
      expect(arg.payload.documentId).toBe(DOCUMENT_ID_APP_SETTINGS);
      expect(arg.payload.isGlobal).toBe(true);
    });

    it('when the SignInToAzure command is dispatched', async () => {
      // eslint-disable-next-line typescript/no-object-literal-type-assertion
      const arg: AzureAuthAction<AzureAuthWorkflow> = {} as AzureAuthAction<
        AzureAuthWorkflow
      >;
      store.dispatch = action => ((arg as any) = action);
      registry.getCommand(Commands.SignInToAzure).handler();
      expect(arg.payload.loginSuccessDialog).toBe(
        AzureLoginSuccessDialogContainer
      );
      expect(arg.payload.promptDialog).toBe(AzureLoginPromptDialogContainer);
    });

    it('when the InvalidateArmToken command is dispatched', async () => {
      // eslint-disable-next-line typescript/no-object-literal-type-assertion
      const arg: AzureAuthAction<void> = {} as AzureAuthAction<void>;
      store.dispatch = action => ((arg as any) = action);
      registry.getCommand(Commands.InvalidateAzureArmToken).handler();
      expect(arg).toEqual(invalidateArmToken());
    });
  });

  it('should set the proper href on the theme tag when the SwitchTheme command is dispatched', () => {
    const link = document.createElement('link');
    link.id = 'themeVars';
    document.querySelector('head').appendChild(link);
    registry.getCommand(Commands.SwitchTheme).handler('light', './light.css');
    expect(link.href).toBe('http://localhost/light.css');
  });
});
