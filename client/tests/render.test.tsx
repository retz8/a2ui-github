import {describe, it, expect, afterEach} from 'vitest';
import {screen, cleanup} from '@testing-library/react';
import {renderFixture} from './helpers';
import {textFixture} from '../src/fixtures/text';
import {textBoundFixture} from '../src/fixtures/text-bound';
import {buttonFnFixture} from '../src/fixtures/button-fn';
import {iconNamesFixture} from '../src/fixtures/icon-names';
import {iconSizesFixture} from '../src/fixtures/icon-sizes';
import {iconFillsFixture} from '../src/fixtures/icon-fills';

afterEach(cleanup);

describe('fixture rendering', () => {
  it('renders a literal Text', () => {
    renderFixture(textFixture);
    expect(screen.getByText('Hello from Primer')).toBeInTheDocument();
  });

  it('renders a path-bound Text from the data model', () => {
    renderFixture(textBoundFixture);
    expect(screen.getByText('Bound hello')).toBeInTheDocument();
  });

  it('renders a Button whose child Text is the label', () => {
    renderFixture(buttonFnFixture);
    expect(screen.getByRole('button', {name: 'Run local function'})).toBeInTheDocument();
  });

  it('renders the sampled named icons through the renderer', () => {
    const {container} = renderFixture(iconNamesFixture);
    // one surface per sampled name (each labeled, so exposed as role="img").
    expect(container.querySelectorAll('svg')).toHaveLength(5);
    expect(screen.getByRole('img', {name: 'git-pull-request'})).toBeInTheDocument();
  });

  it('honors the icon size enum through the renderer', () => {
    renderFixture(iconSizesFixture);
    // small/medium/large map to 16/32/64 px on the wrapped octicon.
    expect(screen.getByRole('img', {name: 'small'})).toHaveAttribute('width', '16');
    expect(screen.getByRole('img', {name: 'large'})).toHaveAttribute('width', '64');
  });

  it('honors the semantic fill enum through the renderer', () => {
    renderFixture(iconFillsFixture);
    // the default role inherits currentColor; a semantic role maps to its fgColor token.
    expect(screen.getByRole('img', {name: 'default'})).toHaveAttribute('fill', 'currentColor');
    expect(screen.getByRole('img', {name: 'danger'})).toHaveAttribute(
      'fill',
      'var(--fgColor-danger)',
    );
  });
});
