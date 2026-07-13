import {labelOptions, surface} from './select-helpers';
import type {Fixture} from './types';

/** Base fixture: a Select whose selected value ('feature') matches one of three SelectOptions. */
export const selectoptionFixture: Fixture = {
  name: 'selectoption',
  messages: surface('selectoption', [
    {id: 'root', component: 'Select', value: 'feature', children: ['o1', 'o2', 'o3']},
    ...labelOptions(),
  ]),
};
