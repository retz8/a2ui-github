import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Mini-gallery coupling root `required` with Label `requiredIndicator`: the asterisk is shown when
// required (default), and suppressed when the label sets requiredIndicator:false.
const CASES = [
  {surface: 'shown', requiredIndicator: undefined},
  {surface: 'suppressed', requiredIndicator: false},
] as const;

function requiredSurface(c: (typeof CASES)[number]): A2uiMessage[] {
  const surfaceId = `formcontrol-required-${c.surface}`;
  const label: Record<string, unknown> = {
    id: 'fc-label',
    component: 'FormControlLabel',
    text: 'Repository name',
  };
  if (c.requiredIndicator !== undefined) label.requiredIndicator = c.requiredIndicator;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'FormControl',
            required: true,
            children: ['fc-label', 'fc-input'],
          },
          label,
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
        ],
      },
    },
  ];
}

export const formcontrolRequiredFixture: Fixture = {
  name: 'formcontrol-required',
  messages: CASES.flatMap(requiredSurface),
};
