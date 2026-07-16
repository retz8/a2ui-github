import {root, contentRegion, paneRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/** Pane `width` custom object: a `{min, default, max}` triple of CSS lengths instead of a named size. */
export const pagelayoutPaneWidthCustomFixture: Fixture = {
  name: 'pagelayout-pane-width-custom',
  messages: surface('pagelayout-pane-width-custom', [
    root({content: 'c', pane: 'p'}),
    ...contentRegion(),
    ...paneRegion({width: {min: '200px', default: '300px', max: '400px'}}),
  ]),
};
