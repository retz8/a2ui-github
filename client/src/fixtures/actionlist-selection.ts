import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery over the root `selectionVariant` × `Item.selected` (literal): a realistic 3-item
// assignee menu per variant, with 1-2 items literally selected so the checkmark / radio / checkbox
// indicator shows.
const VARIANTS = ['single', 'radio', 'multiple'] as const;

const ROWS: {id: string; label: string; selected?: boolean}[] = [
  {id: 'r0', label: 'Assign to me', selected: true},
  {id: 'r1', label: 'Assign to octocat'},
  {id: 'r2', label: 'Assign to hubot'},
];

function variantSurface(selectionVariant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `actionlist-selection-${selectionVariant}`;
  const secondSelected = selectionVariant === 'multiple';
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'ActionList',
            role: 'listbox',
            selectionVariant,
            children: ROWS.map(r => r.id),
          },
          ...ROWS.flatMap((r, i) => [
            {
              id: r.id,
              component: 'ActionList.Item',
              selected: Boolean(r.selected) || (secondSelected && i === 1),
              children: [`${r.id}-label`],
            },
            {id: `${r.id}-label`, component: 'Text', text: r.label},
          ]),
        ],
      },
    },
  ];
}

export const actionlistSelectionFixture: Fixture = {
  name: 'actionlist-selection',
  messages: VARIANTS.flatMap(variantSurface),
};
