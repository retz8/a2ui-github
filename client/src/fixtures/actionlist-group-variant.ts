import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

// Gallery over `Group.variant`: a realistic grouped list per value.
const VARIANTS = ['filled', 'subtle'] as const;

export const actionlistGroupVariantFixture: Fixture = {
  name: 'actionlist-group-variant',
  messages: VARIANTS.flatMap(variant =>
    surface(`actionlist-group-variant-${variant}`, [
      {id: 'root', component: 'ActionList', children: ['grp']},
      {id: 'grp', component: 'ActionList.Group', variant, children: ['gh', 'gi0', 'gi1']},
      {id: 'gh', component: 'ActionList.GroupHeading', as: 'h3', children: ['gh-label']},
      {id: 'gh-label', component: 'Text', text: 'Pull request #42'},
      ...labelItem('gi0', 'View pull request'),
      ...labelItem('gi1', 'Merge pull request'),
    ]),
  ),
};
