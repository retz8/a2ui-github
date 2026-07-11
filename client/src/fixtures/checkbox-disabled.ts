import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

/**
 * Mini-gallery: `disabled` renders distinctly per check-state (dimmed empty box vs dimmed
 * checkmark), so the two combinations are semantically coupled into one fixture — two surfaces,
 * one PNG.
 */
const CASES = [
  {suffix: 'unchecked', checked: false, label: 'Disabled, unchecked'},
  {suffix: 'checked', checked: true, label: 'Disabled, checked'},
] as const;

function disabledSurface(c: (typeof CASES)[number]): A2uiMessage[] {
  const surfaceId = `checkbox-disabled-${c.suffix}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'Checkbox',
            checked: c.checked,
            disabled: true,
            accessibility: {label: c.label},
          },
        ],
      },
    },
  ];
}

export const checkboxDisabledFixture: Fixture = {
  name: 'checkbox-disabled',
  messages: CASES.flatMap(disabledSurface),
};
