import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery over `Description.variant` + `truncate`: an inline description (beside the label), a
// block description (below the label), and a narrow inline description that truncates on overflow.
const CASES = [
  {key: 'inline', variant: 'inline', truncate: false, text: 'opened 2 days ago'},
  {
    key: 'block',
    variant: 'block',
    truncate: false,
    text: 'A detailed summary shown below the label',
  },
  {
    key: 'truncate',
    variant: 'inline',
    truncate: true,
    text: 'A very long description that should truncate on overflow within the row',
  },
] as const;

function caseSurface(c: (typeof CASES)[number]): A2uiMessage[] {
  const surfaceId = `actionlist-description-${c.key}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'ActionList', role: 'menu', children: ['item']},
          {id: 'item', component: 'ActionList.Item', children: ['item-label', 'item-desc']},
          {id: 'item-label', component: 'Text', text: 'View pull request'},
          {
            id: 'item-desc',
            component: 'ActionList.Description',
            text: c.text,
            variant: c.variant,
            truncate: c.truncate,
          },
        ],
      },
    },
  ];
}

export const actionlistDescriptionFixture: Fixture = {
  name: 'actionlist-description',
  messages: CASES.flatMap(caseSurface),
};
