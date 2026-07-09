import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const linkBoundFixture: Fixture = {
  name: 'link-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'link-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'link-bound',
        components: [
          {id: 'root', component: 'Link', text: {path: '/linkText'}, href: {path: '/linkUrl'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'link-bound',
        path: '/',
        value: {linkText: 'Bound link', linkUrl: 'https://github.com'},
      },
    },
  ],
};
