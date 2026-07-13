import {labelOptions, surface} from './select-helpers';
import type {Fixture} from './types';

/** Base fixture: a static ChildList of three SelectOptions with a literal selected value. */
export const selectFixture: Fixture = {
  name: 'select',
  messages: surface('select', [
    {id: 'root', component: 'Select', value: 'feature', children: ['o1', 'o2', 'o3']},
    ...labelOptions(),
  ]),
};
