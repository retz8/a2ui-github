import {surface} from './select-helpers';
import type {Fixture} from './types';

/** A Select with two SelectOptGroups where the second group is disabled (its options dimmed). */
export const selectoptgroupDisabledFixture: Fixture = {
  name: 'selectoptgroup-disabled',
  messages: surface('selectoptgroup-disabled', [
    {id: 'root', component: 'Select', value: 'triage', children: ['g1', 'g2']},
    {id: 'g1', component: 'SelectOptGroup', label: 'Open', children: ['o1', 'o2']},
    {
      id: 'g2',
      component: 'SelectOptGroup',
      label: 'Closed',
      disabled: true,
      children: ['o3', 'o4'],
    },
    {id: 'o1', component: 'SelectOption', text: 'Triage', value: 'triage'},
    {id: 'o2', component: 'SelectOption', text: 'In progress', value: 'in-progress'},
    {id: 'o3', component: 'SelectOption', text: 'Done', value: 'done'},
    {id: 'o4', component: 'SelectOption', text: 'Cancelled', value: 'cancelled'},
  ]),
};
