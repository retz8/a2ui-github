import {avatarStackSurface} from './avatarstack-helpers';
import type {Fixture} from './types';

/**
 * Responsive-arm demo — `size` as a `{narrow, regular, wide}` map. The single-viewport baseline
 * captures the regular width (32px); the cross-viewport effect is verified manually by resizing.
 * Proves the responsive object is accepted and forwarded (the render test asserts `data-responsive`).
 */
export const avatarstackSizeResponsiveFixture: Fixture = {
  name: 'avatarstack-size-responsive',
  messages: avatarStackSurface(
    'avatarstack-size-responsive',
    {size: {narrow: 16, regular: 32, wide: 48}},
    3,
  ),
};
