import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Interaction — the `onClickOutside` functionCall path (+ `closeOnOutsideClick` collapse). The
 * two props are semantically coupled: `onClickOutside` only fires while `open && closeOnOutsideClick`
 * (useDetails), so this fixture sets both. A click outside the open disclosure runs `windowAlert`
 * locally (not via the injected handler) and collapses the disclosure.
 */
export const detailsClickoutsideFnFixture: Fixture = {
  name: 'details-clickoutside-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'details-clickoutside-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'details-clickoutside-fn',
        components: [
          {
            id: 'root',
            component: 'Details',
            summary: 'sum',
            children: ['b1'],
            open: true,
            closeOnOutsideClick: true,
            onClickOutside: {
              functionCall: {
                call: 'windowAlert',
                args: {message: 'clicked outside'},
                returnType: 'void',
              },
            },
          },
          {id: 'sum', component: 'Text', text: 'More info'},
          {id: 'b1', component: 'Text', text: 'First'},
        ],
      },
    },
  ],
};
