import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

/**
 * GroupExpand `items` (static array) + `label` + `pages` — the collapsed first page of a
 * "Repositories" group revealed behind a "Show more" control, with visuals and one nested
 * `trailingAction` (wired `functionCall`, render coverage of the nested-action shape).
 */
const messages: A2uiMessage[] = [
  {version: 'v0.9', createSurface: {surfaceId: 'navlist-groupexpand', catalogId: CATALOG_ID}},
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'navlist-groupexpand',
      components: [
        {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['grp']},
        {id: 'grp', component: 'NavList.Group', children: ['heading', 'expand']},
        {id: 'heading', component: 'NavList.GroupHeading', text: 'Repositories'},
        {
          id: 'expand',
          component: 'NavList.GroupExpand',
          label: 'Show more repositories',
          pages: 2,
          items: [
            {text: 'api', leadingVisual: 'repo', href: '#'},
            {text: 'web', leadingVisual: 'repo', trailingVisual: '3', href: '#'},
            {
              text: 'docs',
              leadingVisual: 'repo',
              href: '#',
              trailingAction: {
                icon: 'pin',
                label: 'Pin docs',
                action: {
                  functionCall: {
                    call: 'consoleLog',
                    args: {message: 'pin docs'},
                    returnType: 'void',
                  },
                },
              },
            },
            {text: 'infra', leadingVisual: 'repo', href: '#', ariaCurrent: 'page'},
          ],
        },
      ],
    },
  },
];

export const navlistGroupexpandFixture: Fixture = {
  name: 'navlist-groupexpand',
  messages,
};

/**
 * Same content as `navlist-groupexpand`, surfaced under a distinct id for the pagination behavior
 * test (clicking "Show more" reveals the next page from Primer-internal state; not baselined).
 */
export const navlistGroupexpandShowmoreFixture: Fixture = {
  name: 'navlist-groupexpand-showmore',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'navlist-groupexpand-showmore', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist-groupexpand-showmore',
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['grp']},
          {id: 'grp', component: 'NavList.Group', children: ['heading', 'expand']},
          {id: 'heading', component: 'NavList.GroupHeading', text: 'Repositories'},
          {
            id: 'expand',
            component: 'NavList.GroupExpand',
            label: 'Show more repositories',
            pages: 2,
            items: [
              {text: 'api', leadingVisual: 'repo', href: '#'},
              {text: 'web', leadingVisual: 'repo', trailingVisual: '3', href: '#'},
              {
                text: 'docs',
                leadingVisual: 'repo',
                href: '#',
                trailingAction: {
                  icon: 'pin',
                  label: 'Pin docs',
                  action: {
                    functionCall: {
                      call: 'consoleLog',
                      args: {message: 'pin docs'},
                      returnType: 'void',
                    },
                  },
                },
              },
              {text: 'infra', leadingVisual: 'repo', href: '#', ariaCurrent: 'page'},
            ],
          },
        ],
      },
    },
  ],
};
