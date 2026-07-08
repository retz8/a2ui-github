import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonLoadingFixture: Fixture = {
  name: 'button-loading',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-loading', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-loading',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            loading: true,
            loadingAnnouncement: 'Saving changes…',
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Loading'},
        ],
      },
    },
  ],
};
