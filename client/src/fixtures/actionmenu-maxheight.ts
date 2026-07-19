import {menuFixture} from './actionmenu-helpers';
import type {Comp} from './stack-helpers';
import type {Fixture} from './types';

// Long list capped by maxHeight: the menu scrolls within a fixed maximum height.
const longContent: Comp[] = [
  {
    id: 'list',
    component: 'ActionList',
    children: [
      'item-0',
      'item-1',
      'item-2',
      'item-3',
      'item-4',
      'item-5',
      'item-6',
      'item-7',
      'item-8',
      'item-9',
      'item-10',
      'item-11',
    ],
  },
  {id: 'item-0', component: 'ActionList.Item', children: ['item-0-label']},
  {id: 'item-0-label', component: 'Text', text: 'View pull request'},
  {id: 'item-1', component: 'ActionList.Item', children: ['item-1-label']},
  {id: 'item-1-label', component: 'Text', text: 'Edit'},
  {id: 'item-2', component: 'ActionList.Item', children: ['item-2-label']},
  {id: 'item-2-label', component: 'Text', text: 'Copy link'},
  {id: 'item-3', component: 'ActionList.Item', children: ['item-3-label']},
  {id: 'item-3-label', component: 'Text', text: 'Pin issue'},
  {id: 'item-4', component: 'ActionList.Item', children: ['item-4-label']},
  {id: 'item-4-label', component: 'Text', text: 'Lock conversation'},
  {id: 'item-5', component: 'ActionList.Item', children: ['item-5-label']},
  {id: 'item-5-label', component: 'Text', text: 'Transfer issue'},
  {id: 'item-6', component: 'ActionList.Item', children: ['item-6-label']},
  {id: 'item-6-label', component: 'Text', text: 'Convert to discussion'},
  {id: 'item-7', component: 'ActionList.Item', children: ['item-7-label']},
  {id: 'item-7-label', component: 'Text', text: 'Add to project'},
  {id: 'item-8', component: 'ActionList.Item', children: ['item-8-label']},
  {id: 'item-8-label', component: 'Text', text: 'Create branch'},
  {id: 'item-9', component: 'ActionList.Item', children: ['item-9-label']},
  {id: 'item-9-label', component: 'Text', text: 'Subscribe'},
  {id: 'item-10', component: 'ActionList.Item', children: ['item-10-label']},
  {id: 'item-10-label', component: 'Text', text: 'Report content'},
  {id: 'item-11', component: 'ActionList.Item', children: ['item-11-label']},
  {id: 'item-11-label', component: 'Text', text: 'Delete branch'},
];

export const actionmenuMaxheightFixture: Fixture = menuFixture('actionmenu-maxheight', {
  open: true,
  overlayProps: {maxHeight: 'small'},
  content: longContent,
});
