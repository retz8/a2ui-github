import {labelOptions, surface} from './select-helpers';
import type {Fixture} from './types';

/** Block control: expands to fill the container's full width. */
export const selectBlockFixture: Fixture = {
  name: 'select-block',
  messages: surface('select-block', [
    {id: 'root', component: 'Select', value: 'feature', block: true, children: ['o1', 'o2', 'o3']},
    ...labelOptions(),
  ]),
};
