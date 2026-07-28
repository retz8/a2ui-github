import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * The validation consumption path for the functions adopted in task 7.9: a submit control bound to
 * `not(required(...))` over the field it guards, so the button is inert until the field is filled
 * and enables itself as the user types — entirely on the client, with no agent round trip.
 *
 * This is the shape a compose-and-confirm surface needs: `required` returns the validity, `not`
 * inverts it into a `disabled`, and both are nested function calls resolved by the binder rather
 * than values written to the data model.
 */
export const validationGateFnFixture: Fixture = {
  name: 'validation-gate-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'validation-gate-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'validation-gate-fn',
        components: [
          {
            id: 'root',
            component: 'Stack',
            direction: 'vertical',
            gap: 'normal',
            children: ['field', 'submit'],
          },
          {
            id: 'field',
            component: 'TextInput',
            value: {path: '/review/body'},
            placeholder: 'Review comment',
          },
          {
            id: 'submit',
            component: 'Button',
            child: 'submit-label',
            variant: 'primary',
            // A function bound as a VALUE is the bare FunctionCall, and its args nest the same
            // way; the `{functionCall: ...}` wrapper below is the Action envelope, which applies
            // only to `action`.
            disabled: {
              call: 'not',
              args: {
                value: {
                  call: 'required',
                  args: {value: {path: '/review/body'}},
                  returnType: 'boolean',
                },
              },
              returnType: 'boolean',
            },
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'review submitted'},
                returnType: 'void',
              },
            },
          },
          {id: 'submit-label', component: 'Text', text: 'Submit review'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'validation-gate-fn', path: '/', value: {review: {body: ''}}},
    },
  ],
};
