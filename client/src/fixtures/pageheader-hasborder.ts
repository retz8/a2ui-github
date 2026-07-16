import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * The visually-distinct `hasBorder` state: the divider border below the header is legible without
 * the full assembly, so this fixture carries just a TitleArea + Title.
 */
export const pageheaderHasborderFixture: Fixture = {
  name: 'pageheader-hasborder',
  messages: surface('pageheader-hasborder', [
    {id: 'root', component: 'PageHeader', hasBorder: true, children: ['ta']},
    {id: 'ta', component: 'PageHeader.TitleArea', children: ['title']},
    {id: 'title', component: 'PageHeader.Title', text: 'Pull request #42'},
  ]),
};
