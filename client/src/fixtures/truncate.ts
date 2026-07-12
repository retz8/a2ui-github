import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// A literal Truncate at the default 125px max-width. The canned text is long enough to
// overflow so the ellipsis truncation actually renders.
const LONG = 'src/components/navigation/PrimaryNavigationMenu.tsx';

export const truncateFixture: Fixture = {
  name: 'truncate',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'truncate', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'truncate',
        components: [{id: 'root', component: 'Truncate', text: LONG, title: LONG}],
      },
    },
  ],
};
