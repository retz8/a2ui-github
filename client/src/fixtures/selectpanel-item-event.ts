import {CATALOG_ID} from 'primer-a2ui-adapter';
import {spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `SelectPanel.Item.action` — event (→ agent) + coupling + bound `selected`. The `bug` item's
// `selected` is bound to `/sel/bug` (initially false); clicking it first writes `true`
// optimistically (so the event's `context.selected` carries the new value), then fires
// `label-select`. The deterministic agent echoes `/sel/bug` (visible through the `selected ←
// /sel/bug` coupling — the checkmark follows the data model) and swaps the always-rendered trigger
// `anchor-label` (self-visible).
const surfaceId = 'selectpanel-item-event';

export const selectPanelItemEventFixture: Fixture = {
  name: 'selectpanel-item-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'SelectPanel',
            anchor: 'trigger',
            open: true,
            selectionVariant: 'multiple',
            title: 'Apply labels',
            children: ['bug', 'documentation', 'enhancement'],
          },
          {
            id: 'trigger',
            component: 'Button',
            child: 'anchor-label',
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'trigger'}, returnType: 'void'},
            },
          },
          {id: 'anchor-label', component: 'Text', text: 'Labels'},
          spItem('bug', 'bug', {
            selected: {path: '/sel/bug'},
            action: {event: {name: 'label-select', context: {selected: {path: '/sel/bug'}}}},
          }),
          spItem('documentation', 'documentation'),
          spItem('enhancement', 'enhancement'),
        ],
      },
    },
    {version: 'v0.9', updateDataModel: {surfaceId, path: '/', value: {sel: {bug: false}}}},
  ],
};
