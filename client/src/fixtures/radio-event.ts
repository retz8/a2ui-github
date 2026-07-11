import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Interaction (event path) + bound `checked` (the path-binding proof). The radio's `checked`
 * is a controlled binding to `/selected` (initial `false`), so the click alone never checks the
 * radio — the deterministic agent's `select` response writes `/selected = true`, and that write
 * is what flips the radio, proving two-way data binding on the radio itself.
 *
 * The `status` Text is the agent's self-visible surface (swapped by the `select` response's
 * updateComponents). This catalog ships no layout/container primitive, so an unreferenced
 * sibling is not rendered under the single-`root` render; `status` becomes visible once such a
 * primitive lands. The CI proof carried here is the bound-`checked` resolution on the radio.
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
          {
            id: 'root',
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
