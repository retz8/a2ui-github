import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Literal content channel, mirroring the shipped Heading leaf. */
export const titleFixture: Fixture = {
  name: 'title',
  messages: surface('title', [
    {id: 'root', component: 'PageHeader.Title', text: 'Pull request #42'},
  ]),
};
