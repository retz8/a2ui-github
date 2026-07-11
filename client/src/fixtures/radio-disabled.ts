import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

/**
 * Two surfaces exercising the disabled visual on both selection states:
 * disabled-unchecked and disabled-checked. A gallery yields one fullPage baseline.
 */
function disabledSurface(surfaceId: string, checked: boolean): A2uiMessage[] {
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'Radio',
            value: 'option-1',
            name: 'radio-demo',
            disabled: true,
            ...(checked ? {checked: true} : {}),
          },
        ],
      },
    },
  ];
}

export const radioDisabledFixture: Fixture = {
  name: 'radio-disabled',
  messages: [
    ...disabledSurface('radio-disabled-unchecked', false),
    ...disabledSurface('radio-disabled-checked', true),
  ],
};
