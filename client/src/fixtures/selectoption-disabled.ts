import {surface} from './select-helpers';
import type {Fixture} from './types';

/** A Select of three options with the middle one disabled (cannot be selected). */
export const selectoptionDisabledFixture: Fixture = {
  name: 'selectoption-disabled',
  messages: surface('selectoption-disabled', [
    {id: 'root', component: 'Select', value: 'bug', children: ['o1', 'o2', 'o3']},
    {id: 'o1', component: 'SelectOption', text: 'Bug', value: 'bug'},
    {id: 'o2', component: 'SelectOption', text: 'Feature', value: 'feature', disabled: true},
    {id: 'o3', component: 'SelectOption', text: 'Docs', value: 'docs'},
  ]),
};
