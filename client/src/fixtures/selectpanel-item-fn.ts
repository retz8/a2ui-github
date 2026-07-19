import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `SelectPanel.Item.action` — functionCall (local): selecting the item runs consoleLog locally.
export const selectPanelItemFnFixture: Fixture = {
  name: 'selectpanel-item-fn',
  messages: spSurface(
    'selectpanel-item-fn',
    {selectionVariant: 'multiple', title: 'Apply labels'},
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug', {
        action: {
          functionCall: {call: 'consoleLog', args: {message: 'item selected'}, returnType: 'void'},
        },
      }),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
  ),
};
