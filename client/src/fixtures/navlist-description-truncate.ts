import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** The Description `truncate` state with a bound `text` in a narrow container. */
export const navlistDescriptionTruncateFixture: Fixture = {
  name: 'navlist-description-truncate',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'navlist-description-truncate', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist-description-truncate',
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['it']},
          {id: 'it', component: 'NavList.Item', href: '#', children: ['it-label', 'it-desc']},
          {id: 'it-label', component: 'Text', text: 'Repository'},
          {
            id: 'it-desc',
            component: 'NavList.Description',
            variant: 'inline',
            truncate: true,
            text: {path: '/desc'},
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'navlist-description-truncate',
        path: '/',
        value: {
          desc: 'A very long description that overflows the available inline space and is truncated',
        },
      },
    },
  ],
};
