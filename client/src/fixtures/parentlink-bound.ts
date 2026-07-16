import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Bound content + destination: path bindings on both DynamicStrings, semantically coupled as a
 * data-driven link.
 */
export const parentlinkBoundFixture: Fixture = {
  name: 'parentlink-bound',
  messages: surface(
    'parentlink-bound',
    [
      {
        id: 'root',
        component: 'PageHeader.ParentLink',
        text: {path: '/parent/label'},
        href: {path: '/parent/url'},
      },
    ],
    {parent: {label: 'Issues', url: '/repos/acme/issues'}},
  ),
};
