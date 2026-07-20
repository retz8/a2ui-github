import {spSurface, spItem, spIcon} from './selectpanel-helpers';
import type {Comp} from './stack-helpers';
import type {Fixture} from './types';

// Composed baseline: an open multi-select label picker exercising the container + item leaves
// together — leading-visual icons, an inline description, a danger item, a disabled item, two
// seeded-selected items, and a footer secondary action.
const comps: Comp[] = [
  spItem('bug', 'bug', {
    leadingVisual: 'bug-icon',
    description: "Something isn't working",
    selected: true,
  }),
  spIcon('bug-icon', 'bug'),
  spItem('enhancement', 'enhancement', {leadingVisual: 'enh-icon', selected: true}),
  spIcon('enh-icon', 'light-bulb'),
  spItem('documentation', 'documentation', {leadingVisual: 'doc-icon'}),
  spIcon('doc-icon', 'book'),
  spItem('wontfix', 'wontfix', {variant: 'danger', description: 'Will not be worked on'}),
  spItem('duplicate', 'duplicate', {disabled: true}),
  {
    id: 'edit',
    component: 'Button',
    child: 'edit-label',
    action: {
      functionCall: {call: 'consoleLog', args: {message: 'edit labels'}, returnType: 'void'},
    },
  },
  {id: 'edit-label', component: 'Text', text: 'Edit labels'},
];

export const selectPanelFixture: Fixture = {
  name: 'selectpanel',
  messages: spSurface(
    'selectpanel',
    {
      title: 'Apply labels',
      subtitle: 'Select up to 10',
      selectionVariant: 'multiple',
      placeholderText: 'Filter labels',
      secondaryAction: 'edit',
    },
    ['bug', 'enhancement', 'documentation', 'wontfix', 'duplicate'],
    comps,
  ),
};
