import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The Badge `variant` gallery: one timeline item per color variant, each a git-commit badge in that
// variant plus a `Text` body naming the variant. One surface, one PNG.
const VARIANTS = [
  'accent',
  'success',
  'attention',
  'severe',
  'danger',
  'done',
  'open',
  'closed',
  'sponsors',
] as const;

const items = VARIANTS.map(v => ({
  id: `item-${v}`,
  component: 'TimelineItem' as const,
  children: [`badge-${v}`, `body-${v}`],
}));

const leaves = VARIANTS.flatMap(v => [
  {id: `badge-${v}`, component: 'TimelineBadge' as const, variant: v, child: `icon-${v}`},
  {id: `icon-${v}`, component: 'Icon' as const, name: 'git-commit' as const},
  {id: `body-${v}`, component: 'TimelineBody' as const, children: [`text-${v}`]},
  {id: `text-${v}`, component: 'Text' as const, text: v},
]);

export const timelineBadgeVariantsFixture: Fixture = {
  name: 'timeline-badge-variants',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'timeline-badge-variants', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'timeline-badge-variants',
        components: [
          {id: 'root', component: 'Timeline', children: items.map(i => i.id)},
          ...items,
          ...leaves,
        ],
      },
    },
  ],
};
