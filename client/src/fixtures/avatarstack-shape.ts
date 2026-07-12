import {avatarStackSurface} from './avatarstack-helpers';
import type {Fixture} from './types';

const SHAPES = ['circle', 'square'] as const;

/** Visual enum — `shape`. One surface per value, three Avatars each. */
export const avatarstackShapeFixture: Fixture = {
  name: 'avatarstack-shape',
  messages: SHAPES.flatMap(shape => avatarStackSurface(`avatarstack-shape-${shape}`, {shape}, 3)),
};
