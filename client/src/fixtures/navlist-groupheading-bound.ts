import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/** GroupHeading `text` bound to a data-model path (content-channel path binding). */
export const navlistGroupheadingBoundFixture: Fixture = {
  name: 'navlist-groupheading-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'navlist-groupheading-bound', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist-groupheading-bound',
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['grp']},
          {id: 'grp', component: 'NavList.Group', children: ['heading', 'docs']},
          {id: 'heading', component: 'NavList.GroupHeading', text: {path: '/heading'}},
          {id: 'docs', component: 'NavList.Item', href: '#/docs', children: ['docs-label']},
          {id: 'docs-label', component: 'Text', text: 'Docs'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'navlist-groupheading-bound',
        path: '/',
        value: {heading: 'Resources'},
      },
    },
  ],
};
