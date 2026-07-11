import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// One surface per validationStatus enum value, each with a short literal value.
const STATUSES = ['error', 'success'] as const;

function statusSurface(validationStatus: (typeof STATUSES)[number]): A2uiMessage[] {
  const surfaceId = `textarea-validation-${validationStatus}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'Textarea', value: validationStatus, validationStatus},
        ],
      },
    },
  ];
}

export const textareaValidationFixture: Fixture = {
  name: 'textarea-validation',
  messages: STATUSES.flatMap(statusSurface),
};
