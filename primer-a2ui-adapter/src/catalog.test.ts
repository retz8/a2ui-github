import {describe, expect, it} from 'vitest';
import {PRIMER_CATALOG, PRIMER_CATALOG_ID} from './index';

describe('primer-a2ui-adapter skeleton', () => {
  it('exports a catalog carrying the catalog id', () => {
    expect(PRIMER_CATALOG.id).toBe(PRIMER_CATALOG_ID);
  });

  it('has no components wired yet (placeholder)', () => {
    expect(PRIMER_CATALOG.components).toEqual({});
  });
});
