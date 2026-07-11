import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Two coupled surfaces: an under-limit counter, and an over-limit value that forces error
// styling (the over-limit state only exists as a characterLimit x value combination).
type LimitCase = {surfaceId: string; value: string; characterLimit: number};

const CASES: LimitCase[] = [
  {surfaceId: 'textarea-character-limit-under', value: 'Short note', characterLimit: 40},
  {
    surfaceId: 'textarea-character-limit-over',
    value: 'This comment is definitely too long for the limit.',
    characterLimit: 10,
  },
];

function limitSurface({surfaceId, value, characterLimit}: LimitCase): A2uiMessage[] {
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Textarea', value, characterLimit}],
      },
    },
  ];
}

export const textareaCharacterLimitFixture: Fixture = {
  name: 'textarea-character-limit',
  messages: CASES.flatMap(limitSurface),
};
