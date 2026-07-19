import {spSurface, spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `variant: modal` — a centered modal (backdrop) rather than an anchored panel. `onCancel` is the
// modal's cancel hook (a local functionCall).
export const selectPanelVariantModalFixture: Fixture = {
  name: 'selectpanel-variant-modal',
  messages: spSurface(
    'selectpanel-variant-modal',
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
