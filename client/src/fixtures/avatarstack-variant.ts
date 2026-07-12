import {avatarStackSurface} from './avatarstack-helpers';
import type {Fixture} from './types';

const VARIANTS = ['cascade', 'stack'] as const;

/**
 * Visual enum — `variant`. One surface per value, each five Avatars so the third-and-later
 * overlap difference between `cascade` and `stack` is legible.
 */
export const avatarstackVariantFixture: Fixture = {
  name: 'avatarstack-variant',
  messages: VARIANTS.flatMap(variant =>
    avatarStackSurface(`avatarstack-variant-${variant}`, {variant}, 5),
  ),
};
