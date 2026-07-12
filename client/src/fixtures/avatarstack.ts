import {avatarStackSurface} from './avatarstack-helpers';
import type {Fixture} from './types';

/** Base fixture: a static ChildList of three Avatars in a default (cascade, circle) AvatarStack. */
export const avatarstackFixture: Fixture = {
  name: 'avatarstack',
  messages: avatarStackSurface('avatarstack', {}, 3),
};
