import {buttonEventFixture} from './button-event';
import {buttonFnFixture} from './button-fn';
import {buttonVariantsFixture} from './button-variants';
import {buttonSizesFixture} from './button-sizes';
import {buttonAligncontentFixture} from './button-aligncontent';
import {buttonDisabledFixture} from './button-disabled';
import {buttonInactiveFixture} from './button-inactive';
import {buttonLoadingFixture} from './button-loading';
import {buttonBlockFixture} from './button-block';
import {buttonLabelwrapFixture} from './button-labelwrap';
import {buttonCountFixture} from './button-count';
import {buttonIconFixture} from './button-icon';
import {buttonLeadingVisualFixture} from './button-leading-visual';
import {buttonTrailingVisualFixture} from './button-trailing-visual';
import {buttonTrailingActionFixture} from './button-trailing-action';
import {iconNamesFixture} from './icon-names';
import {iconSizesFixture} from './icon-sizes';
import {iconFillsFixture} from './icon-fills';
import {linkFixture} from './link';
import {linkBoundFixture} from './link-bound';
import {linkMutedFixture} from './link-muted';
import {linkInlineFixture} from './link-inline';
import {headingFixture} from './heading';
import {headingBoundFixture} from './heading-bound';
import {headingVariantsFixture} from './heading-variants';
import {branchnameFixture} from './branchname';
import {branchnameBoundFixture} from './branchname-bound';
import {branchnameAsFixture} from './branchname-as';
import {textAsFixture} from './text-as';
import {textBoundFixture} from './text-bound';
import {textSizesFixture} from './text-sizes';
import {textWeightsFixture} from './text-weights';
import {textWhitespaceFixture} from './text-whitespace';
import {textFixture} from './text';
import type {Fixture} from './types';

export type {Fixture} from './types';

export {textFixture} from './text';
export {textBoundFixture} from './text-bound';
export {textSizesFixture} from './text-sizes';
export {textWeightsFixture} from './text-weights';
export {textAsFixture} from './text-as';
export {textWhitespaceFixture} from './text-whitespace';
export {buttonFnFixture} from './button-fn';
export {buttonEventFixture} from './button-event';
export {buttonVariantsFixture} from './button-variants';
export {buttonSizesFixture} from './button-sizes';
export {buttonAligncontentFixture} from './button-aligncontent';
export {buttonDisabledFixture} from './button-disabled';
export {buttonInactiveFixture} from './button-inactive';
export {buttonLoadingFixture} from './button-loading';
export {buttonBlockFixture} from './button-block';
export {buttonLabelwrapFixture} from './button-labelwrap';
export {buttonCountFixture} from './button-count';
export {buttonIconFixture} from './button-icon';
export {buttonLeadingVisualFixture} from './button-leading-visual';
export {buttonTrailingVisualFixture} from './button-trailing-visual';
export {buttonTrailingActionFixture} from './button-trailing-action';
export {iconNamesFixture} from './icon-names';
export {iconSizesFixture} from './icon-sizes';
export {iconFillsFixture} from './icon-fills';
export {linkFixture} from './link';
export {linkBoundFixture} from './link-bound';
export {linkMutedFixture} from './link-muted';
export {linkInlineFixture} from './link-inline';
export {headingFixture} from './heading';
export {headingBoundFixture} from './heading-bound';
export {headingVariantsFixture} from './heading-variants';
export {branchnameFixture} from './branchname';
export {branchnameBoundFixture} from './branchname-bound';
export {branchnameAsFixture} from './branchname-as';

export const FIXTURES: Fixture[] = [
  textFixture,
  textBoundFixture,
  textSizesFixture,
  textWeightsFixture,
  textAsFixture,
  textWhitespaceFixture,
  buttonFnFixture,
  buttonEventFixture,
  buttonVariantsFixture,
  buttonSizesFixture,
  buttonAligncontentFixture,
  buttonDisabledFixture,
  buttonInactiveFixture,
  buttonLoadingFixture,
  buttonBlockFixture,
  buttonLabelwrapFixture,
  buttonCountFixture,
  buttonIconFixture,
  buttonLeadingVisualFixture,
  buttonTrailingVisualFixture,
  buttonTrailingActionFixture,
  iconNamesFixture,
  iconSizesFixture,
  iconFillsFixture,
  linkFixture,
  linkBoundFixture,
  linkMutedFixture,
  linkInlineFixture,
  headingFixture,
  headingBoundFixture,
  headingVariantsFixture,
  branchnameFixture,
  branchnameBoundFixture,
  branchnameAsFixture,
];

export function getFixture(name: string | null): Fixture {
  return FIXTURES.find(f => f.name === name) ?? FIXTURES[0];
}
