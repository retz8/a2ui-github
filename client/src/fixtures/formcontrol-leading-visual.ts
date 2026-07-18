import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Horizontal FormControl wrapping a Checkbox, with FormControl.LeadingVisual's `child` filled by
// an Icon (bell).
export const formcontrolLeadingVisualFixture: Fixture = {
  name: 'formcontrol-leading-visual',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'formcontrol-leading-visual', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'formcontrol-leading-visual',
        components: [
          {
            id: 'root',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['fc-leading', 'fc-label', 'fc-input'],
          },
          {id: 'fc-leading', component: 'FormControlLeadingVisual', child: 'fc-icon'},
          {id: 'fc-icon', component: 'Icon', name: 'bell', accessibility: {label: 'notifications'}},
          {id: 'fc-label', component: 'FormControlLabel', text: 'Enable notifications'},
          {id: 'fc-input', component: 'Checkbox', checked: false},
        ],
      },
    },
  ],
};
