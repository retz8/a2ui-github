import {describe, it, expect, afterEach} from 'vitest';
import {screen, cleanup, waitFor} from '@testing-library/react';
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
import {branchnameFixture} from '../src/fixtures/branchname';
import {branchnameBoundFixture} from '../src/fixtures/branchname-bound';
import {branchnameAsFixture} from '../src/fixtures/branchname-as';
import {relativeTimeFixture} from '../src/fixtures/relative-time';
import {relativeTimeBoundFixture} from '../src/fixtures/relative-time-bound';
import {relativeTimeFormatsFixture} from '../src/fixtures/relative-time-formats';
import {relativeTimeFormatStylesFixture} from '../src/fixtures/relative-time-format-styles';
import {relativeTimeTensesFixture} from '../src/fixtures/relative-time-tenses';
import {relativeTimePrecisionFixture} from '../src/fixtures/relative-time-precision';
import {relativeTimeThresholdFixture} from '../src/fixtures/relative-time-threshold';
import {relativeTimePrefixFixture} from '../src/fixtures/relative-time-prefix';
import {relativeTimeDatetimePartsFixture} from '../src/fixtures/relative-time-datetime-parts';

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

  it('renders a literal BranchName as an anchor carrying its href', () => {
    renderFixture(branchnameFixture);
    const el = screen.getByText('main');
    expect(el).toBeInTheDocument();
    // href presence is non-visual; assert the rendered anchor carries it.
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', 'https://github.com/a2ui-project/a2ui/tree/main');
  });

  it('renders a path-bound BranchName from the data model', () => {
    renderFixture(branchnameBoundFixture);
    expect(screen.getByText('feature/login')).toBeInTheDocument();
  });

  it('honors the BranchName as enum through the renderer', () => {
    renderFixture(branchnameAsFixture);
    // one surface per ['a','span']; each surface's text is its tag name.
    expect(screen.getByText('a').tagName).toBe('A');
    expect(screen.getByText('span').tagName).toBe('SPAN');
  });

  it('renders a literal RelativeTime through the renderer', () => {
    const {container} = renderFixture(relativeTimeFixture);
    const el = container.querySelector('relative-time');
    expect(el).not.toBeNull();
    // The custom element formats the datetime into non-empty display text.
    expect(el?.textContent?.trim().length ?? 0).toBeGreaterThan(0);
  });

  it('resolves a path-bound RelativeTime datetime from the data model', () => {
    // The value the fixture wrote into the data model at /timestamp.
    const dataMsg = relativeTimeBoundFixture.messages.find(m => 'updateDataModel' in m) as
      | {updateDataModel: {value: {timestamp: string}}}
      | undefined;
    const expected = dataMsg?.updateDataModel.value.timestamp;
    const {container} = renderFixture(relativeTimeBoundFixture);
    // The binding resolved to the plain ISO string (an unresolved binding would leave no datetime).
    expect(container.querySelector('relative-time')?.getAttribute('datetime')).toBe(expected);
  });

  // Gallery/config fixtures: assert each surface's prop is forwarded onto the element
  // (attribute assertions — exact display text would be clock/locale-sensitive).
  it('honors the RelativeTime format enum through the renderer', () => {
    const {container} = renderFixture(relativeTimeFormatsFixture);
    const formats = [...container.querySelectorAll('relative-time')].map(el =>
      el.getAttribute('format'),
    );
    expect(formats).toEqual(['auto', 'relative', 'duration', 'datetime']);
  });

  it('honors the RelativeTime formatStyle enum through the renderer', () => {
    const {container} = renderFixture(relativeTimeFormatStylesFixture);
    const styles = [...container.querySelectorAll('relative-time')].map(el =>
      el.getAttribute('format-style'),
    );
    expect(styles).toEqual(['long', 'short', 'narrow']);
  });

  it('honors the RelativeTime tense enum through the renderer', () => {
    const {container} = renderFixture(relativeTimeTensesFixture);
    const tenses = [...container.querySelectorAll('relative-time')].map(el =>
      el.getAttribute('tense'),
    );
    expect(tenses).toEqual(['auto', 'past', 'future']);
  });

  it('forwards the coupled RelativeTime precision × duration config through the renderer', () => {
    const {container} = renderFixture(relativeTimePrecisionFixture);
    const el = container.querySelector('relative-time');
    expect(el?.getAttribute('format')).toBe('duration');
    expect(el?.getAttribute('precision')).toBe('month');
  });

  it('forwards the RelativeTime threshold config through the renderer', () => {
    const {container} = renderFixture(relativeTimeThresholdFixture);
    expect(container.querySelector('relative-time')?.getAttribute('threshold')).toBe('P1Y');
  });

  it('forwards the RelativeTime prefix config through the renderer', async () => {
    const {container} = renderFixture(relativeTimePrefixFixture);
    const el = container.querySelector('relative-time');
    expect(el?.getAttribute('prefix')).toBe('updated');
    // Absolute rendering of a fixed ISO: the prefix leads the display text. The element
    // renders into its shadow root via a microtask-batched update, hence shadowRoot + waitFor.
    await waitFor(() =>
      expect(el?.shadowRoot?.textContent?.trim().startsWith('updated ')).toBe(true),
    );
  });

  it('forwards the eight RelativeTime datetime part props through the renderer', () => {
    const {container} = renderFixture(relativeTimeDatetimePartsFixture);
    const el = container.querySelector('relative-time');
    expect(el?.getAttribute('weekday')).toBe('long');
    expect(el?.getAttribute('month')).toBe('long');
    expect(el?.getAttribute('day')).toBe('2-digit');
    expect(el?.getAttribute('year')).toBe('numeric');
    expect(el?.getAttribute('hour')).toBe('2-digit');
    expect(el?.getAttribute('minute')).toBe('2-digit');
    expect(el?.getAttribute('second')).toBe('2-digit');
    expect(el?.getAttribute('time-zone-name')).toBe('short');
  });
});
