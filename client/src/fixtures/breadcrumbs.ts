import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Base fixture: a static ChildList (array of ids) in a default Breadcrumbs (overflow `wrap`,
 * variant `normal`). The canonical trail — Home / Repositories / Settings — with the last crumb
 * `selected` (the current page).
 */
export const breadcrumbsFixture: Fixture = {
  name: 'breadcrumbs',
  messages: surface('breadcrumbs', [
    {id: 'root', component: 'Breadcrumbs', children: ['c0', 'c1', 'c2']},
    {id: 'c0', component: 'BreadcrumbsItem', label: 'Home', href: '/'},
    {id: 'c1', component: 'BreadcrumbsItem', label: 'Repositories', href: '/repos'},
    {id: 'c2', component: 'BreadcrumbsItem', label: 'Settings', href: '/settings', selected: true},
  ]),
};
