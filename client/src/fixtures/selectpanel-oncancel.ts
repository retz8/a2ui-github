import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `onCancel` — modal cancel action (functionCall). Cancelling the modal runs consoleLog locally
// (render-test only).
export const selectPanelOncancelFixture: Fixture = {
  name: 'selectpanel-oncancel',
  messages: spSurface(
    'selectpanel-oncancel',
    {
      variant: 'modal',
      title: 'Apply labels',
      selectionVariant: 'multiple',
      onCancel: {
        functionCall: {call: 'consoleLog', args: {message: 'cancelled'}, returnType: 'void'},
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
