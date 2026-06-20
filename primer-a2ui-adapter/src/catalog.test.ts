import {describe, it, expect} from 'vitest';
import {PRIMER_CATALOG, PRIMER_CATALOG_ID} from './index';

describe('PRIMER_CATALOG', () => {
  it('carries the catalog id', () => {
    expect(PRIMER_CATALOG.id).toBe(PRIMER_CATALOG_ID);
  });

  it('registers the Text component', () => {
    expect(PRIMER_CATALOG.components.has('Text')).toBe(true);
  });

  it('registers the consoleLog function', () => {
    expect(PRIMER_CATALOG.functions.has('consoleLog')).toBe(true);
  });

  it('exposes a function invoker', () => {
    expect(typeof PRIMER_CATALOG.invoker).toBe('function');
  });
});
