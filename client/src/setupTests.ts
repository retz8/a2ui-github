import '@testing-library/jest-dom/vitest';
import {vi} from 'vitest';

// jsdom does not implement window.matchMedia. Primer's Spinner (and any other
// component using the useMedia hook, e.g. prefers-reduced-motion) reads it, so
// provide a minimal no-op shim for the test environment.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

// Primer's IconButton wraps its trigger in TooltipV2, which loads the `@oddbird/popover-polyfill`
// under jsdom (no native Popover API). The polyfill spreads `root.adoptedStyleSheets`, which jsdom
// does not implement, so it throws `adoptedStyleSheets is not iterable`. Provide a writable array
// stub on Document/ShadowRoot so the polyfill's style injection is a harmless no-op.
for (const proto of [
  typeof Document !== 'undefined' ? Document.prototype : undefined,
  typeof ShadowRoot !== 'undefined' ? ShadowRoot.prototype : undefined,
]) {
  if (proto && !('adoptedStyleSheets' in proto)) {
    Object.defineProperty(proto, 'adoptedStyleSheets', {
      configurable: true,
      writable: true,
      value: [],
    });
  }
}

// Primer announces screen-reader text (e.g. ToggleSwitch's loadingLabel, Button's
// loadingAnnouncement) through a `<live-region>` custom element. Its node build fails to
// upgrade under jsdom, so `announceFromElement` throws in a MutationObserver microtask.
// Pre-register a no-op element: Primer sees one already defined and skips its own, and the
// announcement becomes a harmless no-op (the AT text itself is asserted structurally).
if (typeof customElements !== 'undefined' && !customElements.get('live-region')) {
  class LiveRegionStub extends HTMLElement {
    announce() {
      return {cancel() {}};
    }
    announceFromElement() {
      return {cancel() {}};
    }
    getMessage() {
      return '';
    }
    clear() {}
  }
  customElements.define('live-region', LiveRegionStub);
}
