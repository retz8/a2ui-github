import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Responsive-arm demo: `variant` is a `{narrow, regular, wide}` map — `hideLabels` on narrow
 * viewports, `default` otherwise. Segments carry `leadingVisual` icons so the labels-hidden mode
 * stays legible. The single-viewport baseline captures the regular width (`default`); the
 * cross-viewport effect and the `dropdown` mode are verified manually. The render test asserts the
 * responsive data attributes are forwarded.
 */
export const segmentedcontrolVariantFixture: Fixture = {
  name: 'segmentedcontrol-variant',
  messages: surface('segmentedcontrol-variant', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 0,
      variant: {narrow: 'hideLabels', regular: 'default'},
      accessibility: {label: 'File view'},
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlButton', label: 'Preview', leadingVisual: 'i0'},
    {id: 'i0', component: 'Icon', name: 'eye'},
    {id: 's1', component: 'SegmentedControlButton', label: 'Raw', leadingVisual: 'i1'},
    {id: 'i1', component: 'Icon', name: 'code'},
    {id: 's2', component: 'SegmentedControlButton', label: 'Blame', leadingVisual: 'i2'},
    {id: 'i2', component: 'Icon', name: 'git-commit'},
  ]),
};
