import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `onOpenChange` — functionCall shape: each open/close gesture also runs consoleLog locally.
// Starts open, so the first trigger click is a close gesture (render-test only).
export const selectPanelOnopenchangeFnFixture: Fixture = {
  name: 'selectpanel-onopenchange-fn',
  messages: spSurface(
    'selectpanel-onopenchange-fn',
    {
      open: true,
      title: 'Apply labels',
      selectionVariant: 'multiple',
      onOpenChange: {
        functionCall: {call: 'consoleLog', args: {message: 'toggled'}, returnType: 'void'},
      },
    },
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
  ),
};
