import {labelOptions, surface} from './select-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// One surface per size enum value, each with the standard three options.
const SIZES = ['small', 'medium', 'large'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  return surface(`select-size-${size}`, [
    {id: 'root', component: 'Select', value: 'feature', size, children: ['o1', 'o2', 'o3']},
    ...labelOptions(),
  ]);
}

export const selectSizeFixture: Fixture = {
  name: 'select-size',
  messages: SIZES.flatMap(sizeSurface),
};
