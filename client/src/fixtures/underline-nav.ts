import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Base fixture: a static ChildList (array of ids) in a default UnderlineNav — a realistic repository
 * tab row. Carries the item leaf's literal axes: `text`, `href`, `aria-current` (Code is current),
 * `leadingVisual` (Icon, tabs 1–3), and `counter` (Issues 12, Pull requests 4). Settings is plain
 * text. The family's shared composed baseline; items always render inside a realistic UnderlineNav.
 */
export const underlineNavFixture: Fixture = {
  name: 'underline-nav',
  messages: surface('underline-nav', [
    {
      id: 'root',
      component: 'UnderlineNav',
      'aria-label': 'Repository',
      children: ['t1', 't2', 't3', 't4'],
    },
    {
      id: 't1',
      component: 'UnderlineNav.Item',
      text: 'Code',
      href: '#/code',
      'aria-current': 'page',
      leadingVisual: 'i1',
    },
    {id: 'i1', component: 'Icon', name: 'code'},
    {
      id: 't2',
      component: 'UnderlineNav.Item',
      text: 'Issues',
      href: '#/issues',
      counter: '12',
      leadingVisual: 'i2',
    },
    {id: 'i2', component: 'Icon', name: 'issue-opened'},
    {
      id: 't3',
      component: 'UnderlineNav.Item',
      text: 'Pull requests',
      href: '#/pulls',
      counter: '4',
      leadingVisual: 'i3',
    },
    {id: 'i3', component: 'Icon', name: 'git-pull-request'},
    {id: 't4', component: 'UnderlineNav.Item', text: 'Settings', href: '#/settings'},
  ]),
};
