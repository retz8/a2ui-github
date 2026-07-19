import {CATALOG_ID} from 'primer-a2ui-adapter';
import {anchor} from './selectpanel-helpers';
import type {Fixture} from './types';

// `children` as a dynamic template: one `SelectPanel.Item` (`tpl`) expanded over the bound array
// `/labels`, with per-row relative bindings (`text ← name`, `selected ← on`).
const surfaceId = 'selectpanel-children-template';

export const selectPanelChildrenTemplateFixture: Fixture = {
  name: 'selectpanel-children-template',
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
            children: {componentId: 'tpl', path: '/labels'},
          },
          ...anchor(),
          {id: 'tpl', component: 'SelectPanel.Item', text: {path: 'name'}, selected: {path: 'on'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId,
        path: '/',
        value: {
          labels: [
            {name: 'bug', on: true},
            {name: 'docs', on: false},
            {name: 'ci', on: false},
          ],
        },
      },
    },
  ],
};
