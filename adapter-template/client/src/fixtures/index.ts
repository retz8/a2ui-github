import type {Fixture} from './types';

export type {Fixture} from './types';

// Add your canned A2UI fixtures here as you author components, e.g.:
//   import {myFixture} from './my-fixture';
//   export const FIXTURES: Fixture[] = [myFixture];
export const FIXTURES: Fixture[] = [];

export function getFixture(name: string | null): Fixture | undefined {
  return FIXTURES.find(f => f.name === name) ?? FIXTURES[0];
}
