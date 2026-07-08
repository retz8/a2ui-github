import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The tense enum. `future` needs a future instant to render a forward tense ("in 3 days");
// `auto`/`past` use a past instant. Both offsets are a coarse 3 days so the text stays stable.
const TENSES = ['auto', 'past', 'future'] as const;
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
const threeDaysAhead = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

function tenseSurface(tense: (typeof TENSES)[number]): A2uiMessage[] {
  const surfaceId = `relative-time-tense-${tense}`;
  const datetime = tense === 'future' ? threeDaysAhead : threeDaysAgo;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'RelativeTime', datetime, tense}],
      },
    },
  ];
}

export const relativeTimeTensesFixture: Fixture = {
  name: 'relative-time-tenses',
  messages: TENSES.flatMap(tenseSurface),
};
