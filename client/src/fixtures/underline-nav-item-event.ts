import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * `Item.action` — event (→ agent) + coupling + bound `counter` (the two-way-binding proof). A 2-tab
 * nav; the "Pull requests" tab (`tab-pulls`) fires the `select` event (context `{tab: 'pulls'}`) and
 * binds its `counter` to `/pullsCount` (initially "4"). No tab carries `aria-current` initially — the
 * deterministic agent's response marks `tab-pulls` current (the underline appears) and writes
 * `/pullsCount = "5"`; the write is visible through the `counter ← /pullsCount` coupling (4 → 5), the
 * half that proves two-way data binding on the component itself.
 */
export const underlineNavItemEventFixture: Fixture = {
  name: 'underline-nav-item-event',
  messages: surface(
    'underline-nav-item-event',
    [
      {
        id: 'root',
        component: 'UnderlineNav',
        'aria-label': 'Repository',
        children: ['t0', 'tab-pulls'],
      },
      {id: 't0', component: 'UnderlineNav.Item', text: 'Overview', href: '#/overview'},
      {
        id: 'tab-pulls',
        component: 'UnderlineNav.Item',
        text: 'Pull requests',
        href: '#/pulls',
        counter: {path: '/pullsCount'},
        action: {event: {name: 'select', context: {tab: 'pulls'}}},
      },
    ],
    {pullsCount: '4'},
  ),
};
