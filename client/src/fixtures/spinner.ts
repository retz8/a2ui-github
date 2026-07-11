import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Default render: all props at their defaults (size medium, built-in srText "Loading",
// delay none — so the spinner is visible immediately).
export const spinnerFixture: Fixture = {
  name: 'spinner',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'spinner', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'spinner',
        components: [{id: 'root', component: 'Spinner'}],
      },
    },
  ],
};
