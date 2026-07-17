import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Literal content + destination, mirroring the shipped Link leaf. */
export const parentlinkFixture: Fixture = {
  name: 'parentlink',
  messages: surface('parentlink', [
    {id: 'root', component: 'PageHeader.ParentLink', text: 'Issues', href: '/repos/acme/issues'},
  ]),
};
