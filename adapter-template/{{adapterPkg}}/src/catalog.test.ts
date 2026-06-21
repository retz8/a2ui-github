import {describe, it, expect} from 'vitest';
import {CATALOG, CATALOG_ID} from './index';

describe('CATALOG', () => {
  it('carries the catalog id', () => {
    expect(CATALOG.id).toBe(CATALOG_ID);
  });

  it('starts with no components', () => {
    expect(CATALOG.components.size).toBe(0);
  });

  it('exposes a function invoker', () => {
    expect(typeof CATALOG.invoker).toBe('function');
  });
});
