import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Bound content channel (path binding). */
export const titleBoundFixture: Fixture = {
  name: 'title-bound',
  messages: surface(
    'title-bound',
    [{id: 'root', component: 'PageHeader.Title', text: {path: '/pr/title'}}],
    {pr: {title: 'Bound title'}},
  ),
};
