import {describe, it, expect, afterEach} from 'vitest';
import {screen, cleanup, waitFor, fireEvent} from '@testing-library/react';
import {CATALOG_ID} from 'primer-a2ui-adapter';
import {renderFixture} from './helpers';
import type {Fixture} from '../src/fixtures';
import {textFixture} from '../src/fixtures/text';
import {textBoundFixture} from '../src/fixtures/text-bound';
import {buttonFnFixture} from '../src/fixtures/button-fn';
import {iconbuttonVariantsFixture} from '../src/fixtures/iconbutton-variants';
import {iconbuttonSizesFixture} from '../src/fixtures/iconbutton-sizes';
import {iconbuttonDisabledFixture} from '../src/fixtures/iconbutton-disabled';
import {iconbuttonLoadingFixture} from '../src/fixtures/iconbutton-loading';
import {iconbuttonInactiveFixture} from '../src/fixtures/iconbutton-inactive';
import {iconbuttonBlockFixture} from '../src/fixtures/iconbutton-block';
import {iconbuttonTooltipFixture} from '../src/fixtures/iconbutton-tooltip';
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
import {textinputFixture} from '../src/fixtures/textinput';
import {textinputBoundFixture} from '../src/fixtures/textinput-bound';
import {textinputPlaceholderFixture} from '../src/fixtures/textinput-placeholder';
import {textinputDisabledFixture} from '../src/fixtures/textinput-disabled';
import {textinputValidationFixture} from '../src/fixtures/textinput-validation';
import {textinputTypeFixture} from '../src/fixtures/textinput-type';
import {textinputLoadingFixture} from '../src/fixtures/textinput-loading';
import {textinputLeadingVisualFixture} from '../src/fixtures/textinput-leading-visual';
import {textinputTrailingVisualFixture} from '../src/fixtures/textinput-trailing-visual';
import {textinputTrailingActionFixture} from '../src/fixtures/textinput-trailing-action';
import {textinputSizeFixture} from '../src/fixtures/textinput-size';
import {textinputBlockFixture} from '../src/fixtures/textinput-block';
import {textinputContrastFixture} from '../src/fixtures/textinput-contrast';
import {textinputMonospaceFixture} from '../src/fixtures/textinput-monospace';
import {textinputCharacterLimitFixture} from '../src/fixtures/textinput-character-limit';
import {textinputActionDisabledFixture} from '../src/fixtures/textinput-action-disabled';
import {actionlistFixture} from '../src/fixtures/actionlist';
import {actionlistChildrenTemplateFixture} from '../src/fixtures/actionlist-children-template';
import {actionlistSelectionFixture} from '../src/fixtures/actionlist-selection';
import {actionlistItemActiveFixture} from '../src/fixtures/actionlist-item-active';
import {actionlistItemDisabledFixture} from '../src/fixtures/actionlist-item-disabled';
import {actionlistItemInactiveFixture} from '../src/fixtures/actionlist-item-inactive';
import {actionlistItemVariantFixture} from '../src/fixtures/actionlist-item-variant';
import {actionlistItemSizeFixture} from '../src/fixtures/actionlist-item-size';
import {actionlistVariantFixture} from '../src/fixtures/actionlist-variant';
import {actionlistDividersFixture} from '../src/fixtures/actionlist-dividers';
import {actionlistGroupVariantFixture} from '../src/fixtures/actionlist-group-variant';
import {actionlistDescriptionFixture} from '../src/fixtures/actionlist-description';
import {actionlistTrailingactionLoadingFixture} from '../src/fixtures/actionlist-trailingaction-loading';
import {skeletonboxFixture} from '../src/fixtures/skeletonbox';
import {skeletonboxSizedFixture} from '../src/fixtures/skeletonbox-sized';
import {truncateFixture} from '../src/fixtures/truncate';
import {truncateBoundFixture} from '../src/fixtures/truncate-bound';
import {truncateMaxwidthFixture} from '../src/fixtures/truncate-maxwidth';
import {truncateAsFixture} from '../src/fixtures/truncate-as';
import {keybindinghintFixture} from '../src/fixtures/keybindinghint';
import {keybindinghintBoundFixture} from '../src/fixtures/keybindinghint-bound';
import {keybindinghintFormatsFixture} from '../src/fixtures/keybindinghint-formats';
import {keybindinghintVariantsFixture} from '../src/fixtures/keybindinghint-variants';
import {keybindinghintSizesFixture} from '../src/fixtures/keybindinghint-sizes';
import {stackFixture} from '../src/fixtures/stack';
import {stackChildrenTemplateFixture} from '../src/fixtures/stack-children-template';
import {buttonGroupFixture} from '../src/fixtures/button-group';
import {buttonGroupChildrenTemplateFixture} from '../src/fixtures/button-group-children-template';
import {stackResponsiveFixture} from '../src/fixtures/stack-responsive';
import {stackitemFixture} from '../src/fixtures/stackitem';
import {stackitemGrowFixture} from '../src/fixtures/stackitem-grow';
import {stackitemShrinkFixture} from '../src/fixtures/stackitem-shrink';
import {labelGroupFixture} from '../src/fixtures/label-group';
import {labelGroupChildrenTemplateFixture} from '../src/fixtures/label-group-children-template';
import {labelGroupTruncatedFixture} from '../src/fixtures/label-group-truncated';
import {avatarstackFixture} from '../src/fixtures/avatarstack';
import {avatarstackChildrenTemplateFixture} from '../src/fixtures/avatarstack-children-template';
import {avatarstackAlignrightFixture} from '../src/fixtures/avatarstack-alignright';
import {avatarstackVariantFixture} from '../src/fixtures/avatarstack-variant';
import {avatarstackShapeFixture} from '../src/fixtures/avatarstack-shape';
import {avatarstackSizeFixture} from '../src/fixtures/avatarstack-size';
import {avatarstackSizeResponsiveFixture} from '../src/fixtures/avatarstack-size-responsive';
import {avatarstackDisableexpandFixture} from '../src/fixtures/avatarstack-disableexpand';
import {paginationFixture} from '../src/fixtures/pagination';
import {paginationLargeFixture} from '../src/fixtures/pagination-large';
import {paginationFirstFixture} from '../src/fixtures/pagination-first';
import {paginationLastFixture} from '../src/fixtures/pagination-last';
import {paginationNoPagesFixture} from '../src/fixtures/pagination-no-pages';
import {paginationMarginFixture} from '../src/fixtures/pagination-margin';
import {paginationSurroundingFixture} from '../src/fixtures/pagination-surrounding';
import {paginationControlledFixture} from '../src/fixtures/pagination-controlled';
import {paginationHrefFixture} from '../src/fixtures/pagination-href';
import {paginationAccessibilityFixture} from '../src/fixtures/pagination-accessibility';
import {segmentedcontrolFixture} from '../src/fixtures/segmentedcontrol';
import {segmentedcontrolChildrenTemplateFixture} from '../src/fixtures/segmentedcontrol-children-template';
import {segmentedcontrolSelectedFixture} from '../src/fixtures/segmentedcontrol-selected';
import {segmentedcontrolFullwidthFixture} from '../src/fixtures/segmentedcontrol-fullwidth';
import {segmentedcontrolSizeFixture} from '../src/fixtures/segmentedcontrol-size';
import {segmentedcontrolVariantFixture} from '../src/fixtures/segmentedcontrol-variant';
import {segmentedcontrolbuttonFixture} from '../src/fixtures/segmentedcontrolbutton';
import {segmentedcontrolbuttonLeadingvisualFixture} from '../src/fixtures/segmentedcontrolbutton-leadingvisual';
import {segmentedcontrolbuttonCountFixture} from '../src/fixtures/segmentedcontrolbutton-count';
import {segmentedcontrolbuttonDisabledFixture} from '../src/fixtures/segmentedcontrolbutton-disabled';
import {segmentedcontroliconbuttonFixture} from '../src/fixtures/segmentedcontroliconbutton';
import {segmentedcontroliconbuttonDisabledFixture} from '../src/fixtures/segmentedcontroliconbutton-disabled';
import {detailsOpenFixture} from '../src/fixtures/details-open';
import {detailsChildrenTemplateFixture} from '../src/fixtures/details-children-template';
import {detailsBoundFixture} from '../src/fixtures/details-bound';
import {selectFixture} from '../src/fixtures/select';
import {selectChildrenTemplateFixture} from '../src/fixtures/select-children-template';
import {selectPlaceholderFixture} from '../src/fixtures/select-placeholder';
import {selectDisabledFixture} from '../src/fixtures/select-disabled';
import {selectValidationFixture} from '../src/fixtures/select-validation';
import {selectBlockFixture} from '../src/fixtures/select-block';
import {selectSizeFixture} from '../src/fixtures/select-size';
import {selectoptionFixture} from '../src/fixtures/selectoption';
import {selectoptionDisabledFixture} from '../src/fixtures/selectoption-disabled';
import {selectoptgroupFixture} from '../src/fixtures/selectoptgroup';
import {selectoptgroupDisabledFixture} from '../src/fixtures/selectoptgroup-disabled';
import {breadcrumbsFixture} from '../src/fixtures/breadcrumbs';
import {breadcrumbsChildrenTemplateFixture} from '../src/fixtures/breadcrumbs-children-template';
import {breadcrumbsVariantFixture} from '../src/fixtures/breadcrumbs-variant';
import {breadcrumbsitemFixture} from '../src/fixtures/breadcrumbsitem';
import {breadcrumbsitemSelectedFixture} from '../src/fixtures/breadcrumbsitem-selected';
import {navlistFixture} from '../src/fixtures/navlist';
import {navlistItemInactiveFixture} from '../src/fixtures/navlist-item-inactive';
import {navlistTrailingactionLoadingFixture} from '../src/fixtures/navlist-trailingaction-loading';
import {navlistGroupBoundFixture} from '../src/fixtures/navlist-group-bound';
import {navlistGroupheadingVariantsFixture} from '../src/fixtures/navlist-groupheading-variants';
import {navlistGroupheadingBoundFixture} from '../src/fixtures/navlist-groupheading-bound';
import {navlistDescriptionVariantsFixture} from '../src/fixtures/navlist-description-variants';
import {navlistDescriptionTruncateFixture} from '../src/fixtures/navlist-description-truncate';
import {navlistGroupexpandFixture} from '../src/fixtures/navlist-groupexpand';
import {pagelayoutFixture} from '../src/fixtures/pagelayout';
import {pagelayoutSidebarFixture} from '../src/fixtures/pagelayout-sidebar';
import {pagelayoutContainerwidthFixture} from '../src/fixtures/pagelayout-containerwidth';
import {pagelayoutContentTemplateFixture} from '../src/fixtures/pagelayout-content-template';
import {pagelayoutHeaderDividerFixture} from '../src/fixtures/pagelayout-header-divider';
import {pagelayoutPaneResizableFixture} from '../src/fixtures/pagelayout-pane-resizable';
import {pagelayoutPaneCurrentwidthFixture} from '../src/fixtures/pagelayout-pane-currentwidth';
import {pagelayoutSidebarResizableFixture} from '../src/fixtures/pagelayout-sidebar-resizable';
import {splitPageLayoutFixture} from '../src/fixtures/split-page-layout';
import {splitPageLayoutSidebarFixture} from '../src/fixtures/split-page-layout-sidebar';
import {splHeaderDividerFixture} from '../src/fixtures/spl-header-divider';
import {splContentWidthFixture} from '../src/fixtures/spl-content-width';
import {splContentPaddingFixture} from '../src/fixtures/spl-content-padding';
import {splContentChildrenTemplateFixture} from '../src/fixtures/spl-content-children-template';
import {splPanePositionFixture} from '../src/fixtures/spl-pane-position';
import {splPaneWidthFixture} from '../src/fixtures/spl-pane-width';
import {splPaneDividerFixture} from '../src/fixtures/spl-pane-divider';
import {splPaneResizableFixture} from '../src/fixtures/spl-pane-resizable';
import {pageheaderFixture} from '../src/fixtures/pageheader';
import {pageheaderHasborderFixture} from '../src/fixtures/pageheader-hasborder';
import {parentlinkFixture} from '../src/fixtures/parentlink';
import {parentlinkBoundFixture} from '../src/fixtures/parentlink-bound';
import {titleFixture} from '../src/fixtures/title';
import {titleBoundFixture} from '../src/fixtures/title-bound';
import {titleareaVariantFixture} from '../src/fixtures/titlearea-variant';
import {breadcrumbsTemplateFixture} from '../src/fixtures/breadcrumbs-template';
import {actionBarFixture} from '../src/fixtures/action-bar';
import {actionBarChildrenTemplateFixture} from '../src/fixtures/action-bar-children-template';
import {actionBarFlushFixture} from '../src/fixtures/action-bar-flush';
import {actionBarIconButtonDisabledFixture} from '../src/fixtures/action-bar-icon-button-disabled';
import {actionBarGroupFixture} from '../src/fixtures/action-bar-group';
import {actionBarMenuFixture} from '../src/fixtures/action-bar-menu';
import {treeViewNestedFixture} from '../src/fixtures/tree-view-nested';
import {treeViewFlatFixture} from '../src/fixtures/tree-view-flat';
import {treeViewTruncateFixture} from '../src/fixtures/tree-view-truncate';
import {treeViewItemCurrentFixture} from '../src/fixtures/tree-view-item-current';
import {treeViewItemExpandedBoundFixture} from '../src/fixtures/tree-view-item-expanded-bound';
import {treeViewSubtreeStatesFixture} from '../src/fixtures/tree-view-subtree-states';
import {treeViewVisualsFixture} from '../src/fixtures/tree-view-visuals';
import {treeViewDirectoryIconFixture} from '../src/fixtures/tree-view-directory-icon';
import {treeViewErrorDialogFixture} from '../src/fixtures/tree-view-error-dialog';

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

  it('renders a literal Truncate carrying its full text as the title attribute', () => {
    renderFixture(truncateFixture);
    const el = screen.getByText('src/components/navigation/PrimaryNavigationMenu.tsx');
    expect(el).toBeInTheDocument();
    // title is the accessibility channel (full untruncated text); assert it on the element.
    expect(el).toHaveAttribute('title', 'src/components/navigation/PrimaryNavigationMenu.tsx');
  });

  it('renders a path-bound Truncate from the data model, on both text and title', () => {
    renderFixture(truncateBoundFixture);
    const el = screen.getByText('feature/add-visual-regression-baselines-for-truncate');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('title', 'feature/add-visual-regression-baselines-for-truncate');
  });

  it('honors the Truncate maxWidth through the renderer', () => {
    const {container} = renderFixture(truncateMaxwidthFixture);
    const el = container.querySelector<HTMLElement>('[class*="Truncate"]')!;
    expect(el).toBeInTheDocument();
    expect(el.style.getPropertyValue('--truncate-max-width')).toBe('300px');
  });

  it('honors the Truncate as enum through the renderer', () => {
    const {container} = renderFixture(truncateAsFixture);
    // one surface per ['div','span','p']; assert the set of rendered host elements.
    const tags = [...container.querySelectorAll('[class*="Truncate"]')]
      .map(el => el.tagName)
      .sort();
    expect(tags).toEqual(['DIV', 'P', 'SPAN']);
  });

  it('renders a literal KeybindingHint through the renderer', () => {
    renderFixture(keybindinghintFixture);
    const hint = screen.getByTestId('keybinding-hint');
    expect(hint.tagName).toBe('KBD');
    // "Mod" resolves to the platform primary modifier (control on non-mac).
    expect(hint.textContent).toContain('control');
    expect(hint.textContent).toContain('k');
  });

  it('renders a path-bound KeybindingHint from the data model', () => {
    renderFixture(keybindinghintBoundFixture);
    const hint = screen.getByTestId('keybinding-hint');
    expect(hint.textContent).toContain('control');
    expect(hint.textContent).toContain('shift');
    expect(hint.textContent).toContain('p');
  });

  it('honors the KeybindingHint format enum through the renderer', () => {
    const {container} = renderFixture(keybindinghintFormatsFixture);
    // one surface per format value.
    expect(screen.getAllByTestId('keybinding-hint')).toHaveLength(2);
    // the full form spells modifiers out with a visible separator.
    expect(container.textContent).toContain('Control');
    expect(container.textContent).toContain('+');
  });

  it('honors the KeybindingHint variant enum through the renderer', () => {
    const {container} = renderFixture(keybindinghintVariantsFixture);
    expect(screen.getAllByTestId('keybinding-hint')).toHaveLength(3);
    // each value stamps its color-treatment class onto the chord.
    expect(container.querySelector('[class*="ChordNormal"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="ChordOnEmphasis"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="ChordOnPrimary"]')).toBeInTheDocument();
  });

  it('honors the KeybindingHint size enum through the renderer', () => {
    const {container} = renderFixture(keybindinghintSizesFixture);
    expect(screen.getAllByTestId('keybinding-hint')).toHaveLength(2);
    // the small value stamps a size class onto the chord.
    expect(container.querySelector('[class*="ChordSmall"]')).toBeInTheDocument();
  });
});

