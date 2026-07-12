import {avatarStackSurface} from './avatarstack-helpers';
import type {Fixture} from './types';

const SIZES = [20, 32, 48] as const;

/** Visual config — `size` (scalar arm). One surface per value, three Avatars each. */
export const avatarstackSizeFixture: Fixture = {
  name: 'avatarstack-size',
  messages: SIZES.flatMap(size => avatarStackSurface(`avatarstack-size-${size}`, {size}, 3)),
};
