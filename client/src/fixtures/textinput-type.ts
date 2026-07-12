import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// One surface per type enum value, each with a literal value (password renders masked).
const TYPES = ['text', 'password', 'email', 'number', 'search', 'tel', 'url'] as const;

const VALUES: Record<(typeof TYPES)[number], string> = {
  text: 'octocat',
  password: 'hunter2',
  email: 'octocat@github.com',
  number: '42',
  search: 'repositories',
  tel: '+1 555 0100',
  url: 'https://github.com',
};

function typeSurface(type: (typeof TYPES)[number]): A2uiMessage[] {
  const surfaceId = `textinput-type-${type}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'TextInput', value: VALUES[type], type}],
      },
    },
  ];
}

export const textinputTypeFixture: Fixture = {
  name: 'textinput-type',
  messages: TYPES.flatMap(typeSurface),
};
