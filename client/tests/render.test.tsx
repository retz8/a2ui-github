import {describe, it, expect, afterEach} from 'vitest';
import {screen, cleanup, waitFor, fireEvent} from '@testing-library/react';
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
import {labelFixture} from '../src/fixtures/label';
import {labelBoundFixture} from '../src/fixtures/label-bound';
import {labelVariantsFixture} from '../src/fixtures/label-variants';
import {statelabelFixture} from '../src/fixtures/statelabel';
import {statelabelBoundFixture} from '../src/fixtures/statelabel-bound';
import {statelabelStatusFixture} from '../src/fixtures/statelabel-status';
import {statelabelSizeFixture} from '../src/fixtures/statelabel-size';
import {counterlabelFixture} from '../src/fixtures/counterlabel';
import {counterlabelBoundFixture} from '../src/fixtures/counterlabel-bound';
import {counterlabelVariantsFixture} from '../src/fixtures/counterlabel-variants';
import {avatarFixture} from '../src/fixtures/avatar';
import {avatarBoundFixture} from '../src/fixtures/avatar-bound';
import {avatarSizesFixture} from '../src/fixtures/avatar-sizes';
import {avatarSquareFixture} from '../src/fixtures/avatar-square';
import {AVATAR_PLACEHOLDER_SRC} from '../src/fixtures/avatar-placeholder';
import {spinnerFixture} from '../src/fixtures/spinner';
import {spinnerSizesFixture} from '../src/fixtures/spinner-sizes';
import {spinnerBoundFixture} from '../src/fixtures/spinner-bound';
import {tokenFixture} from '../src/fixtures/token';
import {tokenBoundFixture} from '../src/fixtures/token-bound';
import {tokenLeadingvisualFixture} from '../src/fixtures/token-leadingvisual';
import {tokenSizesFixture} from '../src/fixtures/token-sizes';
import {tokenSelectedFixture} from '../src/fixtures/token-selected';
import {tokenHideremovebuttonFixture} from '../src/fixtures/token-hideremovebutton';
import {issuelabeltokenFixture} from '../src/fixtures/issuelabeltoken';
import {issuelabeltokenBoundFixture} from '../src/fixtures/issuelabeltoken-bound';
import {issuelabeltokenFillcolorFixture} from '../src/fixtures/issuelabeltoken-fillcolor';
import {issuelabeltokenSizesFixture} from '../src/fixtures/issuelabeltoken-sizes';
import {issuelabeltokenSelectedFixture} from '../src/fixtures/issuelabeltoken-selected';
import {issuelabeltokenHideremovebuttonFixture} from '../src/fixtures/issuelabeltoken-hideremovebutton';
import {checkboxFixture} from '../src/fixtures/checkbox';
import {checkboxCheckedFixture} from '../src/fixtures/checkbox-checked';
import {checkboxBoundFixture} from '../src/fixtures/checkbox-bound';
import {checkboxIndeterminateFixture} from '../src/fixtures/checkbox-indeterminate';
import {checkboxDisabledFixture} from '../src/fixtures/checkbox-disabled';
import {progressbarFixture} from '../src/fixtures/progressbar';
import {progressbarBoundFixture} from '../src/fixtures/progressbar-bound';
import {progressbarSegmentsFixture} from '../src/fixtures/progressbar-segments';
import {progressbarSegmentsBoundFixture} from '../src/fixtures/progressbar-segments-bound';
import {progressbarBgFixture} from '../src/fixtures/progressbar-bg';
import {progressbarSizesFixture} from '../src/fixtures/progressbar-sizes';
import {radioFixture} from '../src/fixtures/radio';
import {radioCheckedFixture} from '../src/fixtures/radio-checked';
import {radioDisabledFixture} from '../src/fixtures/radio-disabled';
import {radioEventFixture} from '../src/fixtures/radio-event';
import {toggleswitchFixture} from '../src/fixtures/toggleswitch';
import {toggleswitchCheckedFixture} from '../src/fixtures/toggleswitch-checked';
import {toggleswitchBoundFixture} from '../src/fixtures/toggleswitch-bound';
import {toggleswitchDisabledFixture} from '../src/fixtures/toggleswitch-disabled';
import {toggleswitchLoadingFixture} from '../src/fixtures/toggleswitch-loading';
import {toggleswitchSizesFixture} from '../src/fixtures/toggleswitch-sizes';
import {toggleswitchLabelPositionFixture} from '../src/fixtures/toggleswitch-label-position';
import {toggleswitchCustomLabelsFixture} from '../src/fixtures/toggleswitch-custom-labels';
import {textareaFixture} from '../src/fixtures/textarea';
import {textareaBoundFixture} from '../src/fixtures/textarea-bound';
import {textareaPlaceholderFixture} from '../src/fixtures/textarea-placeholder';
import {textareaDisabledFixture} from '../src/fixtures/textarea-disabled';
import {textareaValidationFixture} from '../src/fixtures/textarea-validation';
import {textareaBlockFixture} from '../src/fixtures/textarea-block';
import {textareaContrastFixture} from '../src/fixtures/textarea-contrast';
import {textareaRowsFixture} from '../src/fixtures/textarea-rows';
import {textareaColsFixture} from '../src/fixtures/textarea-cols';
import {textareaCharacterLimitFixture} from '../src/fixtures/textarea-character-limit';
import {textareaMinHeightFixture} from '../src/fixtures/textarea-min-height';
import {skeletonboxFixture} from '../src/fixtures/skeletonbox';
import {skeletonboxSizedFixture} from '../src/fixtures/skeletonbox-sized';

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

  it('renders a literal Label', () => {
    renderFixture(labelFixture);
    expect(screen.getByText('Label from Primer')).toBeInTheDocument();
  });

  it('renders a path-bound Label from the data model', () => {
    renderFixture(labelBoundFixture);
    expect(screen.getByText('Bound label')).toBeInTheDocument();
  });

  it('honors the color-variant enum through the renderer', () => {
    renderFixture(labelVariantsFixture);
    // each surface labels its Label with the variant name; Primer stamps data-variant.
    expect(screen.getByText('success')).toHaveAttribute('data-variant', 'success');
    expect(screen.getByText('danger')).toHaveAttribute('data-variant', 'danger');
  });

  it('renders a literal StateLabel text', () => {
    renderFixture(statelabelFixture);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders a path-bound StateLabel text from the data model', () => {
    renderFixture(statelabelBoundFixture);
    expect(screen.getByText('Merged')).toBeInTheDocument();
  });

  it('honors the StateLabel status enum through the renderer', () => {
    renderFixture(statelabelStatusFixture);
    // one surface per status; Primer stamps the resolved status onto the visible span.
    const statuses = ['issueOpened', 'pullMerged', 'alertFixed', 'open', 'archived'];
    for (const status of statuses) {
      expect(screen.getByText(status)).toHaveAttribute('data-status', status);
    }
  });

  it('honors the StateLabel size enum through the renderer', () => {
    renderFixture(statelabelSizeFixture);
    // one surface per size; Primer stamps the resolved size onto the visible span.
    expect(screen.getByText('small')).toHaveAttribute('data-size', 'small');
    expect(screen.getByText('medium')).toHaveAttribute('data-size', 'medium');
  });

  it('renders a literal CounterLabel count', () => {
    renderFixture(counterlabelFixture);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders a path-bound CounterLabel count from the data model', () => {
    renderFixture(counterlabelBoundFixture);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('honors the CounterLabel variant enum through the renderer', () => {
    renderFixture(counterlabelVariantsFixture);
    // one surface per variant; Primer stamps the resolved emphasis onto the visible span.
    const counters = screen.getAllByText('12');
    const variants = counters.map(el => el.getAttribute('data-variant')).sort();
    expect(variants).toEqual(['primary', 'secondary']);
  });

  it('renders a literal Avatar carrying its src and alt', () => {
    renderFixture(avatarFixture);
    expect(screen.getByRole('img', {name: 'Octocat'})).toHaveAttribute(
      'src',
      AVATAR_PLACEHOLDER_SRC,
    );
  });

  it('renders a path-bound Avatar src from the data model', () => {
    renderFixture(avatarBoundFixture);
    expect(screen.getByRole('img', {name: 'Bound avatar'})).toHaveAttribute(
      'src',
      AVATAR_PLACEHOLDER_SRC,
    );
  });

  it('honors the avatar size scale through the renderer', () => {
    renderFixture(avatarSizesFixture);
    // one surface per documented size; Primer stamps it as width/height on the img.
    expect(screen.getByRole('img', {name: '16px avatar'})).toHaveAttribute('width', '16');
    expect(screen.getByRole('img', {name: '64px avatar'})).toHaveAttribute('width', '64');
  });

  it('renders a square Avatar through the renderer', () => {
    renderFixture(avatarSquareFixture);
    expect(screen.getByRole('img', {name: 'Square avatar'})).toHaveAttribute('data-square', '');
  });

  it('renders a Spinner with its built-in "Loading" hidden label', () => {
    renderFixture(spinnerFixture);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('honors the Spinner size enum through the renderer', () => {
    const {container} = renderFixture(spinnerSizesFixture);
    // one surface per size; Primer sizes the svg accordingly (16/32/64px).
    const widths = Array.from(container.querySelectorAll('svg'))
      .map(svg => svg.getAttribute('width'))
      .sort();
    expect(widths).toEqual(['16px', '32px', '64px']);
  });

  it('resolves a path-bound Spinner srText from the data model', () => {
    renderFixture(spinnerBoundFixture);
    expect(screen.getByText('Loading pull requests')).toBeInTheDocument();
  });

  it('renders a literal Token', () => {
    renderFixture(tokenFixture);
    expect(screen.getByText('Token from Primer')).toBeInTheDocument();
  });

  it('renders a path-bound Token text from the data model', () => {
    renderFixture(tokenBoundFixture);
    expect(screen.getByText('Bound token')).toBeInTheDocument();
  });

  it('renders a Token leadingVisual child through the renderer', () => {
    const {container} = renderFixture(tokenLeadingvisualFixture);
    expect(screen.getByText('With icon')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('honors the Token size enum through the renderer', () => {
    renderFixture(tokenSizesFixture);
    for (const size of ['small', 'medium', 'large', 'xlarge']) {
      expect(screen.getByText(size)).toBeInTheDocument();
    }
  });

  it('honors the Token selected state through the renderer', () => {
    renderFixture(tokenSelectedFixture);
    expect(screen.getByText('Selected').closest('[data-is-selected="true"]')).not.toBeNull();
  });

  it('hides the Token remove button when hideRemoveButton is set', () => {
    renderFixture(tokenHideremovebuttonFixture);
    expect(screen.getByText('No button')).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Remove token'})).not.toBeInTheDocument();
  });

  it('renders a literal IssueLabelToken', () => {
    renderFixture(issuelabeltokenFixture);
    expect(screen.getByText('Issue label from Primer')).toBeInTheDocument();
  });

  it('renders a path-bound IssueLabelToken text from the data model', () => {
    renderFixture(issuelabeltokenBoundFixture);
    expect(screen.getByText('Bound label')).toBeInTheDocument();
  });

  it('derives the IssueLabelToken fill from fillColor through the renderer', () => {
    const {container} = renderFixture(issuelabeltokenFillcolorFixture);
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(container.querySelector('[style*="--label-r"]')).not.toBeNull();
  });

  it('honors the IssueLabelToken size enum through the renderer', () => {
    renderFixture(issuelabeltokenSizesFixture);
    for (const size of ['small', 'medium', 'large', 'xlarge']) {
      expect(screen.getByText(size)).toBeInTheDocument();
    }
  });

  it('honors the IssueLabelToken selected state through the renderer', () => {
    renderFixture(issuelabeltokenSelectedFixture);
    expect(screen.getByText('Selected').closest('[data-selected="true"]')).not.toBeNull();
  });

  it('hides the IssueLabelToken remove button when hideRemoveButton is set', () => {
    renderFixture(issuelabeltokenHideremovebuttonFixture);
    expect(screen.getByText('No button')).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Remove token'})).not.toBeInTheDocument();
  });

  it('renders a literal unchecked Checkbox', () => {
    renderFixture(checkboxFixture);
    expect(screen.getByRole('checkbox', {name: 'Notify me about updates'})).not.toBeChecked();
  });

  it('renders a literal checked Checkbox', () => {
    renderFixture(checkboxCheckedFixture);
    expect(screen.getByRole('checkbox', {name: 'Notify me about updates'})).toBeChecked();
  });

  it('resolves a path-bound Checkbox from the data model (initially false -> unchecked)', () => {
    renderFixture(checkboxBoundFixture);
    expect(screen.getByRole('checkbox', {name: 'Notify me about updates'})).not.toBeChecked();
  });

  it('honors the indeterminate Checkbox state through the renderer', () => {
    renderFixture(checkboxIndeterminateFixture);
    expect(screen.getByRole('checkbox', {name: 'Select all items'})).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  it('honors disabled per check-state (mini-gallery)', () => {
    renderFixture(checkboxDisabledFixture);
    const unchecked = screen.getByRole('checkbox', {name: 'Disabled, unchecked'});
    const checked = screen.getByRole('checkbox', {name: 'Disabled, checked'});
    expect(unchecked).toBeDisabled();
    expect(unchecked).not.toBeChecked();
    expect(checked).toBeDisabled();
    expect(checked).toBeChecked();
  });
  it('renders a literal ProgressBar whose aria-valuenow reflects progress', () => {
    renderFixture(progressbarFixture);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '65');
  });

  it('renders a path-bound ProgressBar from the data model', () => {
    renderFixture(progressbarBoundFixture);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
  });

  it('renders one labeled segment per authored segment through the renderer', () => {
    renderFixture(progressbarSegmentsFixture);
    expect(screen.getAllByRole('progressbar')).toHaveLength(3);
    expect(screen.getByRole('progressbar', {name: 'TypeScript'})).toHaveAttribute(
      'aria-valuenow',
      '55',
    );
    expect(screen.getByRole('progressbar', {name: 'CSS'})).toBeInTheDocument();
    expect(screen.getByRole('progressbar', {name: 'Other'})).toBeInTheDocument();
  });

  it('resolves a data-binding inside a segment array element', () => {
    renderFixture(progressbarSegmentsBoundFixture);
    // The first segment's width is bound to /tsShare = 55.
    expect(screen.getByRole('progressbar', {name: 'TypeScript'})).toHaveAttribute(
      'aria-valuenow',
      '55',
    );
  });

  it('honors the ProgressBar bg color-role enum through the renderer', () => {
    renderFixture(progressbarBgFixture);
    // one surface per role; the resolved role maps to Primer's --bgColor-<role>-emphasis token.
    expect(screen.getAllByRole('progressbar')).toHaveLength(12);
    expect(screen.getByRole('progressbar', {name: 'accent'}).getAttribute('style')).toContain(
      'bgColor-accent-emphasis',
    );
    expect(screen.getByRole('progressbar', {name: 'danger'}).getAttribute('style')).toContain(
      'bgColor-danger-emphasis',
    );
  });

  it('honors the ProgressBar barSize enum through the renderer', () => {
    renderFixture(progressbarSizesFixture);
    // one surface per size; Primer stamps the resolved size onto the track container.
    for (const size of ['small', 'default', 'large']) {
      const track = screen
        .getByRole('progressbar', {name: size})
        .closest('[data-component="ProgressBar"]');
      expect(track).toHaveAttribute('data-progress-bar-size', size);
    }
  });

  it('renders a native Radio carrying its value and name through the renderer', () => {
    renderFixture(radioFixture);
    const el = screen.getByRole('radio');
    expect(el).toHaveAttribute('value', 'option-1');
    expect(el).toHaveAttribute('name', 'radio-demo');
    expect(el).not.toBeChecked();
  });

  it('honors a literal checked Radio through the renderer', () => {
    renderFixture(radioCheckedFixture);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('honors the disabled Radio on both selection states through the renderer', () => {
    renderFixture(radioDisabledFixture);
    // one surface per selection state; both radios are disabled, one is checked.
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    for (const el of radios) expect(el).toBeDisabled();
    expect(radios.filter(el => (el as HTMLInputElement).checked)).toHaveLength(1);
  });

  it('resolves the path-bound Radio checked from the data model (initial false)', () => {
    renderFixture(radioEventFixture);
    // checked <- /selected, initial /selected = false -> the radio renders unchecked.
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('renders an unchecked ToggleSwitch showing the Off status', () => {
    const {container} = renderFixture(toggleswitchFixture);
    expect(screen.getByText('Off')).toBeInTheDocument();
    expect(container.querySelector('button[aria-pressed]')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('renders a checked ToggleSwitch showing the On status', () => {
    const {container} = renderFixture(toggleswitchCheckedFixture);
    expect(screen.getByText('On')).toBeInTheDocument();
    expect(container.querySelector('button[aria-pressed]')).toHaveAttribute('aria-pressed', 'true');
  });

  it('writes back through the two-way binding when toggled (bound checked)', async () => {
    // /setting starts false; flipping writes it true via the binder's setter, and the bound
    // `checked` re-resolves — the switch snaps on with no round trip.
    const {container} = renderFixture(toggleswitchBoundFixture);
    const btn = container.querySelector('button[aria-pressed]') as HTMLButtonElement;
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    await waitFor(() =>
      expect(container.querySelector('button[aria-pressed]')).toHaveAttribute(
        'aria-pressed',
        'true',
      ),
    );
  });

  it('honors the ToggleSwitch disabled × check-state mini-gallery through the renderer', () => {
    const {container} = renderFixture(toggleswitchDisabledFixture);
    const buttons = [...container.querySelectorAll('button[aria-pressed]')];
    expect(buttons).toHaveLength(2);
    for (const btn of buttons) {
      expect(btn).toHaveAttribute('aria-disabled', 'true');
    }
    expect(buttons.map(b => b.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
  });

  it('honors the ToggleSwitch loading × check-state mini-gallery through the renderer', () => {
    const {container} = renderFixture(toggleswitchLoadingFixture);
    const buttons = [...container.querySelectorAll('button[aria-pressed]')];
    expect(buttons).toHaveLength(2);
    // loading blocks interaction just like disabled.
    for (const btn of buttons) {
      expect(btn).toHaveAttribute('aria-disabled', 'true');
    }
  });

  it('honors the ToggleSwitch size enum through the renderer', () => {
    const {container} = renderFixture(toggleswitchSizesFixture);
    const sizes = [...container.querySelectorAll('button[aria-pressed]')].map(el =>
      el.getAttribute('data-size'),
    );
    expect(sizes).toEqual(['small', 'medium']);
  });

  it('honors the ToggleSwitch statusLabelPosition enum through the renderer', () => {
    const {container} = renderFixture(toggleswitchLabelPositionFixture);
    const positions = [...container.querySelectorAll('[data-status-label-position]')].map(el =>
      el.getAttribute('data-status-label-position'),
    );
    expect(positions).toEqual(['start', 'end']);
  });

  it('renders the ToggleSwitch custom on/off status labels through the renderer', () => {
    renderFixture(toggleswitchCustomLabelsFixture);
    expect(screen.getByText('Hide')).toBeInTheDocument();
    expect(screen.getByText('Show')).toBeInTheDocument();
  });

  it('renders a literal Textarea value', () => {
    renderFixture(textareaFixture);
    expect(screen.getByRole('textbox')).toHaveValue('A multiline\ncomment draft.');
  });

  it('renders a path-bound Textarea value from the data model', () => {
    renderFixture(textareaBoundFixture);
    expect(screen.getByRole('textbox')).toHaveValue('A multiline\ncomment draft.');
  });

  it('writes user edits back to the bound path (two-way binding) and re-renders', async () => {
    renderFixture(textareaBoundFixture);
    const el = screen.getByRole('textbox');
    fireEvent.change(el, {target: {value: 'Edited draft'}});
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('Edited draft'));
  });

  it('shows the Textarea placeholder while empty', () => {
    renderFixture(textareaPlaceholderFixture);
    expect(screen.getByPlaceholderText('Leave a comment')).toBeInTheDocument();
  });

  it('honors the disabled Textarea through the renderer', () => {
    renderFixture(textareaDisabledFixture);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('drives aria-invalid from the error validationStatus through the renderer', () => {
    renderFixture(textareaValidationFixture);
    // one surface per status; only the error surface reports aria-invalid="true".
    const boxes = screen.getAllByRole('textbox');
    const invalid = boxes.map(el => el.getAttribute('aria-invalid')).sort();
    expect(invalid).toEqual(['false', 'true']);
  });

  it('renders a block Textarea through the renderer', () => {
    renderFixture(textareaBlockFixture);
    expect(screen.getByRole('textbox')).toHaveValue('Full width');
  });

  it('renders a contrast Textarea through the renderer', () => {
    renderFixture(textareaContrastFixture);
    expect(screen.getByRole('textbox')).toHaveValue('High contrast');
  });

  it('honors the Textarea rows through the renderer', () => {
    renderFixture(textareaRowsFixture);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
  });

  it('honors the Textarea cols through the renderer', () => {
    renderFixture(textareaColsFixture);
    expect(screen.getByRole('textbox')).toHaveAttribute('cols', '60');
  });

  it('applies the Textarea minHeight as an inline style through the renderer', () => {
    renderFixture(textareaMinHeightFixture);
    expect(screen.getByRole('textbox')).toHaveStyle({minHeight: '200px'});
  });

  it('forces error styling when the character limit is exceeded', () => {
    renderFixture(textareaCharacterLimitFixture);
    // two coupled surfaces; only the over-limit one flips aria-invalid to "true".
    const boxes = screen.getAllByRole('textbox');
    const invalid = boxes.map(el => el.getAttribute('aria-invalid')).sort();
    expect(invalid).toEqual(['false', 'true']);
  });

  it('renders a default SkeletonBox placeholder through the renderer', () => {
    const {container} = renderFixture(skeletonboxFixture);
    expect(container.querySelector('[class*="SkeletonBox"]')).toBeInTheDocument();
  });

  it('honors the SkeletonBox height and width through the renderer', () => {
    const {container} = renderFixture(skeletonboxSizedFixture);
    const box = container.querySelector<HTMLElement>('[class*="SkeletonBox"]')!;
    expect(box).toBeInTheDocument();
    expect(box.style.height).toBe('80px');
    expect(box.style.width).toBe('200px');
  });
});
