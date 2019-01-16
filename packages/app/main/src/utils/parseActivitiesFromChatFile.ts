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

import * as path from 'path';

import { CustomActivity } from './conversation';

// eslint-disable-next-line typescript/no-var-requires
const { fork } = require('child_process');
const chatdown = require.resolve('chatdown/bin/chatdown');

/**
 * Uses the chatdown library to convert a .chat file into a list of conversation activities
 * @param file The .chat file to parse
 */
export const parseActivitiesFromChatFile = async (
  file: string
): Promise<CustomActivity[]> => {
  let activities: CustomActivity[] = [];

  if (path.extname(file) !== '.chat') {
    throw new Error('Can only use chatdown on .chat files.');
  }

  // convert conversation to list of activities using chatdown
  try {
    // The cwd needs to be relative to the .chat file
    // in the case of activities that include attachments.
    // This takes a bit longer to process but achieves
    // the equivalent result as if the chatdown cli was used directly.
    activities = (await new Promise((resolve, reject) => {
      const childProcess = fork(chatdown, [file], {
        cwd: path.dirname(file),
        silent: true,
      });

      let str = '';
      childProcess.stdout.on('data', (data: Uint8Array) => {
        str += data.toString();
      });

      childProcess.stdout.on('end', () => {
        resolve(JSON.parse(str));
      });

      childProcess.stdout.on('error', err => {
        reject(err);
      });
    })) as CustomActivity[];
  } catch (err) {
    throw new Error(
      `Error while converting .chat file to list of activites: ${err}`
    );
  }

  return activities;
};
