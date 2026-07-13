import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

/**
 * Base render + the `open` axis: one surface per state (collapsed, expanded), each with a static
 * `summary` slot and a two-item static `children` body. `open` is a literal per surface; the
 * two-way write-back is proven separately by the `details-bound` render-test assertion.
 */
const STATES = [
  {suffix: 'collapsed', open: false},
  {suffix: 'expanded', open: true},
] as const;

function stateSurface({suffix, open}: (typeof STATES)[number]): A2uiMessage[] {
  const surfaceId = `details-${suffix}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'Details', summary: 'sum', children: ['b1', 'b2'], open},
          {id: 'sum', component: 'Text', text: 'More info'},
          {id: 'b1', component: 'Text', text: 'First'},
          {id: 'b2', component: 'Text', text: 'Second'},
        ],
      },
    },
  ];
}

export const detailsOpenFixture: Fixture = {
  name: 'details-open',
  messages: STATES.flatMap(stateSurface),
};
