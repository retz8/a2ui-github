import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** Group `title` bound to a data-model path (path-binding coverage). */
export const navlistGroupBoundFixture: Fixture = {
  name: 'navlist-group-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'navlist-group-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist-group-bound',
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Settings', children: ['grp']},
          {
            id: 'grp',
            component: 'NavList.Group',
            title: {path: '/section'},
            children: ['it1', 'it2'],
          },
          {id: 'it1', component: 'NavList.Item', href: '#/profile', children: ['it1-label']},
          {id: 'it1-label', component: 'Text', text: 'Profile'},
          {id: 'it2', component: 'NavList.Item', href: '#/account', children: ['it2-label']},
          {id: 'it2-label', component: 'Text', text: 'Account'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'navlist-group-bound',
        path: '/',
        value: {section: 'Personal settings'},
      },
    },
  ],
};