describe('Stack (container) — integration through the renderer', () => {
  it('renders a static ChildList of children', () => {
    renderFixture(stackFixture);
    expect(screen.getByRole('button', {name: 'One'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Two'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Three'})).toBeInTheDocument();
  });

  it('expands a dynamic-template ChildList over the bound array (one child per item, own scope)', () => {
    renderFixture(stackChildrenTemplateFixture);
    expect(screen.getByRole('button', {name: 'Alpha'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Beta'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Gamma'})).toBeInTheDocument();
  });

  it('forwards a responsive direction map as Primer responsive data attributes', () => {
    const {container} = renderFixture(stackResponsiveFixture);
    const stack = container.querySelector('[data-direction-narrow]');
    expect(stack).not.toBeNull();
    expect(stack).toHaveAttribute('data-direction-narrow', 'vertical');
    expect(stack).toHaveAttribute('data-direction-regular', 'horizontal');
  });
});

describe('ButtonGroup (container) — integration through the renderer', () => {
  it('renders a static ChildList of joined buttons', () => {
    renderFixture(buttonGroupFixture);
    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Delete'})).toBeInTheDocument();
  });

  it('expands a dynamic-template ChildList over the bound array (one child per item, own scope)', () => {
    renderFixture(buttonGroupChildrenTemplateFixture);
    expect(screen.getByRole('button', {name: 'Edit'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Copy'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Archive'})).toBeInTheDocument();
  });
});

