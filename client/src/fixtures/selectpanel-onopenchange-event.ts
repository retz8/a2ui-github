import {CATALOG_ID} from 'primer-a2ui-adapter';
import {spItem} from './selectpanel-helpers';
import type {Fixture} from './types';

// `onOpenChange` — event shape (agent-coupled: `panel-toggle`). `open` is bound to `/open`
// (initially false); opening fires the event. The response writes the panel `title ← /panel/title`
// (visible when open, the binding-proof half) and swaps the always-rendered trigger `anchor-label`
// (self-visible in both states). Render-test drives the gesture.
const surfaceId = 'selectpanel-onopenchange-event';

export const selectPanelOnopenchangeEventFixture: Fixture = {
  name: 'selectpanel-onopenchange-event',
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
            open: {path: '/open'},
            selectionVariant: 'multiple',
            title: {path: '/panel/title'},
            onOpenChange: {event: {name: 'panel-toggle', context: {}}},
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
          spItem('bug', 'bug'),
          spItem('documentation', 'documentation'),
          spItem('enhancement', 'enhancement'),
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId,
        path: '/',
        value: {open: false, panel: {title: 'Apply labels'}},
      },
    },
  ],
};
