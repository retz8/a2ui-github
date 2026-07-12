import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Interaction (event path) + bound `checked` (the path-binding proof). The radio's `checked`
 * is a controlled binding to `/selected` (initial `false`), so the click alone never checks the
 * radio — the deterministic agent's `select` response writes `/selected = true`, and that write
 * is what flips the radio, proving two-way data binding on the radio itself.
 *
 * The surface root (id `root`) is a `Stack` hosting `[radio, status]`. The `status` Text is the
 * agent's self-visible surface (swapped by the `select` response's updateComponents); the Stack
 * root now renders it, so the status-swap half is visible alongside the bound-`checked`
 * resolution on the radio (the CI proof of two-way binding).
 */
export const radioEventFixture: Fixture = {
  name: 'radio-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radio-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radio-event',
        components: [
          {id: 'root', component: 'Stack', align: 'start', children: ['radio', 'status']},
          {
            id: 'radio',
            component: 'Radio',
            value: 'option-1',
            name: 'radio-event',
            checked: {path: '/selected'},
            action: {event: {name: 'select', context: {value: 'option-1'}}},
          },
          {id: 'status', component: 'Text', text: 'Click to select'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'radio-event', path: '/', value: {selected: false}},
    },
  ],
};
