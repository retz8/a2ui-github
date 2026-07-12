import {labelOptions, surface} from './select-helpers';
import type {Fixture} from './types';

/** Placeholder leading option shown while no choice is made (`value` empty). */
export const selectPlaceholderFixture: Fixture = {
  name: 'select-placeholder',
  messages: surface('select-placeholder', [
    {
      id: 'root',
      component: 'Select',
      value: '',
      placeholder: 'Choose a label',
      children: ['o1', 'o2', 'o3'],
    },
    ...labelOptions(),
  ]),
};
