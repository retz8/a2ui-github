import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const statelabelFixture: Fixture = {
  name: 'statelabel',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'statelabel', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'statelabel',
        components: [{id: 'root', component: 'StateLabel', text: 'Open', status: 'issueOpened'}],
      },
    },
  ],
};
