import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The `as` (rendering element) enum on a single Text; other props left at their defaults.
const AS = ['span', 'p', 'div', 'label', 'strong', 'em', 'small'] as const;

function asSurface(as: (typeof AS)[number]): A2uiMessage[] {
  const surfaceId = `text-as-${as}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Text', text: as, as}],
      },
    },
  ];
}

export const textAsFixture: Fixture = {
  name: 'text-as',
  messages: AS.flatMap(asSurface),
};
