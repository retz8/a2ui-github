import {
  root,
  headerRegion,
  contentRegion,
  paneRegion,
  footerRegion,
  surface,
} from './pagelayout-helpers';
import type {Fixture} from './types';

/**
 * Base composition: the root `PageLayout` wiring four region slots — `header` + `content` + `pane` +
 * `footer` — each built from a shipped region leaf with filler content. Proves the named-`ComponentId`
 * slot bridge (`asSlot` for header/footer; content/pane fall through to `rest`).
 */
export const pagelayoutFixture: Fixture = {
  name: 'pagelayout',
  messages: surface('pagelayout', [
    root({header: 'h', content: 'c', pane: 'p', footer: 'f'}),
    ...headerRegion(),
    ...contentRegion(),
    ...paneRegion(),
    ...footerRegion(),
  ]),
};
