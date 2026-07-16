import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * The NavList family's composed baseline: a fully assembled navigation built from already-shipped
 * filler leaves (`Text`, `Icon`, `CounterLabel`) that visually exercises every slot leaf's
 * `children` at once — `Item`, `SubNav`, `LeadingVisual`, `TrailingVisual`, `TrailingAction`,
 * `Group`, `GroupHeading`, `Divider`, `Description` are all present. All 10 subcomponent leaves
 * appear here; `SubNav`, `LeadingVisual`, `TrailingVisual`, and `Divider` carry no fixture of
 * their own and are covered inside this baseline.
 */
export const navlistFixture: Fixture = {
  name: 'navlist',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'navlist', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'navlist',
        components: [
          {
            id: 'root',
            component: 'NavList',
            'aria-label': 'Repository',
            children: ['it1', 'it2', 'div1', 'grp'],
          },

          // it1 — Dashboard (current page, leading icon).
          {
            id: 'it1',
            component: 'NavList.Item',
            href: '#/dashboard',
            'aria-current': 'page',
            children: ['it1-lv', 'it1-label'],
          },
          {id: 'it1-lv', component: 'NavList.LeadingVisual', children: ['it1-icon']},
          {id: 'it1-icon', component: 'Icon', name: 'home'},
          {id: 'it1-label', component: 'Text', text: 'Dashboard'},

          // it2 — Pull requests (expanded sub-nav, counter, description, trailing action).
          {
            id: 'it2',
            component: 'NavList.Item',
            href: '#/pulls',
            defaultOpen: true,
            children: ['it2-lv', 'it2-label', 'it2-tv', 'it2-desc', 'it2-subnav', 'it2-ta'],
          },
          {id: 'it2-lv', component: 'NavList.LeadingVisual', children: ['it2-icon']},
          {id: 'it2-icon', component: 'Icon', name: 'git-pull-request'},
          {id: 'it2-label', component: 'Text', text: 'Pull requests'},
          {id: 'it2-tv', component: 'NavList.TrailingVisual', children: ['it2-counter']},
          {id: 'it2-counter', component: 'CounterLabel', count: '8'},
          {
            id: 'it2-desc',
            component: 'NavList.Description',
            variant: 'inline',
            text: 'Open and merged',
          },
          {id: 'it2-subnav', component: 'NavList.SubNav', children: ['sn1', 'sn2']},
          {id: 'sn1', component: 'NavList.Item', href: '#/pulls/open', children: ['sn1-label']},
          {id: 'sn1-label', component: 'Text', text: 'Open'},
          {id: 'sn2', component: 'NavList.Item', href: '#/pulls/closed', children: ['sn2-label']},
          {id: 'sn2-label', component: 'Text', text: 'Closed'},
          {
            id: 'it2-ta',
            component: 'NavList.TrailingAction',
            icon: 'pin-icon',
            accessibility: {label: 'Pin'},
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'pin'}, returnType: 'void'},
            },
          },
          {id: 'pin-icon', component: 'Icon', name: 'pin'},

          // div1 — Divider between the items and the Support group.
          {id: 'div1', component: 'NavList.Divider'},

          // grp — Support group with a heading and two items.
          {
            id: 'grp',
            component: 'NavList.Group',
            children: ['grp-heading', 'grp-docs', 'grp-community'],
          },
          {id: 'grp-heading', component: 'NavList.GroupHeading', text: 'Support'},
          {id: 'grp-docs', component: 'NavList.Item', href: '#/docs', children: ['grp-docs-label']},
          {id: 'grp-docs-label', component: 'Text', text: 'Docs'},
          {
            id: 'grp-community',
            component: 'NavList.Item',
            href: '#/community',
            children: ['grp-community-label'],
          },
          {id: 'grp-community-label', component: 'Text', text: 'Community'},
        ],
      },
    },
  ],
};
