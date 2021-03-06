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

import { BotInfo, newNotification, SharedConstants } from '@bfemulator/app-shared';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { beginAdd } from '../../../data/action/notificationActions';
import { openContextMenuForBot } from '../../../data/action/welcomePageActions';
import { RootState } from '../../../data/store';
import { CommandServiceImpl } from '../../../platform/commands/commandServiceImpl';
import { RecentBotsList, RecentBotsListProps } from './recentBotsList';

const mapStateToProps = (state: RootState, ownProps: { [propName: string]: any }): RecentBotsListProps => {
  return {
    recentBots: state.bot.botFiles,
    ...ownProps
  };
};

const mapDispatchToProps = (dispatch: (action: Action) => void): RecentBotsListProps => {
  return {
    onDeleteBotClick: (path: string): Promise<any> =>
      CommandServiceImpl.remoteCall(SharedConstants.Commands.Bot.RemoveFromBotList, path),
    sendNotification: (error: Error) =>
      dispatch(beginAdd(newNotification(`An Error occurred on the Recent Bots List: ${ error }`))),
    showContextMenuForBot: (bot: BotInfo): void => dispatch(openContextMenuForBot(bot)),
  };
};

export const RecentBotsListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentBotsList);
