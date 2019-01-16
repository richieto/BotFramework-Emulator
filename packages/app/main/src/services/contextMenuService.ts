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

import { Menu, MenuItemConstructorOptions } from 'electron';

export class ContextMenuService {
  private static currentMenu: Menu;

  public static showMenuAndWaitForInput(
    options: Partial<MenuItemConstructorOptions>[] = []
  ): Promise<any> {
    if (ContextMenuService.currentMenu) {
      ContextMenuService.currentMenu.closePopup();
    }
    return new Promise(resolve => {
      const clickHandler = menuItem => {
        ContextMenuService.currentMenu = null;
        resolve(menuItem);
      };

      const template = options.map(option => {
        option.click = clickHandler;
        return option;
      });
      const menu = (ContextMenuService.currentMenu = Menu.buildFromTemplate(
        template
      ));

      menu.popup({});
    });
  }
}
