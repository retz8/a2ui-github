import {describe, it, expect} from 'vitest';
import {CATALOG_ID} from 'primer-a2ui-adapter';
import {FIXTURES, getFixture} from '../src/fixtures';

describe('fixtures', () => {
  it('exposes at least one uniquely-named fixture', () => {
    expect(FIXTURES.length).toBeGreaterThan(0);
    const names = FIXTURES.map(f => f.name);
    expect(new Set(names).size).toBe(FIXTURES.length);
  });

  it('every createSurface uses the Primer catalog id and v0.9', () => {
    for (const fixture of FIXTURES) {
      const creates = fixture.messages.filter(m => 'createSurface' in m);
      expect(creates.length).toBeGreaterThan(0);
      for (const m of fixture.messages) {
        expect(m.version).toBe('v0.9');
      }
      for (const m of creates as Array<{createSurface: {catalogId: string}}>) {
        expect(m.createSurface.catalogId).toBe(CATALOG_ID);
      }
    }
  });

  it('every surface defines a root component', () => {
    for (const fixture of FIXTURES) {
      const updates = fixture.messages.filter(m => 'updateComponents' in m) as Array<{
        updateComponents: {components: Array<{id: string}>};
      }>;
      for (const m of updates) {
        const ids = m.updateComponents.components.map(c => c.id);
        expect(ids).toContain('root');
      }
    }
  });

  it('getFixture falls back to the first fixture for unknown names', () => {
    expect(getFixture('nope').name).toBe('text');
    expect(getFixture(null).name).toBe('text');
    expect(getFixture('button-event').name).toBe('button-event');
  });
});
