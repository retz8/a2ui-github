/**
 * Regression: streaming exposed a transient red "Unknown component: <type>" flash —
 * the healing parser emits partial `type` strings mid-stream, the catalog lookup
 * misses, and @a2ui/react's DeferredChild rendered developer-oriented error text.
 * The package is patched (.yarn/patches/@a2ui-react) so an unresolved component
 * renders null instead. This asserts a surface whose root references a component
 * type absent from the real adapter CATALOG renders no error text.
 */
import {describe, it, expect, afterEach} from 'vitest';
import {render, cleanup} from '@testing-library/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import {Providers} from '../providers';

const MESSAGES = [
  {
    version: 'v0.9',
    createSurface: {
      surfaceId: 'unknown-root',
      catalogId:
        'https://github.com/retz8/a2ui-github/blob/main/primer-a2ui-adapter/catalogs/v0.9.1/catalog.json',
    },
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'unknown-root',
      // `PageLayo` is a partial mid-stream `type` — not a real catalog component.
      components: [{id: 'root', component: 'PageLayo', text: 'x'}],
    },
  },
] as unknown as A2uiMessage[];

afterEach(cleanup);

describe('unresolved component fallback', () => {
  it('renders null (no "Unknown component" error text) for an unknown root type', () => {
    const processor = new MessageProcessor([CATALOG], () => {});
    processor.processMessages(MESSAGES);
    const surface = processor.model.surfacesMap.get('unknown-root');
    expect(surface).toBeDefined();
    const {container} = render(
      <Providers>
        <A2uiSurface surface={surface!} />
      </Providers>,
    );
    expect(container.textContent).not.toContain('Unknown component');
    expect(container.textContent).not.toContain('PageLayo');
  });
});