describe('StackItem (sizing wrapper) — integration through the renderer', () => {
  it('renders items wrapping their children', () => {
    renderFixture(stackitemFixture);
    expect(screen.getByRole('button', {name: 'One'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Three'})).toBeInTheDocument();
  });

  it('honors grow on an item (data-grow)', () => {
    const {container} = renderFixture(stackitemGrowFixture);
    expect(container.querySelector('[data-grow="true"]')).not.toBeNull();
  });

  it('honors shrink on an item (data-shrink)', () => {
    const {container} = renderFixture(stackitemShrinkFixture);
    expect(container.querySelector('[data-shrink="false"]')).not.toBeNull();
  });
});

describe('LabelGroup (container) — integration through the renderer', () => {
  it('renders a static ChildList of Label children', () => {
    renderFixture(labelGroupFixture);
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('enhancement')).toBeInTheDocument();
    expect(screen.getByText('help wanted')).toBeInTheDocument();
    expect(screen.getByText('question')).toBeInTheDocument();
  });

  it('expands a dynamic-template ChildList over the bound array (one Label per item, own scope)', () => {
    renderFixture(labelGroupChildrenTemplateFixture);
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('wontfix')).toBeInTheDocument();
    expect(screen.getByText('duplicate')).toBeInTheDocument();
  });

  it('truncates to visibleChildCount and renders the +N overflow affordance', () => {
    const {container} = renderFixture(labelGroupTruncatedFixture);
    // All six Labels stay in the DOM; the three beyond the count are marked hidden.
    expect(screen.getByText('documentation')).toBeInTheDocument();
    expect(container.querySelector('[data-component="LabelGroup.Toggle"]')).toBeInTheDocument();
  });
});

describe('AvatarStack (container) — integration through the renderer', () => {
  it('renders a static ChildList of avatars', () => {
    renderFixture(avatarstackFixture);
    expect(screen.getByRole('img', {name: 'Mona'})).toBeInTheDocument();
    expect(screen.getByRole('img', {name: 'Hubot'})).toBeInTheDocument();
    expect(screen.getByRole('img', {name: 'Octo'})).toBeInTheDocument();
  });

  it("lands Primer's injected overlap class on each real avatar img (overlap + size)", () => {
    // Primer AvatarStack injects the AvatarItem class into each direct child via cloneElement; the
    // AvatarStackItem bridge re-broadcasts it through context so it reaches the real <img> behind
    // the binder's opaque child. That class carries both the :nth-child(n+2) overlap margin and the
    // `width/height: var(--avatar-stack-size)` sizing — so overlap and stack `size` both depend on
    // it being on the avatar itself, not a wrapper.
    const {container} = renderFixture(avatarstackFixture);
    const items = container.querySelectorAll('img[data-component="Avatar"][class*="AvatarItem"]');
    expect(items.length).toBe(3);
  });

  it('propagates stack shape="square" onto every avatar (data-square)', () => {
    const {container} = renderFixture(avatarstackShapeFixture);
    // The square surface marks each of its avatars square via the injected flag; the circle surface
    // leaves them round.
    const squareStack = container.querySelector(
      '[data-component="AvatarStack"][data-shape="square"]',
    );
    const squareAvatars = squareStack?.querySelectorAll(
      'img[data-component="Avatar"][data-square]',
    );
    expect(squareAvatars?.length).toBe(3);
  });

  it('suppresses the hover/focus spread when disableExpand is set (data-disable-expand)', () => {
    const {container} = renderFixture(avatarstackDisableexpandFixture);
    expect(container.querySelector('[data-disable-expand]')).not.toBeNull();
  });

  it('expands a dynamic-template ChildList over the bound array (one avatar per item)', () => {
    renderFixture(avatarstackChildrenTemplateFixture);
    expect(screen.getByRole('img', {name: 'Mona'})).toBeInTheDocument();
    expect(screen.getByRole('img', {name: 'Hubot'})).toBeInTheDocument();
    expect(screen.getByRole('img', {name: 'Bender'})).toBeInTheDocument();
  });

  it('anchors the stack to the right when alignRight is set (data-align-right, "3+" overflow)', () => {
    const {container} = renderFixture(avatarstackAlignrightFixture);
    const stack = container.querySelector('[data-component="AvatarStack"]');
    expect(stack).toHaveAttribute('data-align-right', '');
    expect(stack).toHaveAttribute('data-avatar-count', '3+');
  });

  it('renders both variant values through the renderer (data-variant)', () => {
    const {container} = renderFixture(avatarstackVariantFixture);
    const variants = Array.from(container.querySelectorAll('[data-component="AvatarStack"]'))
      .map(el => el.getAttribute('data-variant'))
      .sort();
    expect(variants).toEqual(['cascade', 'stack']);
  });

  it('propagates shape onto the stack for both values (data-shape)', () => {
    const {container} = renderFixture(avatarstackShapeFixture);
    const shapes = Array.from(container.querySelectorAll('[data-component="AvatarStack"]'))
      .map(el => el.getAttribute('data-shape'))
      .sort();
    expect(shapes).toEqual(['circle', 'square']);
  });

  it('treats a scalar size as non-responsive (no data-responsive)', () => {
    const {container} = renderFixture(avatarstackSizeFixture);
    const stacks = container.querySelectorAll('[data-component="AvatarStack"]');
    expect(stacks.length).toBe(3);
    stacks.forEach(stack => expect(stack).not.toHaveAttribute('data-responsive'));
  });

  it('forwards a responsive size map as a responsive stack (data-responsive)', () => {
    const {container} = renderFixture(avatarstackSizeResponsiveFixture);
    const stack = container.querySelector('[data-component="AvatarStack"]');
    expect(stack).toHaveAttribute('data-responsive', '');
  });
});

describe('Pagination — integration through the renderer', () => {
  it('renders numbered page links and marks the current page', () => {
    renderFixture(paginationFixture);
    expect(screen.getByRole('link', {name: 'Page 1'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Page 3'})).toHaveAttribute('aria-current', 'page');
  });

  it('shows ellipsis breaks at large page counts', () => {
    renderFixture(paginationLargeFixture);
    expect(screen.getByRole('link', {name: 'Page 8'})).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });

  it('disables the Previous control on the first page', () => {
    const {container} = renderFixture(paginationFirstFixture);
    expect(container.querySelector('[data-component="Pagination.PreviousPage"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('disables the Next control on the last page', () => {
    const {container} = renderFixture(paginationLastFixture);
    expect(container.querySelector('[data-component="Pagination.NextPage"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('hides numbered page links when showPages is off (prev/next only)', () => {
    renderFixture(paginationNoPagesFixture);
    expect(screen.queryByRole('link', {name: 'Page 3'})).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Previous Page'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Next Page'})).toBeInTheDocument();
  });

  it('pins extra margin pages at the start with marginPageCount', () => {
    renderFixture(paginationMarginFixture);
    // marginPageCount: 2 -> page 2 is pinned at the start (default margin 1 would omit it).
    // Primer appends "..." to the label of a page that precedes an ellipsis break.
    expect(screen.getByRole('link', {name: /^Page 2\b/})).toBeInTheDocument();
  });

  it('shows more neighbours with surroundingPageCount', () => {
    renderFixture(paginationSurroundingFixture);
    // surroundingPageCount: 4 around page 8 -> page 4 is shown (default 2 would omit it).
    expect(screen.getByRole('link', {name: 'Page 4'})).toBeInTheDocument();
  });

  it('resolves a path-bound currentPage from the data model (page 2 current)', () => {
    renderFixture(paginationControlledFixture);
    expect(screen.getByRole('link', {name: 'Page 2'})).toHaveAttribute('aria-current', 'page');
  });

  it('expands the {page} token in hrefBuilder (uncontrolled: real templated hrefs)', () => {
    renderFixture(paginationHrefFixture);
    expect(screen.getByRole('link', {name: 'Page 3'})).toHaveAttribute('href', '/issues?page=3');
  });

  it('labels the navigation landmark from accessibility.label', () => {
    renderFixture(paginationAccessibilityFixture);
    expect(screen.getByRole('navigation', {name: 'Issues pagination'})).toBeInTheDocument();
  });
});

describe('IconButton — integration through the renderer', () => {
  it('honors the variant enum across the gallery (data-variant)', () => {
    const {container} = renderFixture(iconbuttonVariantsFixture);
    const variants = [...container.querySelectorAll('button[data-variant]')].map(el =>
      el.getAttribute('data-variant'),
    );
    expect(variants).toEqual(['default', 'primary', 'invisible', 'danger', 'link']);
  });

  it('honors the size enum across the gallery (data-size)', () => {
    const {container} = renderFixture(iconbuttonSizesFixture);
    const sizes = [...container.querySelectorAll('button[data-size]')].map(el =>
      el.getAttribute('data-size'),
    );
    expect(sizes).toEqual(['small', 'medium', 'large']);
  });

  it('renders the required icon child and accessibility label', () => {
    renderFixture(iconbuttonDisabledFixture);
    // A disabled IconButton drops its tooltip wrapper, so the label lands on the button directly.
    expect(screen.getByRole('button', {name: 'Delete'})).toBeInTheDocument();
  });

  it('honors the disabled state through the renderer', () => {
    renderFixture(iconbuttonDisabledFixture);
    expect(screen.getByRole('button', {name: 'Delete'})).toBeDisabled();
  });

  it('honors the loading state and announces it to assistive technologies', () => {
    const {container} = renderFixture(iconbuttonLoadingFixture);
    // loading blocks interaction just like disabled and swaps the icon for a spinner.
    expect(container.querySelector('button')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Syncing…')).toBeInTheDocument();
  });

  it('honors the inactive state through the renderer (data-inactive, still interactive)', () => {
    const {container} = renderFixture(iconbuttonInactiveFixture);
    // inactive looks disabled but stays interactive, so Primer marks it with data-inactive
    // rather than aria-disabled.
    expect(container.querySelector('button')).toHaveAttribute('data-inactive', 'true');
  });

  it('honors the block state through the renderer (data-block)', () => {
    const {container} = renderFixture(iconbuttonBlockFixture);
    expect(container.querySelector('button[data-block="block"]')).not.toBeNull();
  });

  it('renders the tooltip cluster: description, keybinding hint, and direction', () => {
    const {container} = renderFixture(iconbuttonTooltipFixture);
    // accessibility label names the button; description populates the tooltip.
    expect(screen.getByRole('button', {name: 'Remove'})).toBeInTheDocument();
    expect(screen.getByText('Remove this item')).toBeInTheDocument();
    const tooltip = container.querySelector('[data-component="Tooltip"]');
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveAttribute('data-direction', 'se');
    // the keybinding hint container is rendered only when keybindingHint is set.
    expect(
      container.querySelector('[data-component="Tooltip.KeybindingHintContainer"]'),
    ).not.toBeNull();
  });
});

describe('SegmentedControl (container) — integration through the renderer', () => {
  it('renders a static ChildList of text segments; the selected one gets aria-current', () => {
    renderFixture(segmentedcontrolFixture);
    expect(screen.getByRole('button', {name: 'Preview'})).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', {name: 'Raw'})).not.toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', {name: 'Blame'})).toBeInTheDocument();
  });

  it('expands a dynamic-template ChildList over the bound array (one segment per item, own scope)', () => {
    renderFixture(segmentedcontrolChildrenTemplateFixture);
    expect(screen.getByRole('button', {name: 'Preview'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Raw'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Blame'})).toBeInTheDocument();
  });

  it('honors a literal non-zero selectedIndex through the renderer', () => {
    renderFixture(segmentedcontrolSelectedFixture);
    expect(screen.getByRole('button', {name: 'Raw'})).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', {name: 'Preview'})).not.toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('forwards fullWidth as a Primer data attribute', () => {
    const {container} = renderFixture(segmentedcontrolFullwidthFixture);
    expect(container.querySelector('[data-full-width="true"]')).not.toBeNull();
  });

  it('honors the size enum through the renderer (one surface per value)', () => {
    const {container} = renderFixture(segmentedcontrolSizeFixture);
    const sizes = [...container.querySelectorAll('[data-size]')]
      .map(el => el.getAttribute('data-size'))
      .sort();
    expect(sizes).toEqual(['medium', 'small']);
  });

  it('forwards a responsive variant map as per-viewport data attributes', () => {
    const {container} = renderFixture(segmentedcontrolVariantFixture);
    const el = container.querySelector('[data-variant-narrow]');
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute('data-variant-narrow', 'hideLabels');
    expect(el).toHaveAttribute('data-variant-regular', 'default');
  });

  it('applies the accessibility label as aria-label on the group container', () => {
    renderFixture(segmentedcontrolFixture);
    expect(screen.getByRole('list', {name: 'File view'})).toBeInTheDocument();
  });
});

describe('SegmentedControl.Button (text segment) — integration through the renderer', () => {
  it('renders literal segment labels inside the control', () => {
    renderFixture(segmentedcontrolbuttonFixture);
    expect(screen.getByRole('button', {name: 'Preview'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Raw'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Blame'})).toBeInTheDocument();
  });

  it('renders a leadingVisual Icon before each label', () => {
    const {container} = renderFixture(segmentedcontrolbuttonLeadingvisualFixture);
    expect(screen.getByRole('button', {name: /Preview/})).toBeInTheDocument();
    // each segment builds its Icon child (an octicon svg).
    expect(container.querySelectorAll('svg.octicon').length).toBeGreaterThanOrEqual(3);
  });

  it('renders a trailing count on each segment', () => {
    renderFixture(segmentedcontrolbuttonCountFixture);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('honors a disabled segment through the renderer', () => {
    renderFixture(segmentedcontrolbuttonDisabledFixture);
    expect(screen.getByRole('button', {name: 'Raw'})).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', {name: 'Preview'})).not.toHaveAttribute('aria-disabled');
  });
});

describe('SegmentedControl.IconButton (icon segment) — integration through the renderer', () => {
  it('renders three icon-only segments carrying their required accessible labels', () => {
    const {container} = renderFixture(segmentedcontroliconbuttonFixture);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    // the required aria-label is wired for assistive tech (via the tooltip label channel).
    expect(container.textContent).toContain('Zoom');
    expect(container.textContent).toContain('List');
    expect(container.textContent).toContain('Browser');
  });

  it('honors a disabled icon segment through the renderer', () => {
    renderFixture(segmentedcontroliconbuttonDisabledFixture);
    const disabled = screen
      .getAllByRole('button')
      .filter(b => b.getAttribute('aria-disabled') === 'true');
    expect(disabled).toHaveLength(1);
  });
});

describe('Details (disclosure) — integration through the renderer', () => {
  it('renders the summary label and static body across both open states', () => {
    renderFixture(detailsOpenFixture);
    expect(screen.getAllByText('More info')).toHaveLength(2);
    expect(screen.getAllByText('First')).toHaveLength(2);
    expect(screen.getAllByText('Second')).toHaveLength(2);
  });

  it('reflects the collapsed and expanded open states on the <details> elements', () => {
    const {container} = renderFixture(detailsOpenFixture);
    const collapsed = container.querySelector('[data-testid="surface-details-collapsed"] details');
    const expanded = container.querySelector('[data-testid="surface-details-expanded"] details');
    expect(collapsed).not.toHaveAttribute('open');
    expect(expanded).toHaveAttribute('open');
  });

  it('renders the summary inside a Details.Summary slot', () => {
    const {container} = renderFixture(detailsOpenFixture);
    const summary = container.querySelector('summary[data-component="Details.Summary"]');
    expect(summary).not.toBeNull();
    expect(summary?.textContent).toContain('More info');
  });

  it('expands a dynamic-template body from the bound /items array', () => {
    renderFixture(detailsChildrenTemplateFixture);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('resolves a path-bound open from the data model (initially false -> collapsed)', () => {
    const {container} = renderFixture(detailsBoundFixture);
    expect(container.querySelector('details')).not.toHaveAttribute('open');
  });
});

describe('Select (form input + container) — integration through the renderer', () => {
  it('renders a static ChildList of options and reflects the selected value', () => {
    renderFixture(selectFixture);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('feature');
    expect(screen.getByRole('option', {name: 'Bug'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Feature'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Docs'})).toBeInTheDocument();
  });

  it('expands a dynamic-template ChildList of options over the bound array', () => {
    renderFixture(selectChildrenTemplateFixture);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('feature');
    expect(screen.getByRole('option', {name: 'Bug'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Feature'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Docs'})).toBeInTheDocument();
  });

  it('shows the placeholder leading option through the renderer', () => {
    renderFixture(selectPlaceholderFixture);
    expect(screen.getByRole('option', {name: 'Choose a label'})).toBeInTheDocument();
  });

  it('honors the disabled Select through the renderer', () => {
    renderFixture(selectDisabledFixture);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('drives aria-invalid from the error validationStatus through the renderer', () => {
    renderFixture(selectValidationFixture);
    // one surface per status; only the error surface reports aria-invalid="true".
    const boxes = screen.getAllByRole('combobox');
    const invalid = boxes.map(el => el.getAttribute('aria-invalid')).sort();
    expect(invalid).toEqual(['false', 'true']);
  });

  it('renders a block Select through the renderer', () => {
    renderFixture(selectBlockFixture);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('feature');
  });

  it('renders one Select per size enum value through the renderer', () => {
    renderFixture(selectSizeFixture);
    expect(screen.getAllByRole('combobox')).toHaveLength(3);
  });
});

describe('SelectOption (option leaf) — integration through the renderer', () => {
  it('renders each option label and drives selection by matching value', () => {
    renderFixture(selectoptionFixture);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('feature');
    const feature = screen.getByRole('option', {name: 'Feature'}) as HTMLOptionElement;
    expect(feature.value).toBe('feature');
    expect(feature.selected).toBe(true);
  });

  it('honors a disabled option through the renderer', () => {
    renderFixture(selectoptionDisabledFixture);
    expect(screen.getByRole('option', {name: 'Feature'})).toBeDisabled();
  });
});

describe('SelectOptGroup (option-group leaf) — integration through the renderer', () => {
  it('renders group label headings wrapping their options', () => {
    renderFixture(selectoptgroupFixture);
    expect(screen.getByRole('group', {name: 'Open'})).toBeInTheDocument();
    expect(screen.getByRole('group', {name: 'Closed'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Triage'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: 'Cancelled'})).toBeInTheDocument();
  });

  it('honors a disabled group through the renderer', () => {
    renderFixture(selectoptgroupDisabledFixture);
    expect(screen.getByRole('group', {name: 'Closed'})).toBeDisabled();
  });
});

describe('TextInput — integration through the renderer', () => {
  it('renders a literal TextInput value', () => {
    renderFixture(textinputFixture);
    expect(screen.getByRole('textbox')).toHaveValue('octocat');
  });

  it('renders a path-bound TextInput value from the data model', () => {
    renderFixture(textinputBoundFixture);
    expect(screen.getByRole('textbox')).toHaveValue('octocat');
  });

  it('writes user edits back to the bound path (two-way binding) and re-renders', async () => {
    renderFixture(textinputBoundFixture);
    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'octocat-labs'}});
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('octocat-labs'));
  });

  it('shows the TextInput placeholder while empty', () => {
    renderFixture(textinputPlaceholderFixture);
    expect(screen.getByPlaceholderText('Search repositories')).toBeInTheDocument();
  });

  it('honors the disabled TextInput through the renderer', () => {
    renderFixture(textinputDisabledFixture);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('drives aria-invalid from the error validationStatus through the renderer', () => {
    renderFixture(textinputValidationFixture);
    // Primer's TextInput sets aria-invalid only on the error surface (undefined otherwise), so
    // exactly one of the two gallery surfaces reports aria-invalid="true".
    const boxes = screen.getAllByRole('textbox');
    const invalidCount = boxes.filter(el => el.getAttribute('aria-invalid') === 'true').length;
    expect(invalidCount).toBe(1);
  });

  it('resolves a path-bound validationStatus from the data model (the agent-driven coupling)', () => {
    // validationStatus is a bindable enum: a {path} reference resolves and subscribes through the
    // binder (the coupling textinput-action.md relies on — an agent writes /validation → the field
    // reflects it). Here /validation starts 'error' -> the single input reports aria-invalid="true".
    const boundValidation: Fixture = {
      name: 'textinput-validation-bound-inline',
      messages: [
        {version: 'v0.9', createSurface: {surfaceId: 's', catalogId: CATALOG_ID}},
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 's',
            components: [
              {
                id: 'root',
                component: 'TextInput',
                value: 'x',
                validationStatus: {path: '/validation'},
                accessibility: {label: 'Field'},
              },
            ],
          },
        },
        {
          version: 'v0.9',
          updateDataModel: {surfaceId: 's', path: '/', value: {validation: 'error'}},
        },
      ],
    };
    renderFixture(boundValidation);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets the input type per enum value through the renderer', () => {
    const {container} = renderFixture(textinputTypeFixture);
    expect(container.querySelector('input[type="email"]')).not.toBeNull();
    expect(container.querySelector('input[type="password"]')).not.toBeNull();
    expect(container.querySelector('input[type="url"]')).not.toBeNull();
  });

  it('renders a leadingVisual slot inside the input', () => {
    const {container} = renderFixture(textinputLeadingVisualFixture);
    expect(screen.getByRole('textbox')).toHaveValue('octocat');
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders a trailingVisual slot inside the input', () => {
    const {container} = renderFixture(textinputTrailingVisualFixture);
    expect(screen.getByRole('textbox')).toHaveValue('octocat');
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders a trailingAction slot (a TextInput.Action button) inside the input', () => {
    renderFixture(textinputTrailingActionFixture);
    expect(screen.getByRole('textbox')).toHaveValue('octocat');
    expect(screen.getByRole('button', {name: 'Clear'})).toBeInTheDocument();
  });

  it('clears the bound value when the trailing Clear action runs (clearValue functionCall)', async () => {
    renderFixture(textinputTrailingActionFixture);
    expect(screen.getByRole('textbox')).toHaveValue('octocat');
    fireEvent.click(screen.getByRole('button', {name: 'Clear'}));
    // clearValue writes '' to /query; the input, subscribed to that path, re-renders empty.
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue(''));
  });

  it('forces error styling when the character limit is exceeded', () => {
    renderFixture(textinputCharacterLimitFixture);
    // Two coupled surfaces; only the over-limit one flips aria-invalid to "true".
    const boxes = screen.getAllByRole('textbox');
    const invalidCount = boxes.filter(el => el.getAttribute('aria-invalid') === 'true').length;
    expect(invalidCount).toBe(1);
  });

  it('renders one input per size enum value through the renderer', () => {
    renderFixture(textinputSizeFixture);
    expect(screen.getAllByRole('textbox')).toHaveLength(3);
  });

  it('renders block, contrast and monospace TextInputs through the renderer', () => {
    renderFixture(textinputBlockFixture);
    expect(screen.getByRole('textbox')).toHaveValue('Full width');
    cleanup();
    renderFixture(textinputContrastFixture);
    expect(screen.getByRole('textbox')).toHaveValue('High contrast');
    cleanup();
    renderFixture(textinputMonospaceFixture);
    expect(screen.getByRole('textbox')).toHaveValue('git rev-parse HEAD');
  });

  it('renders a loading TextInput mini-gallery through the renderer', () => {
    renderFixture(textinputLoadingFixture);
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
  });
});

describe('TextInput.Action — integration through the renderer', () => {
  it('honors the disabled TextInput.Action through the renderer', () => {
    renderFixture(textinputActionDisabledFixture);
    expect(screen.getByRole('button', {name: 'Clear'})).toBeDisabled();
  });
});

function breadcrumbsOverflowFixture(overflow: 'wrap' | 'menu' | 'menu-with-root'): Fixture {
  const surfaceId = `breadcrumbs-overflow-${overflow}`;
  return {
    name: surfaceId,
    messages: [
      {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId,
          components: [
            {id: 'root', component: 'Breadcrumbs', overflow, children: ['c0', 'c1']},
            {id: 'c0', component: 'BreadcrumbsItem', label: 'Home', href: '/'},
            {id: 'c1', component: 'BreadcrumbsItem', label: 'Settings', href: '/settings'},
          ],
        },
      },
    ],
  };
}

describe('Breadcrumbs (container) — integration through the renderer', () => {
  it('renders a static ChildList of crumbs; the selected one gets aria-current', () => {
    renderFixture(breadcrumbsFixture);
    expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Repositories'})).toBeInTheDocument();
    const current = screen.getByText('Settings');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('expands a dynamic-template ChildList over the bound array (one crumb per item, own scope)', () => {
    renderFixture(breadcrumbsChildrenTemplateFixture);
    expect(screen.getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', {name: 'Repositories'})).toHaveAttribute('href', '/repos');
    // The bound `current: true` crumb resolves to the current page (aria-current), non-link.
    expect(screen.getByText('Settings')).toHaveAttribute('aria-current', 'page');
  });

  it('renders inside a nav landmark labelled Breadcrumbs', () => {
    renderFixture(breadcrumbsFixture);
    expect(screen.getByRole('navigation', {name: 'Breadcrumbs'})).toBeInTheDocument();
  });

  it('emits each overflow mode on the nav (data-overflow)', () => {
    for (const overflow of ['wrap', 'menu', 'menu-with-root'] as const) {
      cleanup();
      const {container} = renderFixture(breadcrumbsOverflowFixture(overflow));
      expect(container.querySelector('nav[data-component="Breadcrumbs"]')).toHaveAttribute(
        'data-overflow',
        overflow,
      );
    }
  });

  it('honors the variant enum through the renderer (one surface per value)', () => {
    const {container} = renderFixture(breadcrumbsVariantFixture);
    const variants = [...container.querySelectorAll('nav[data-variant]')]
      .map(el => el.getAttribute('data-variant'))
      .sort();
    expect(variants).toEqual(['normal', 'spacious']);
  });
});

describe('Breadcrumbs.Item (crumb leaf) — integration through the renderer', () => {
  it('renders literal crumbs carrying their href inside the trail', () => {
    renderFixture(breadcrumbsitemFixture);
    expect(screen.getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', {name: 'Repositories'})).toHaveAttribute('href', '/repos');
    expect(screen.getByRole('link', {name: 'Settings'})).toHaveAttribute('href', '/settings');
  });

  it('renders the current-page crumb as selected and non-navigating', () => {
    renderFixture(breadcrumbsitemSelectedFixture);
    const current = screen.getByText('Settings');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).not.toHaveAttribute('href');
    // The other crumbs stay navigating links.
    expect(screen.getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/');
  });
});

describe('NavList (compound family) — integration through the renderer', () => {
  it('renders the composed baseline: the nav landmark and its item labels', () => {
    renderFixture(navlistFixture);
    expect(screen.getByRole('navigation', {name: 'Repository'})).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Pull requests')).toBeInTheDocument();
    // Trailing visual (CounterLabel) and description content render inside the item.
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Open and merged')).toBeInTheDocument();
    // The expanded SubNav (defaultOpen) renders its nested items.
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    // The Group heading and its items.
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('places each slot in its Primer slot, not flattened into the item label', () => {
    const {container} = renderFixture(navlistFixture);
    const labels = [
      ...container.querySelectorAll<HTMLElement>('[data-component="ActionList.Item.Label"]'),
    ];
    // The "Pull requests" item exercises every slot. When slots are routed correctly, its label
    // holds ONLY the label text — the leading/trailing visuals, description, sub-nav, and trailing
    // action each live in their own Primer slot, not crammed into the label span.
    const prLabel = labels.find(l => l.textContent?.includes('Pull requests'));
    expect(prLabel).toBeDefined();
    expect(prLabel!.textContent).toBe('Pull requests');
    expect(prLabel!.querySelector('[data-component="ActionList.LeadingVisual"]')).toBeNull();
    expect(prLabel!.querySelector('[data-component="ActionList.TrailingVisual"]')).toBeNull();
    expect(prLabel!.querySelector('button')).toBeNull();
    expect(prLabel!.querySelector('ul')).toBeNull();
    // Dashboard's leading visual is likewise outside its label.
    const dashLabel = labels.find(l => l.textContent?.includes('Dashboard'));
    expect(dashLabel!.textContent).toBe('Dashboard');
  });

  it('renders the inactive item (inactiveText) through the renderer', () => {
    renderFixture(navlistItemInactiveFixture);
    expect(screen.getByText('Draft settings')).toBeInTheDocument();
  });

  it('honors the loading TrailingAction through the renderer', () => {
    renderFixture(navlistTrailingactionLoadingFixture);
    // A loading IconButton keeps its accessible name.
    expect(screen.getByRole('button', {name: 'Sync'})).toBeInTheDocument();
  });

  it('resolves the bound Group title through the renderer', () => {
    renderFixture(navlistGroupBoundFixture);
    expect(screen.getByText('Personal settings')).toBeInTheDocument();
  });

  it('renders one GroupHeading per variant enum value through the renderer', () => {
    renderFixture(navlistGroupheadingVariantsFixture);
    expect(screen.getByText('subtle')).toBeInTheDocument();
    expect(screen.getByText('filled')).toBeInTheDocument();
  });

  it('resolves the bound GroupHeading text through the renderer', () => {
    renderFixture(navlistGroupheadingBoundFixture);
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('renders one Description per variant enum value through the renderer', () => {
    renderFixture(navlistDescriptionVariantsFixture);
    expect(screen.getByText('inline')).toBeInTheDocument();
    expect(screen.getByText('block')).toBeInTheDocument();
  });

  it('resolves the bound, truncated Description text through the renderer', () => {
    renderFixture(navlistDescriptionTruncateFixture);
    expect(
      screen.getByText(
        'A very long description that overflows the available inline space and is truncated',
      ),
    ).toBeInTheDocument();
  });

  it('renders the collapsed GroupExpand with its show-more control', () => {
    renderFixture(navlistGroupexpandFixture);
    // Primer's GroupExpand starts collapsed (pages=2, currentPage=0 shows 0 items); only the
    // show-more control is visible until it is expanded (see the pagination action test).
    expect(screen.getByText('Show more repositories')).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'api'})).not.toBeInTheDocument();
  });
});

describe('PageLayout (compound family) — integration through the renderer', () => {
  it('renders the base composition with all four region slots through the renderer', () => {
    renderFixture(pagelayoutFixture);
    // header (Heading), content (Stack of Text), pane (Stack of Link), footer (Text)
    expect(screen.getByText('Repositories')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Issues'})).toBeInTheDocument();
    expect(screen.getByText('© 2026 Example')).toBeInTheDocument();
  });

  it('renders the sidebar + content composition through the renderer', () => {
    renderFixture(pagelayoutSidebarFixture);
    expect(screen.getByRole('link', {name: 'Code'})).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('renders one surface per containerWidth enum value through the renderer', () => {
    renderFixture(pagelayoutContainerwidthFixture);
    // one surface per ['full','medium','large','xlarge'] — each with a header + content
    expect(screen.getAllByText('Repositories')).toHaveLength(4);
    expect(screen.getAllByText('Overview')).toHaveLength(4);
  });

  it('expands the content bound ChildList template through the renderer', () => {
    renderFixture(pagelayoutContentTemplateFixture);
    // the template Text resolves {path:'label'} once per item in the bound /items array
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders one surface per header divider enum value through the renderer', () => {
    renderFixture(pagelayoutHeaderDividerFixture);
    expect(screen.getAllByText('Repositories')).toHaveLength(2);
  });

  it('renders a resizable pane with a drag handle through the renderer', () => {
    renderFixture(pagelayoutPaneResizableFixture);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders a resizable sidebar with a drag handle through the renderer', () => {
    renderFixture(pagelayoutSidebarResizableFixture);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders the pane in controlled mode when currentWidth is bound to a path', () => {
    // currentWidth <- /paneWidth (320); the two-way resize write-back is confirmed by live drag
    // review. Here the bound, resizable pane renders with its drag handle.
    renderFixture(pagelayoutPaneCurrentwidthFixture);
    expect(screen.getByRole('slider')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Issues'})).toBeInTheDocument();
  });
});

describe('SplitPageLayout (split page layout compound) — integration through the renderer', () => {
  it('renders every region of the header/content/pane/footer composition', () => {
    const {container} = renderFixture(splitPageLayoutFixture);
    expect(container.querySelector('[data-component="PageLayout"]')).not.toBeNull();
    expect(screen.getByText('Repository settings')).toBeInTheDocument();
    expect(screen.getByText(/Manage general settings/)).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Overview'})).toBeInTheDocument();
    expect(screen.getByText('© 2026 GitHub')).toBeInTheDocument();
  });

  it('renders the full-height sidebar composition', () => {
    const {container} = renderFixture(splitPageLayoutSidebarFixture);
    expect(container.querySelector('[data-component="PageLayout.Sidebar"]')).not.toBeNull();
    expect(screen.getByRole('link', {name: 'Settings'})).toBeInTheDocument();
    expect(screen.getByText('© 2026 GitHub')).toBeInTheDocument();
  });

  // Regression guard for slot-flattening: Primer's PageLayout routes header/footer/sidebar into
  // their regions via `useSlots`, which matches each region's slot marker. The a2ui `DeferredChild`
  // wrapper hides that marker, so without the `asSlot` bridges every region falls into `rest` and
  // renders flattened (stacked in document order) — presence assertions still pass, only placement
  // is wrong. These two tests assert placement, so they fail on the flattened render.
  it('slots the sidebar region out of the content flow (not flattened)', () => {
    const {container} = renderFixture(splitPageLayoutSidebarFixture);
    const root = container.querySelector('[data-component="PageLayout"]');
    // Primer sets `data-has-sidebar` only when `useSlots` matches the sidebar bridge; on a flattened
    // render the sidebar falls into `rest` and the attribute is absent.
    expect(root?.getAttribute('data-has-sidebar')).toBe('true');
  });

  it('places header and footer in their regions, not flattened into content', () => {
    const {container} = renderFixture(splitPageLayoutFixture);
    const wrapper = container.querySelector('[data-width]');
    const header = container.querySelector('[data-component="PageLayout.Header"]');
    const content = container.querySelector('[data-component="PageLayout.Content"]');
    const footer = container.querySelector('[data-component="PageLayout.Footer"]');
    // Slotted: header/footer are direct children of the layout wrapper; content lives in the inner
    // rest container. Flattened: all three share the rest container (header.parent === content.parent).
    expect(header?.parentElement).toBe(wrapper);
    expect(footer?.parentElement).toBe(wrapper);
    expect(content?.parentElement).not.toBe(wrapper);
    expect(header?.parentElement).not.toBe(content?.parentElement);
  });

  it('renders both header divider states across the gallery', () => {
    const {container} = renderFixture(splHeaderDividerFixture);
    expect(container.querySelectorAll('[data-component="PageLayout.Header"]')).toHaveLength(2);
    expect(screen.getAllByText('Repository settings')).toHaveLength(2);
  });

  it('forwards the content max-width across the width gallery', () => {
    const {container} = renderFixture(splContentWidthFixture);
    expect(container.querySelector('[data-width="full"]')).not.toBeNull();
    expect(container.querySelector('[data-width="xlarge"]')).not.toBeNull();
  });

  it('renders the content padding gallery', () => {
    const {container} = renderFixture(splContentPaddingFixture);
    expect(container.querySelectorAll('[data-component="PageLayout.Content"]')).toHaveLength(3);
  });

  it('expands a dynamic-template content ChildList from the bound /items array', () => {
    renderFixture(splContentChildrenTemplateFixture);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('forwards the pane position across the gallery', () => {
    const {container} = renderFixture(splPanePositionFixture);
    expect(container.querySelector('[data-position="start"]')).not.toBeNull();
    expect(container.querySelector('[data-position="end"]')).not.toBeNull();
  });

  it('renders the pane width gallery (named sizes + custom constraints)', () => {
    const {container} = renderFixture(splPaneWidthFixture);
    expect(container.querySelectorAll('[data-component="PageLayout.Pane"]')).toHaveLength(4);
    expect(container.innerHTML).toContain('--pane-width-large');
    expect(container.innerHTML).toContain('160px');
  });

  it('renders the pane divider gallery', () => {
    const {container} = renderFixture(splPaneDividerFixture);
    expect(container.querySelectorAll('[data-component="PageLayout.Pane"]')).toHaveLength(2);
  });

  it('exposes the resize handle on the resizable pane', () => {
    const {container} = renderFixture(splPaneResizableFixture);
    expect(container.querySelector('[data-resizable="true"]')).not.toBeNull();
  });
});

describe('PageHeader family — integration through the renderer', () => {
  it('renders the composed PageHeader with every region assembled', () => {
    renderFixture(pageheaderFixture);
    // Title + a representative filler from each region.
    expect(screen.getByText('Pull request #42')).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Conversation'})).toBeInTheDocument();
    expect(screen.getByText('Updates the heading cleanup across the docs.')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('honors hasBorder on the root (visually-distinct state)', () => {
    const {container} = renderFixture(pageheaderHasborderFixture);
    expect(container.querySelector('[data-has-border="true"]')).toBeInTheDocument();
  });

  it('renders a literal ParentLink with its href', () => {
    renderFixture(parentlinkFixture);
    const link = screen.getByRole('link', {name: 'Issues'});
    expect(link).toHaveAttribute('href', '/repos/acme/issues');
  });

  it('resolves a bound ParentLink from the data model', () => {
    renderFixture(parentlinkBoundFixture);
    const link = screen.getByRole('link', {name: 'Issues'});
    expect(link).toHaveAttribute('href', '/repos/acme/issues');
  });

  it('renders a literal Title', () => {
    renderFixture(titleFixture);
    expect(screen.getByRole('heading', {name: 'Pull request #42'})).toBeInTheDocument();
  });

  it('resolves a bound Title from the data model', () => {
    renderFixture(titleBoundFixture);
    expect(screen.getByRole('heading', {name: 'Bound title'})).toBeInTheDocument();
  });

  it('renders the TitleArea variant gallery, each variant nested under a PageHeader root', () => {
    const {container} = renderFixture(titleareaVariantFixture);
    expect(screen.getByText('subtitle')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('large')).toBeInTheDocument();

    // The three TitleAreas carry the distinct size variants...
    const areas = [...container.querySelectorAll('[data-component="TitleArea"]')];
    expect(areas.map(a => a.getAttribute('data-size-variant'))).toEqual([
      'subtitle',
      'medium',
      'large',
    ]);
    // ...and each is nested under a PageHeader root — without that ancestor Primer's `:has()`
    // size rule never matches, so the variant is visually inert (regression guard).
    for (const area of areas) {
      expect(area.closest('[class*="PageHeader-PageHeader"]')).not.toBeNull();
    }
  });

  it('expands a dynamic-template Breadcrumbs ChildList from a bound array', () => {
    renderFixture(breadcrumbsTemplateFixture);
    expect(screen.getByRole('link', {name: 'Repos'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'octo/acme'})).toHaveAttribute('href', '/repos/acme');
    expect(screen.getByRole('link', {name: 'Issues'})).toBeInTheDocument();
  });
});

describe('ActionList — integration through the renderer', () => {
  it('renders the composed baseline: heading, groups, items, link, and danger row', () => {
    renderFixture(actionlistFixture);
    expect(screen.getByText('Repository actions')).toBeInTheDocument();
    expect(screen.getByText('Pull request #42')).toBeInTheDocument();
    expect(screen.getByText('View pull request')).toBeInTheDocument();
    expect(screen.getByText('opened 2 days ago')).toBeInTheDocument();
    expect(screen.getByText('Danger zone')).toBeInTheDocument();
    expect(screen.getByText('Delete branch')).toBeInTheDocument();
  });

  it('exposes a labeled trailing action and a link in the composed baseline', () => {
    renderFixture(actionlistFixture);
    // TrailingAction.label -> the button's accessible name.
    expect(screen.getByRole('button', {name: 'More options'})).toBeInTheDocument();
    // LinkItem renders an anchor to its href.
    expect(screen.getByRole('link', {name: /Open on GitHub/})).toHaveAttribute(
      'href',
      'https://github.com/octocat/repo',
    );
  });

  it('forwards the root `role` to the list container', () => {
    // A role-bearing single-axis fixture (no group headings) exercises root `role`.
    renderFixture(actionlistItemActiveFixture);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('expands a dynamic children template into one item per data-model entry', () => {
    renderFixture(actionlistChildrenTemplateFixture);
    expect(screen.getByText('View pull request')).toBeInTheDocument();
    expect(screen.getByText('Merge')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('renders the selectionVariant gallery (single/radio/multiple) through the renderer', () => {
    const {container} = renderFixture(actionlistSelectionFixture);
    // one surface per selectionVariant value.
    expect(
      container.querySelectorAll('[data-testid^="surface-actionlist-selection-"]'),
    ).toHaveLength(3);
    expect(screen.getAllByText('Assign to me').length).toBe(3);
  });

  it('honors Item boolean states (active/disabled/inactive) through the renderer', () => {
    renderFixture(actionlistItemActiveFixture);
    expect(screen.getByText('Pull requests')).toBeInTheDocument();
    cleanup();
    renderFixture(actionlistItemDisabledFixture);
    // a disabled item is not clickable — Primer marks it aria-disabled.
    expect(document.querySelector('[aria-disabled="true"]')).toBeInTheDocument();
    cleanup();
    renderFixture(actionlistItemInactiveFixture);
    expect(screen.getByText('Unavailable during outage')).toBeInTheDocument();
  });

  it('renders the Item variant and size galleries through the renderer', () => {
    const {container} = renderFixture(actionlistItemVariantFixture);
    expect(
      container.querySelectorAll('[data-testid^="surface-actionlist-item-variant-"]'),
    ).toHaveLength(2);
    cleanup();
    const size = renderFixture(actionlistItemSizeFixture);
    expect(
      size.container.querySelectorAll('[data-testid^="surface-actionlist-item-size-"]'),
    ).toHaveLength(2);
  });

  it('renders the root variant gallery (inset/horizontal-inset/full) through the renderer', () => {
    const {container} = renderFixture(actionlistVariantFixture);
    expect(container.querySelectorAll('[data-testid^="surface-actionlist-variant-"]')).toHaveLength(
      3,
    );
  });

  it('renders a list with dividers shown above each item', () => {
    renderFixture(actionlistDividersFixture);
    expect(screen.getByText('View pull request')).toBeInTheDocument();
    expect(screen.getByText('Delete branch')).toBeInTheDocument();
  });

  it('renders the Group variant gallery (filled/subtle) through the renderer', () => {
    const {container} = renderFixture(actionlistGroupVariantFixture);
    expect(
      container.querySelectorAll('[data-testid^="surface-actionlist-group-variant-"]'),
    ).toHaveLength(2);
  });

  it('renders the Description gallery (inline/block/truncate) through the renderer', () => {
    const {container} = renderFixture(actionlistDescriptionFixture);
    expect(
      container.querySelectorAll('[data-testid^="surface-actionlist-description-"]'),
    ).toHaveLength(3);
    expect(screen.getByText('opened 2 days ago')).toBeInTheDocument();
    expect(screen.getByText('A detailed summary shown below the label')).toBeInTheDocument();
  });

  it('renders a loading trailing action through the renderer', () => {
    renderFixture(actionlistTrailingactionLoadingFixture);
    expect(screen.getByText('Deploy to production')).toBeInTheDocument();
  });
});

describe('ActionBar family — integration through the renderer', () => {
  it('renders a labeled toolbar with its icon buttons and a divider', () => {
    const {container} = renderFixture(actionBarFixture);
    // accessibility.label is forwarded to the toolbar's aria-label.
    expect(screen.getByRole('toolbar', {name: 'Formatting'})).toBeInTheDocument();
    for (const label of ['Bold', 'Italic', 'Strikethrough']) {
      expect(screen.getByRole('button', {name: label})).toBeInTheDocument();
    }
    // ActionBar.Divider renders an aria-hidden separator element, preserved among the children.
    expect(container.querySelector('[data-component="ActionBar.VerticalDivider"]')).not.toBeNull();
  });

  it('renders a dynamic-template ChildList, one button per bound array item', () => {
    renderFixture(actionBarChildrenTemplateFixture);
    // Each template ActionBar.IconButton's aria-label binds to its data-scope item's label.
    for (const label of ['Bold', 'Italic', 'Underline']) {
      expect(screen.getByRole('button', {name: label})).toBeInTheDocument();
    }
  });

  it('renders an ActionBar.Group of icon buttons', () => {
    const {container} = renderFixture(actionBarGroupFixture);
    expect(container.querySelector('[data-component="ActionBar.Group"]')).not.toBeNull();
    for (const label of ['Bold', 'Italic', 'Strikethrough']) {
      expect(screen.getByRole('button', {name: label})).toBeInTheDocument();
    }
  });

  it('honors a disabled ActionBar.IconButton (aria-disabled, stays focusable)', () => {
    renderFixture(actionBarIconButtonDisabledFixture);
    expect(screen.getByRole('button', {name: 'Delete'})).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders a flush ActionBar through the renderer', () => {
    const {container} = renderFixture(actionBarFlushFixture);
    expect(container.querySelector('[data-component="ActionBar"]')).toHaveAttribute(
      'data-flush',
      'true',
    );
  });

  it('renders the ActionBar.Menu button plus its companion bound Text', () => {
    renderFixture(actionBarMenuFixture);
    expect(screen.getByRole('button', {name: 'Actions'})).toBeInTheDocument();
    // The companion Text resolves its bound `text <- /status` (initial 'Ready').
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('opens the ActionBar.Menu and renders the breadth of item shapes, including a submenu', () => {
    renderFixture(actionBarMenuFixture);
    fireEvent.click(screen.getByRole('button', {name: 'Actions'}));
    for (const label of ['Cut', 'Copy', 'Paste', 'Delete', 'Archive', 'More']) {
      expect(screen.getByRole('menuitem', {name: new RegExp(label)})).toBeInTheDocument();
    }
    // The trailing text string is rendered verbatim beside the Copy item.
    expect(screen.getByText('⌘C')).toBeInTheDocument();
    // A disabled item is marked disabled; a danger item still renders.
    expect(screen.getByRole('menuitem', {name: /Archive/})).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    // The nested submenu opens on selecting its parent item (submenu-open state).
    fireEvent.click(screen.getByRole('menuitem', {name: /More/}));
    expect(screen.getByRole('menuitem', {name: 'Sub A'})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'Sub B'})).toBeInTheDocument();
  });
});

describe('TreeView (compound family) — integration through the renderer', () => {
  it('renders the nested tree — items, nested labels, and the root/subtree accessible labels', () => {
    const {container} = renderFixture(treeViewNestedFixture);
    // Every item (top-level + nested) renders as a treeitem; nested labels are visible.
    expect(screen.getAllByRole('treeitem')).toHaveLength(4);
    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('index.ts')).toBeInTheDocument();
    expect(screen.getByText('app.ts')).toBeInTheDocument();
    expect(screen.getByText('README.md')).toBeInTheDocument();
    // Root accessibility -> aria-label on the tree; SubTree accessibility -> aria-label on the group.
    expect(screen.getByRole('tree')).toHaveAttribute('aria-label', 'Project files');
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'src contents');
    // Item id is the component-envelope id, reflected onto the rendered element.
    expect(container.querySelector('#item-src')).not.toBeNull();
    // containIntrinsicSize is accepted and the item still renders its label.
    expect(container.querySelector('#item-readme')).not.toBeNull();
  });

  it('renders a flat tree of items', () => {
    renderFixture(treeViewFlatFixture);
    expect(screen.getAllByRole('treeitem')).toHaveLength(3);
    expect(screen.getByText('utils.ts')).toBeInTheDocument();
  });

  it('renders a truncated long label', () => {
    renderFixture(treeViewTruncateFixture);
    expect(screen.getByText(/a-very-long-file-name-that-should-be-truncated/)).toBeInTheDocument();
  });

  it('marks the current item via aria-current', () => {
    renderFixture(treeViewItemCurrentFixture);
    expect(screen.getByRole('treeitem', {name: /index\.ts/})).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('resolves the bound expanded state and reveals the subtree contents', () => {
    // /openState = true, so the bound item is open and its subtree child is visible.
    renderFixture(treeViewItemExpandedBoundFixture);
    expect(screen.getByText('index.ts')).toBeInTheDocument();
  });

  it('renders the leading and trailing visuals with their accessible labels', () => {
    const {container} = renderFixture(treeViewVisualsFixture);
    // Two octicon SVGs (leading file + trailing dot) render as the item's visuals.
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Modified')).toBeInTheDocument();
  });

  it('renders the preset directory icon in both expanded and collapsed surfaces', () => {
    const {container} = renderFixture(treeViewDirectoryIconFixture);
    // One directory glyph per surface (open + closed).
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });

  it('renders the subtree state gallery (done reveals its child)', () => {
    renderFixture(treeViewSubtreeStatesFixture);
    // The done surface reveals its child label (loading/error surfaces reference it too).
    expect(screen.getAllByText('index.ts').length).toBeGreaterThanOrEqual(1);
    // Three tree surfaces (done, loading, error) render.
    expect(screen.getAllByRole('tree')).toHaveLength(3);
  });

  it('renders the error dialog with its title and the bound body message', () => {
    renderFixture(treeViewErrorDialogFixture);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
    // The dialog body Text is bound to /retryMessage and resolves through the renderer.
    expect(screen.getByText('Could not load the folder')).toBeInTheDocument();
  });
});
