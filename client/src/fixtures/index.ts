import {buttonEventFixture} from './button-event';
import {buttonFnFixture} from './button-fn';
import {buttonVariantsFixture} from './button-variants';
import {iconNamesFixture} from './icon-names';
import {iconSizesFixture} from './icon-sizes';
import {iconFillsFixture} from './icon-fills';
import {textBoundFixture} from './text-bound';
import {textFixture} from './text';
import type {Fixture} from './types';

export type {Fixture} from './types';

export {textFixture} from './text';
export {textBoundFixture} from './text-bound';
export {buttonFnFixture} from './button-fn';
export {buttonEventFixture} from './button-event';
export {buttonVariantsFixture} from './button-variants';
export {iconNamesFixture} from './icon-names';
export {iconSizesFixture} from './icon-sizes';
export {iconFillsFixture} from './icon-fills';

export const FIXTURES: Fixture[] = [
  textFixture,
  textBoundFixture,
  buttonFnFixture,
  buttonEventFixture,
  buttonVariantsFixture,
  iconNamesFixture,
  iconSizesFixture,
  iconFillsFixture,
];

export function getFixture(name: string | null): Fixture {
  return FIXTURES.find(f => f.name === name) ?? FIXTURES[0];
}
