import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * `addNewItem.action` on the functionCall path — choosing the "create a value not in the list" row
 * runs a local `consoleLog` (render-test only). The typed value would be read by the agent from the
 * input's bound `/query`; here the row simply fires the local function.
 */
export const autocompleteAddnewFnFixture: Fixture = {
  name: 'autocomplete-addnew-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'autocomplete-addnew-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-addnew-fn',
        components: [
          {id: 'root', component: 'Autocomplete', children: ['input', 'overlay']},
          {
            id: 'input',
            component: 'Autocomplete.Input',
            value: '',
            accessibility: {label: 'Filter labels'},
          },
          {id: 'overlay', component: 'Autocomplete.Overlay', children: ['menu']},
          {
            id: 'menu',
            component: 'Autocomplete.Menu',
            accessibility: {label: 'Labels'},
            items: [
              {id: 'bug', text: 'Bug'},
              {id: 'feature', text: 'Feature'},
              {id: 'docs', text: 'Docs'},
            ],
            addNewItem: {
              id: 'add-new',
              text: 'Create new label',
              action: {
                functionCall: {
                  call: 'consoleLog',
                  args: {message: 'create label'},
                  returnType: 'void',
                },
              },
            },
          },
        ],
      },
    },
  ],
};
