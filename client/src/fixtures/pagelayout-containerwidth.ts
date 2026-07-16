import {root, headerRegion, contentRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Visual enum — `containerWidth`: one surface per value, each a `header` + `content` composition. */
const WIDTHS = ['full', 'medium', 'large', 'xlarge'] as const;

export const pagelayoutContainerwidthFixture: Fixture = {
  name: 'pagelayout-containerwidth',
  messages: WIDTHS.flatMap(containerWidth =>
    surface(`pagelayout-containerwidth-${containerWidth}`, [
      root({header: 'h', content: 'c'}, {containerWidth}),
      ...headerRegion(),
      ...contentRegion(),
    ]),
  ),
};
