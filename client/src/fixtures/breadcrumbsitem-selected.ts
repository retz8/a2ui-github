import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Visually-distinct state — `selected`: the last crumb is the current page. It carries `selected`
 * and, faithful to the current-page crumb, no `href` (active styling + `aria-current="page"`,
 * non-navigating).
 */
export const breadcrumbsitemSelectedFixture: Fixture = {
  name: 'breadcrumbsitem-selected',
  messages: surface('breadcrumbsitem-selected', [
    {id: 'root', component: 'Breadcrumbs', children: ['c0', 'c1', 'c2']},
    {id: 'c0', component: 'BreadcrumbsItem', label: 'Home', href: '/'},
    {id: 'c1', component: 'BreadcrumbsItem', label: 'Repositories', href: '/repos'},
    {id: 'c2', component: 'BreadcrumbsItem', label: 'Settings', selected: true},
  ]),
};
