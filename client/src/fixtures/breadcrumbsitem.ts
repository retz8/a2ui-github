import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Base fixture: the crumb leaf renders only inside a `Breadcrumbs` (the Stack.Item /
 * SegmentedControl.Button precedent). Three crumbs with literal labels, each carrying an `href`.
 */
export const breadcrumbsitemFixture: Fixture = {
  name: 'breadcrumbsitem',
  messages: surface('breadcrumbsitem', [
    {id: 'root', component: 'Breadcrumbs', children: ['c0', 'c1', 'c2']},
    {id: 'c0', component: 'BreadcrumbsItem', label: 'Home', href: '/'},
    {id: 'c1', component: 'BreadcrumbsItem', label: 'Repositories', href: '/repos'},
    {id: 'c2', component: 'BreadcrumbsItem', label: 'Settings', href: '/settings'},
  ]),
};
