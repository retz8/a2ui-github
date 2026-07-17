import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Visually-distinct state: `loadingCounters` — the counters show a loading animation until every
 * count resolves. Coupled with `counter` (meaningless without counters present): 3 tabs each with a
 * counter, the root's `loadingCounters` set true.
 */
export const underlineNavLoadingFixture: Fixture = {
  name: 'underline-nav-loading',
  messages: surface('underline-nav-loading', [
    {
      id: 'root',
      component: 'UnderlineNav',
      'aria-label': 'Repository',
      loadingCounters: true,
      children: ['t1', 't2', 't3'],
    },
    {id: 't1', component: 'UnderlineNav.Item', text: 'Code', href: '#/code', counter: '12'},
    {id: 't2', component: 'UnderlineNav.Item', text: 'Issues', href: '#/issues', counter: '4'},
    {
      id: 't3',
      component: 'UnderlineNav.Item',
      text: 'Pull requests',
      href: '#/pulls',
      counter: '8',
    },
  ]),
};
