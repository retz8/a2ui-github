import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The same long text as the default fixture, but with a wider max-width so the truncation
// point is visually distinct from the 125px default.
const LONG = 'src/components/navigation/PrimaryNavigationMenu.tsx';

export const truncateMaxwidthFixture: Fixture = {
  name: 'truncate-maxwidth',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'truncate-maxwidth', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'truncate-maxwidth',
        components: [
          {id: 'root', component: 'Truncate', text: LONG, title: LONG, maxWidth: '300px'},
        ],
      },
    },
  ],
};
