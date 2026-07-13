import {labelOptions, surface} from './select-helpers';
import type {Fixture} from './types';

/** Disabled control: inactive and cannot be changed. */
export const selectDisabledFixture: Fixture = {
  name: 'select-disabled',
  messages: surface('select-disabled', [
    {
      id: 'root',
      component: 'Select',
      value: 'feature',
      disabled: true,
      children: ['o1', 'o2', 'o3'],
    },
    ...labelOptions(),
  ]),
};
