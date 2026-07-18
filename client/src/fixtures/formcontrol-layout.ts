import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery: the root `layout` enum — vertical (Label + TextInput) and horizontal (Label + Checkbox,
// the layout Primer's horizontal mode exists for).
function verticalSurface(): A2uiMessage[] {
  const surfaceId = 'formcontrol-layout-vertical';
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'FormControl',
            layout: 'vertical',
            children: ['fc-label', 'fc-input'],
          },
          {id: 'fc-label', component: 'FormControlLabel', text: 'Repository name'},
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
        ],
      },
    },
  ];
}

function horizontalSurface(): A2uiMessage[] {
  const surfaceId = 'formcontrol-layout-horizontal';
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['fc-label', 'fc-input'],
          },
          {id: 'fc-label', component: 'FormControlLabel', text: 'Enable notifications'},
          {id: 'fc-input', component: 'Checkbox', checked: false},
        ],
      },
    },
  ];
}

export const formcontrolLayoutFixture: Fixture = {
  name: 'formcontrol-layout',
  messages: [...verticalSurface(), ...horizontalSurface()],
};
