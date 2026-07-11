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
