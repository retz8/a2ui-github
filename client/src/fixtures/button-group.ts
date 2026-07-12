import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

/** A filler Button (`id`) plus its label Text (`${id}-label`); Button's `action` is required, so a
 * harmless local `consoleLog` is wired. */
function labeledButton(id: string, label: string): Array<Record<string, unknown>> {
  return [
    {
      id,
      component: 'Button',
      child: `${id}-label`,
      action: {functionCall: {call: 'consoleLog', args: {message: id}, returnType: 'void'}},
    },
    {id: `${id}-label`, component: 'Text', text: label},
  ];
}

/** Base fixture: a static ChildList (array of ids) in a default ButtonGroup (no role, `as: div`). */
export const buttonGroupFixture: Fixture = {
  name: 'button-group',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-group', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-group',
        components: [
          {id: 'root', component: 'ButtonGroup', children: ['b1', 'b2', 'b3']},
          ...labeledButton('b1', 'Save'),
          ...labeledButton('b2', 'Cancel'),
          ...labeledButton('b3', 'Delete'),
        ],
      },
    },
  ] as A2uiMessage[],
};
