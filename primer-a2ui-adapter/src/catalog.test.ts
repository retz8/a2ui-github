import {describe, it, expect} from 'vitest';
import {CATALOG, CATALOG_ID} from './index';

describe('CATALOG', () => {
  it('carries the catalog id', () => {
    expect(CATALOG.id).toBe(CATALOG_ID);
  });

  it('registers the Text component', () => {
    expect(CATALOG.components.has('Text')).toBe(true);
  });

  it('registers the Button component', () => {
    expect(CATALOG.components.has('Button')).toBe(true);
  });

  it('registers the consoleLog function', () => {
    expect(CATALOG.functions.has('consoleLog')).toBe(true);
  });

  it('exposes a function invoker', () => {
    expect(typeof CATALOG.invoker).toBe('function');
  });
});
