import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// A representative sample of the name enum; size/fill left at their defaults.
const NAMES = ['alert', 'check', 'git-pull-request', 'rocket', 'x'] as const;

function nameSurface(name: (typeof NAMES)[number]): A2uiMessage[] {
  const surfaceId = `icon-name-${name}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Icon', name, accessibility: {label: name}}],
      },
    },
  ];
}

export const iconNamesFixture: Fixture = {
  name: 'icon-names',
  messages: NAMES.flatMap(nameSurface),
};
