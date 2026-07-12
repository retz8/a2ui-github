import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The `as` (rendering element) enum on a single Truncate: the display-equivalent wrapper
// elements. Each surface's text is its tag name padded long enough to overflow the default
// max-width so the truncation renders; title is the same string.
const AS = ['div', 'span', 'p'] as const;

function asSurface(as: (typeof AS)[number]): A2uiMessage[] {
  const surfaceId = `truncate-as-${as}`;
  const text = `${as} element rendered as the ${as} tag, padded long enough to overflow`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Truncate', text, title: text, as}],
      },
    },
  ];
}

export const truncateAsFixture: Fixture = {
  name: 'truncate-as',
  messages: AS.flatMap(asSurface),
};
