import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** TrailingAction functionCall path — runs the registered consoleLog locally. */
export const navlistTrailingactionFnFixture: Fixture = {
  name: 'navlist-trailingaction-fn',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'navlist-trailingaction-fn', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist-trailingaction-fn',
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['it']},
          {id: 'it', component: 'NavList.Item', href: '#', children: ['it-lv', 'it-label', 'ta']},
          {id: 'it-lv', component: 'NavList.LeadingVisual', children: ['it-icon']},
          {id: 'it-icon', component: 'Icon', name: 'gear'},
          {id: 'it-label', component: 'Text', text: 'Settings'},
          {
            id: 'ta',
            component: 'NavList.TrailingAction',
            icon: 'pin-icon-fn',
            accessibility: {label: 'Pin Settings'},
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'navlist-trailingaction-fn clicked'},
                returnType: 'void',
              },
            },
          },
          {id: 'pin-icon-fn', component: 'Icon', name: 'pin'},
        ],
      },
    },
  ],
};
