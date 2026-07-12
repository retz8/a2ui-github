import {avatarStackSurface} from './avatarstack-helpers';
import type {Fixture} from './types';

/**
 * Behavioral state — `disableExpand`. Five overlapping Avatars whose stack does NOT spread apart on
 * hover/focus (the default expand affordance is suppressed). Interaction-only: verified visually,
 * not by a static baseline.
 */
export const avatarstackDisableexpandFixture: Fixture = {
  name: 'avatarstack-disableexpand',
  messages: avatarStackSurface('avatarstack-disableexpand', {disableExpand: true}, 5),
};
