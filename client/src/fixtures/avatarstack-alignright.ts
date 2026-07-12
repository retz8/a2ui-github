import {avatarStackSurface} from './avatarstack-helpers';
import type {Fixture} from './types';

/**
 * Visually-distinct state — `alignRight`. Five Avatars so the overlap is anchored to the right
 * edge (and the `data-avatar-count` "3+" overflow shows).
 */
export const avatarstackAlignrightFixture: Fixture = {
  name: 'avatarstack-alignright',
  messages: avatarStackSurface('avatarstack-alignright', {alignRight: true}, 5),
};
