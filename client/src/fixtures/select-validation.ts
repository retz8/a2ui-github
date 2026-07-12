import {labelOptions, surface} from './select-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// One surface per validationStatus enum value, each with the standard three options.
const STATUSES = ['error', 'success'] as const;

function statusSurface(validationStatus: (typeof STATUSES)[number]): A2uiMessage[] {
  return surface(`select-validation-${validationStatus}`, [
    {
      id: 'root',
      component: 'Select',
      value: 'feature',
      validationStatus,
      children: ['o1', 'o2', 'o3'],
    },
    ...labelOptions(),
  ]);
}

export const selectValidationFixture: Fixture = {
  name: 'select-validation',
  messages: STATUSES.flatMap(statusSurface),
};
