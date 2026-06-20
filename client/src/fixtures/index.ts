import {buttonEventFixture} from './button-event';
import {buttonFnFixture} from './button-fn';
import {buttonVariantsFixture} from './button-variants';
import {textBoundFixture} from './text-bound';
import {textFixture} from './text';
import type {Fixture} from './types';

export type {Fixture} from './types';

export {textFixture} from './text';
export {textBoundFixture} from './text-bound';
export {buttonFnFixture} from './button-fn';
export {buttonEventFixture} from './button-event';
export {buttonVariantsFixture} from './button-variants';

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
