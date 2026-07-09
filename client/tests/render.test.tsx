import {describe, it, expect, afterEach} from 'vitest';
import {screen, cleanup} from '@testing-library/react';
import {renderFixture} from './helpers';
import {textFixture} from '../src/fixtures/text';
import {textBoundFixture} from '../src/fixtures/text-bound';
import {buttonFnFixture} from '../src/fixtures/button-fn';
import {iconNamesFixture} from '../src/fixtures/icon-names';
import {iconSizesFixture} from '../src/fixtures/icon-sizes';
import {iconFillsFixture} from '../src/fixtures/icon-fills';
import {linkFixture} from '../src/fixtures/link';
import {linkBoundFixture} from '../src/fixtures/link-bound';
import {linkMutedFixture} from '../src/fixtures/link-muted';
import {linkInlineFixture} from '../src/fixtures/link-inline';
import {headingFixture} from '../src/fixtures/heading';
import {headingBoundFixture} from '../src/fixtures/heading-bound';
import {headingVariantsFixture} from '../src/fixtures/heading-variants';

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

  it('renders a literal Link carrying its href through the renderer', () => {
    renderFixture(linkFixture);
    const el = screen.getByRole('link', {name: 'View on GitHub'});
    expect(el).toHaveAttribute('href', 'https://github.com');
  });

  it('renders a path-bound Link (text + href) from the data model', () => {
    renderFixture(linkBoundFixture);
    const el = screen.getByRole('link', {name: 'Bound link'});
    expect(el).toHaveAttribute('href', 'https://github.com');
  });

  it('honors the muted state through the renderer', () => {
    renderFixture(linkMutedFixture);
    expect(screen.getByRole('link', {name: 'Muted link'})).toHaveAttribute('data-muted', 'true');
  });

  it('honors the inline state through the renderer', () => {
    renderFixture(linkInlineFixture);
    expect(screen.getByRole('link', {name: 'Inline link'})).toHaveAttribute('data-inline', 'true');
  });

  it('renders a literal Heading', () => {
    renderFixture(headingFixture);
    expect(screen.getByRole('heading', {name: 'Heading from Primer'})).toBeInTheDocument();
  });

  it('renders a path-bound Heading from the data model', () => {
    renderFixture(headingBoundFixture);
    expect(screen.getByRole('heading', {name: 'Bound heading'})).toBeInTheDocument();
  });

  it('renders one Heading per visual variant', () => {
    renderFixture(headingVariantsFixture);
    for (const variant of ['large', 'medium', 'small']) {
      expect(screen.getByRole('heading', {name: variant})).toHaveAttribute('data-variant', variant);
    }
  });
});
