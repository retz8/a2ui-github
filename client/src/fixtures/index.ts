import {buttonEventFixture} from './button-event';
import {buttonFnFixture} from './button-fn';
import {buttonVariantsFixture} from './button-variants';
import {textBoundFixture} from './text-bound';
import {textFixture} from './text';
import type {Fixture} from './types';

export type {Fixture} from './types';

export const FIXTURES: Fixture[] = [
  textFixture,
  textBoundFixture,
  buttonFnFixture,
  buttonEventFixture,
  buttonVariantsFixture,
];

export function getFixture(name: string | null): Fixture {
  return FIXTURES.find(f => f.name === name) ?? FIXTURES[0];
}
