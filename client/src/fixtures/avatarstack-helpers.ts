import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {surface, type Comp} from './stack-helpers';

/**
 * A deterministic, network-free colored "face" placeholder as an inline `data:` URI SVG — the
 * same geometry as the single-avatar `avatar-placeholder`, parameterized by fill color so the
 * individual avatars in a stack are visually distinguishable and the overlap is legible in a
 * static PNG. Color is the only differing axis between children.
 */
export function avatarPlaceholder(fill: string): string {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">',
    '<rect width="64" height="64" fill="#ffffff"/>',
    `<circle cx="32" cy="26" r="12" fill="${fill}"/>`,
    `<circle cx="32" cy="66" r="20" fill="${fill}"/>`,
    '</svg>',
  ].join('');
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** A small palette of distinguishable avatar colors, cycled across a stack's children. */
export const AVATAR_COLORS = ['#54aeff', '#4ac26b', '#c297ff', '#ff966c', '#ff818a'] as const;

/** Canned display names for the filler avatars, cycled alongside the colors. */
export const AVATAR_NAMES = ['Mona', 'Hubot', 'Octo', 'Bender', 'Ada'] as const;

/** Builds `count` distinguishable Avatar children with ids `a1..aN`. */
export function avatarChildren(count: number): {ids: string[]; comps: Comp[]} {
  const ids = Array.from({length: count}, (_, i) => `a${i + 1}`);
  const comps: Comp[] = ids.map((id, i) => ({
    id,
    component: 'Avatar',
    src: avatarPlaceholder(AVATAR_COLORS[i % AVATAR_COLORS.length]),
    alt: AVATAR_NAMES[i % AVATAR_NAMES.length],
  }));
  return {ids, comps};
}

/** One AvatarStack surface: a `root` AvatarStack (carrying `rootProps`) over `count` avatars. */
export function avatarStackSurface(
  surfaceId: string,
  rootProps: Record<string, unknown>,
  count: number,
): A2uiMessage[] {
  const {ids, comps} = avatarChildren(count);
  return surface(surfaceId, [
    {id: 'root', component: 'AvatarStack', children: ids, ...rootProps},
    ...comps,
  ]);
}
