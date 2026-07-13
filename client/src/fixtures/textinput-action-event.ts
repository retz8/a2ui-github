import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Event path + full agent round-trip. The surface root (id `root`) is a Stack hosting a
 * TextInput (`value ← /query`, initial "octocat"; `validationStatus ← /validation`, initial
 * unset) whose `trailingAction` is a TextInput.Action emitting a `search` event carrying the
 * current /query value, and a sibling `result` Text. The deterministic server answers by writing
 * /validation to 'success' (visible through the input's validationStatus coupling) and swapping
 * the result Text to echo the received query (see agent/deterministic_agent/fixtures/search.json).
 */
export const textinputActionEventFixture: Fixture = {
  name: 'textinput-action-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput-action-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-action-event',
        components: [
          {id: 'root', component: 'Stack', align: 'start', children: ['field', 'result']},
          {
            id: 'field',
            component: 'TextInput',
            value: {path: '/query'},
            validationStatus: {path: '/validation'},
            accessibility: {label: 'Search repositories'},
            trailingAction: 'search-action',
          },
          {
            id: 'search-action',
            component: 'TextInput.Action',
            icon: 'search-icon',
            accessibility: {label: 'Search'},
            action: {event: {name: 'search', context: {query: {path: '/query'}}}},
          },
          {id: 'search-icon', component: 'Icon', name: 'search'},
          {id: 'result', component: 'Text', text: ''},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'textinput-action-event', path: '/', value: {query: 'octocat'}},
    },
  ],
};
