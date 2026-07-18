import type {Fixture} from './types';

export type {Fixture} from './types';

/**
 * A selectable test-space fixture: its stable `name` (shown in the selector and used as the
 * `?fixture=` URL value) plus a lazy `load()` that dynamically imports the fixture body only
 * when it is actually needed. The selector is populated from `name` alone — no fixture body is
 * imported until one is selected — so a dev page load fetches a single fixture module instead of
 * all ~327 of them.
 */
export interface FixtureEntry {
  name: string;
  load: () => Promise<Fixture>;
}

export const FIXTURES: FixtureEntry[] = [
  {name: 'text', load: () => import('./text').then(m => m.textFixture)},
  {name: 'text-bound', load: () => import('./text-bound').then(m => m.textBoundFixture)},
  {name: 'text-sizes', load: () => import('./text-sizes').then(m => m.textSizesFixture)},
  {name: 'text-weights', load: () => import('./text-weights').then(m => m.textWeightsFixture)},
  {name: 'text-as', load: () => import('./text-as').then(m => m.textAsFixture)},
  {
    name: 'text-whitespace',
    load: () => import('./text-whitespace').then(m => m.textWhitespaceFixture),
  },
  {name: 'button-fn', load: () => import('./button-fn').then(m => m.buttonFnFixture)},
  {name: 'button-event', load: () => import('./button-event').then(m => m.buttonEventFixture)},
  {
    name: 'button-variants',
    load: () => import('./button-variants').then(m => m.buttonVariantsFixture),
  },
  {name: 'button-sizes', load: () => import('./button-sizes').then(m => m.buttonSizesFixture)},
  {
    name: 'button-aligncontent',
    load: () => import('./button-aligncontent').then(m => m.buttonAligncontentFixture),
  },
  {
    name: 'button-disabled',
    load: () => import('./button-disabled').then(m => m.buttonDisabledFixture),
  },
  {
    name: 'button-inactive',
    load: () => import('./button-inactive').then(m => m.buttonInactiveFixture),
  },
  {
    name: 'button-loading',
    load: () => import('./button-loading').then(m => m.buttonLoadingFixture),
  },
  {name: 'button-block', load: () => import('./button-block').then(m => m.buttonBlockFixture)},
  {
    name: 'button-labelwrap',
    load: () => import('./button-labelwrap').then(m => m.buttonLabelwrapFixture),
  },
  {name: 'button-count', load: () => import('./button-count').then(m => m.buttonCountFixture)},
  {name: 'button-icon', load: () => import('./button-icon').then(m => m.buttonIconFixture)},
  {
    name: 'button-leading-visual',
    load: () => import('./button-leading-visual').then(m => m.buttonLeadingVisualFixture),
  },
  {
    name: 'button-trailing-visual',
    load: () => import('./button-trailing-visual').then(m => m.buttonTrailingVisualFixture),
  },
  {
    name: 'button-trailing-action',
    load: () => import('./button-trailing-action').then(m => m.buttonTrailingActionFixture),
  },
  {name: 'iconbutton-fn', load: () => import('./iconbutton-fn').then(m => m.iconbuttonFnFixture)},
  {
    name: 'iconbutton-event',
    load: () => import('./iconbutton-event').then(m => m.iconbuttonEventFixture),
  },
  {
    name: 'iconbutton-variants',
    load: () => import('./iconbutton-variants').then(m => m.iconbuttonVariantsFixture),
  },
  {
    name: 'iconbutton-sizes',
    load: () => import('./iconbutton-sizes').then(m => m.iconbuttonSizesFixture),
  },
  {
    name: 'iconbutton-disabled',
    load: () => import('./iconbutton-disabled').then(m => m.iconbuttonDisabledFixture),
  },
  {
    name: 'iconbutton-loading',
    load: () => import('./iconbutton-loading').then(m => m.iconbuttonLoadingFixture),
  },
  {
    name: 'iconbutton-inactive',
    load: () => import('./iconbutton-inactive').then(m => m.iconbuttonInactiveFixture),
  },
  {
    name: 'iconbutton-block',
    load: () => import('./iconbutton-block').then(m => m.iconbuttonBlockFixture),
  },
  {
    name: 'iconbutton-tooltip',
    load: () => import('./iconbutton-tooltip').then(m => m.iconbuttonTooltipFixture),
  },
  {name: 'icon-names', load: () => import('./icon-names').then(m => m.iconNamesFixture)},
  {name: 'icon-sizes', load: () => import('./icon-sizes').then(m => m.iconSizesFixture)},
  {name: 'icon-fills', load: () => import('./icon-fills').then(m => m.iconFillsFixture)},
  {name: 'link', load: () => import('./link').then(m => m.linkFixture)},
  {name: 'link-bound', load: () => import('./link-bound').then(m => m.linkBoundFixture)},
  {name: 'link-muted', load: () => import('./link-muted').then(m => m.linkMutedFixture)},
  {name: 'link-inline', load: () => import('./link-inline').then(m => m.linkInlineFixture)},
  {name: 'heading', load: () => import('./heading').then(m => m.headingFixture)},
  {name: 'heading-bound', load: () => import('./heading-bound').then(m => m.headingBoundFixture)},
  {
    name: 'heading-variants',
    load: () => import('./heading-variants').then(m => m.headingVariantsFixture),
  },
  {name: 'branchname', load: () => import('./branchname').then(m => m.branchnameFixture)},
  {
    name: 'branchname-bound',
    load: () => import('./branchname-bound').then(m => m.branchnameBoundFixture),
  },
  {name: 'branchname-as', load: () => import('./branchname-as').then(m => m.branchnameAsFixture)},
  {name: 'relative-time', load: () => import('./relative-time').then(m => m.relativeTimeFixture)},
  {
    name: 'relative-time-bound',
    load: () => import('./relative-time-bound').then(m => m.relativeTimeBoundFixture),
  },
  {
    name: 'relative-time-formats',
    load: () => import('./relative-time-formats').then(m => m.relativeTimeFormatsFixture),
  },
  {
    name: 'relative-time-format-styles',
    load: () =>
      import('./relative-time-format-styles').then(m => m.relativeTimeFormatStylesFixture),
  },
  {
    name: 'relative-time-tenses',
    load: () => import('./relative-time-tenses').then(m => m.relativeTimeTensesFixture),
  },
  {
    name: 'relative-time-precision',
    load: () => import('./relative-time-precision').then(m => m.relativeTimePrecisionFixture),
  },
  {
    name: 'relative-time-threshold',
    load: () => import('./relative-time-threshold').then(m => m.relativeTimeThresholdFixture),
  },
  {
    name: 'relative-time-prefix',
    load: () => import('./relative-time-prefix').then(m => m.relativeTimePrefixFixture),
  },
  {
    name: 'relative-time-datetime-parts',
    load: () =>
      import('./relative-time-datetime-parts').then(m => m.relativeTimeDatetimePartsFixture),
  },
  {name: 'label', load: () => import('./label').then(m => m.labelFixture)},
  {name: 'label-bound', load: () => import('./label-bound').then(m => m.labelBoundFixture)},
  {
    name: 'label-variants',
    load: () => import('./label-variants').then(m => m.labelVariantsFixture),
  },
  {name: 'label-sizes', load: () => import('./label-sizes').then(m => m.labelSizesFixture)},
  {name: 'statelabel', load: () => import('./statelabel').then(m => m.statelabelFixture)},
  {
    name: 'statelabel-bound',
    load: () => import('./statelabel-bound').then(m => m.statelabelBoundFixture),
  },
  {
    name: 'statelabel-status',
    load: () => import('./statelabel-status').then(m => m.statelabelStatusFixture),
  },
  {
    name: 'statelabel-size',
    load: () => import('./statelabel-size').then(m => m.statelabelSizeFixture),
  },
  {name: 'counterlabel', load: () => import('./counterlabel').then(m => m.counterlabelFixture)},
  {
    name: 'counterlabel-bound',
    load: () => import('./counterlabel-bound').then(m => m.counterlabelBoundFixture),
  },
  {
    name: 'counterlabel-variants',
    load: () => import('./counterlabel-variants').then(m => m.counterlabelVariantsFixture),
  },
  {name: 'avatar', load: () => import('./avatar').then(m => m.avatarFixture)},
  {name: 'avatar-bound', load: () => import('./avatar-bound').then(m => m.avatarBoundFixture)},
  {name: 'avatar-sizes', load: () => import('./avatar-sizes').then(m => m.avatarSizesFixture)},
  {name: 'avatar-square', load: () => import('./avatar-square').then(m => m.avatarSquareFixture)},
  {name: 'spinner', load: () => import('./spinner').then(m => m.spinnerFixture)},
  {name: 'spinner-sizes', load: () => import('./spinner-sizes').then(m => m.spinnerSizesFixture)},
  {name: 'spinner-bound', load: () => import('./spinner-bound').then(m => m.spinnerBoundFixture)},
  {name: 'token', load: () => import('./token').then(m => m.tokenFixture)},
  {name: 'token-bound', load: () => import('./token-bound').then(m => m.tokenBoundFixture)},
  {
    name: 'token-leadingvisual',
    load: () => import('./token-leadingvisual').then(m => m.tokenLeadingvisualFixture),
  },
  {name: 'token-sizes', load: () => import('./token-sizes').then(m => m.tokenSizesFixture)},
  {
    name: 'token-selected',
    load: () => import('./token-selected').then(m => m.tokenSelectedFixture),
  },
  {
    name: 'token-disabled',
    load: () => import('./token-disabled').then(m => m.tokenDisabledFixture),
  },
  {
    name: 'token-remove-fn',
    load: () => import('./token-remove-fn').then(m => m.tokenRemoveFnFixture),
  },
  {
    name: 'token-remove-event',
    load: () => import('./token-remove-event').then(m => m.tokenRemoveEventFixture),
  },
  {
    name: 'token-hideremovebutton',
    load: () => import('./token-hideremovebutton').then(m => m.tokenHideremovebuttonFixture),
  },
  {
    name: 'issuelabeltoken',
    load: () => import('./issuelabeltoken').then(m => m.issuelabeltokenFixture),
  },
  {
    name: 'issuelabeltoken-bound',
    load: () => import('./issuelabeltoken-bound').then(m => m.issuelabeltokenBoundFixture),
  },
  {
    name: 'issuelabeltoken-fillcolor',
    load: () => import('./issuelabeltoken-fillcolor').then(m => m.issuelabeltokenFillcolorFixture),
  },
  {
    name: 'issuelabeltoken-sizes',
    load: () => import('./issuelabeltoken-sizes').then(m => m.issuelabeltokenSizesFixture),
  },
  {
    name: 'issuelabeltoken-selected',
    load: () => import('./issuelabeltoken-selected').then(m => m.issuelabeltokenSelectedFixture),
  },
  {
    name: 'issuelabeltoken-disabled',
    load: () => import('./issuelabeltoken-disabled').then(m => m.issuelabeltokenDisabledFixture),
  },
  {
    name: 'issuelabeltoken-remove-fn',
    load: () => import('./issuelabeltoken-remove-fn').then(m => m.issuelabeltokenRemoveFnFixture),
  },
  {
    name: 'issuelabeltoken-remove-event',
    load: () =>
      import('./issuelabeltoken-remove-event').then(m => m.issuelabeltokenRemoveEventFixture),
  },
  {
    name: 'issuelabeltoken-hideremovebutton',
    load: () =>
      import('./issuelabeltoken-hideremovebutton').then(
        m => m.issuelabeltokenHideremovebuttonFixture,
      ),
  },
  {name: 'checkbox', load: () => import('./checkbox').then(m => m.checkboxFixture)},
  {
    name: 'checkbox-checked',
    load: () => import('./checkbox-checked').then(m => m.checkboxCheckedFixture),
  },
  {
    name: 'checkbox-bound',
    load: () => import('./checkbox-bound').then(m => m.checkboxBoundFixture),
  },
  {
    name: 'checkbox-indeterminate',
    load: () => import('./checkbox-indeterminate').then(m => m.checkboxIndeterminateFixture),
  },
  {
    name: 'checkbox-disabled',
    load: () => import('./checkbox-disabled').then(m => m.checkboxDisabledFixture),
  },
  {name: 'progressbar', load: () => import('./progressbar').then(m => m.progressbarFixture)},
  {
    name: 'progressbar-bound',
    load: () => import('./progressbar-bound').then(m => m.progressbarBoundFixture),
  },
  {
    name: 'progressbar-segments',
    load: () => import('./progressbar-segments').then(m => m.progressbarSegmentsFixture),
  },
  {
    name: 'progressbar-segments-bound',
    load: () => import('./progressbar-segments-bound').then(m => m.progressbarSegmentsBoundFixture),
  },
  {
    name: 'progressbar-bg',
    load: () => import('./progressbar-bg').then(m => m.progressbarBgFixture),
  },
  {
    name: 'progressbar-sizes',
    load: () => import('./progressbar-sizes').then(m => m.progressbarSizesFixture),
  },
  {name: 'radio', load: () => import('./radio').then(m => m.radioFixture)},
  {name: 'radio-checked', load: () => import('./radio-checked').then(m => m.radioCheckedFixture)},
  {
    name: 'radio-disabled',
    load: () => import('./radio-disabled').then(m => m.radioDisabledFixture),
  },
  {name: 'radio-fn', load: () => import('./radio-fn').then(m => m.radioFnFixture)},
  {name: 'radio-event', load: () => import('./radio-event').then(m => m.radioEventFixture)},
  {name: 'toggleswitch', load: () => import('./toggleswitch').then(m => m.toggleswitchFixture)},
  {
    name: 'toggleswitch-checked',
    load: () => import('./toggleswitch-checked').then(m => m.toggleswitchCheckedFixture),
  },
  {
    name: 'toggleswitch-bound',
    load: () => import('./toggleswitch-bound').then(m => m.toggleswitchBoundFixture),
  },
  {
    name: 'toggleswitch-fn',
    load: () => import('./toggleswitch-fn').then(m => m.toggleswitchFnFixture),
  },
  {
    name: 'toggleswitch-event',
    load: () => import('./toggleswitch-event').then(m => m.toggleswitchEventFixture),
  },
  {
    name: 'toggleswitch-disabled',
    load: () => import('./toggleswitch-disabled').then(m => m.toggleswitchDisabledFixture),
  },
  {
    name: 'toggleswitch-loading',
    load: () => import('./toggleswitch-loading').then(m => m.toggleswitchLoadingFixture),
  },
  {
    name: 'toggleswitch-sizes',
    load: () => import('./toggleswitch-sizes').then(m => m.toggleswitchSizesFixture),
  },
  {
    name: 'toggleswitch-label-position',
    load: () =>
      import('./toggleswitch-label-position').then(m => m.toggleswitchLabelPositionFixture),
  },
  {
    name: 'toggleswitch-custom-labels',
    load: () => import('./toggleswitch-custom-labels').then(m => m.toggleswitchCustomLabelsFixture),
  },
  {name: 'textarea', load: () => import('./textarea').then(m => m.textareaFixture)},
  {
    name: 'textarea-bound',
    load: () => import('./textarea-bound').then(m => m.textareaBoundFixture),
  },
  {
    name: 'textarea-placeholder',
    load: () => import('./textarea-placeholder').then(m => m.textareaPlaceholderFixture),
  },
  {
    name: 'textarea-disabled',
    load: () => import('./textarea-disabled').then(m => m.textareaDisabledFixture),
  },
  {
    name: 'textarea-validation',
    load: () => import('./textarea-validation').then(m => m.textareaValidationFixture),
  },
  {
    name: 'textarea-block',
    load: () => import('./textarea-block').then(m => m.textareaBlockFixture),
  },
  {
    name: 'textarea-contrast',
    load: () => import('./textarea-contrast').then(m => m.textareaContrastFixture),
  },
  {name: 'textarea-rows', load: () => import('./textarea-rows').then(m => m.textareaRowsFixture)},
  {name: 'textarea-cols', load: () => import('./textarea-cols').then(m => m.textareaColsFixture)},
  {
    name: 'textarea-character-limit',
    load: () => import('./textarea-character-limit').then(m => m.textareaCharacterLimitFixture),
  },
  {
    name: 'textarea-min-height',
    load: () => import('./textarea-min-height').then(m => m.textareaMinHeightFixture),
  },
  {name: 'textinput', load: () => import('./textinput').then(m => m.textinputFixture)},
  {
    name: 'textinput-bound',
    load: () => import('./textinput-bound').then(m => m.textinputBoundFixture),
  },
  {
    name: 'textinput-placeholder',
    load: () => import('./textinput-placeholder').then(m => m.textinputPlaceholderFixture),
  },
  {
    name: 'textinput-disabled',
    load: () => import('./textinput-disabled').then(m => m.textinputDisabledFixture),
  },
  {
    name: 'textinput-validation',
    load: () => import('./textinput-validation').then(m => m.textinputValidationFixture),
  },
  {
    name: 'textinput-type',
    load: () => import('./textinput-type').then(m => m.textinputTypeFixture),
  },
  {
    name: 'textinput-loading',
    load: () => import('./textinput-loading').then(m => m.textinputLoadingFixture),
  },
  {
    name: 'textinput-leading-visual',
    load: () => import('./textinput-leading-visual').then(m => m.textinputLeadingVisualFixture),
  },
  {
    name: 'textinput-trailing-visual',
    load: () => import('./textinput-trailing-visual').then(m => m.textinputTrailingVisualFixture),
  },
  {
    name: 'textinput-trailing-action',
    load: () => import('./textinput-trailing-action').then(m => m.textinputTrailingActionFixture),
  },
  {
    name: 'textinput-size',
    load: () => import('./textinput-size').then(m => m.textinputSizeFixture),
  },
  {
    name: 'textinput-block',
    load: () => import('./textinput-block').then(m => m.textinputBlockFixture),
  },
  {
    name: 'textinput-contrast',
    load: () => import('./textinput-contrast').then(m => m.textinputContrastFixture),
  },
  {
    name: 'textinput-monospace',
    load: () => import('./textinput-monospace').then(m => m.textinputMonospaceFixture),
  },
  {
    name: 'textinput-character-limit',
    load: () => import('./textinput-character-limit').then(m => m.textinputCharacterLimitFixture),
  },
  {
    name: 'textinput-action-fn',
    load: () => import('./textinput-action-fn').then(m => m.textinputActionFnFixture),
  },
  {
    name: 'textinput-action-event',
    load: () => import('./textinput-action-event').then(m => m.textinputActionEventFixture),
  },
  {
    name: 'textinput-action-disabled',
    load: () => import('./textinput-action-disabled').then(m => m.textinputActionDisabledFixture),
  },
  {
    name: 'textinput-action-tooltip',
    load: () => import('./textinput-action-tooltip').then(m => m.textinputActionTooltipFixture),
  },
  {name: 'skeletonbox', load: () => import('./skeletonbox').then(m => m.skeletonboxFixture)},
  {
    name: 'skeletonbox-sized',
    load: () => import('./skeletonbox-sized').then(m => m.skeletonboxSizedFixture),
  },
  {name: 'truncate', load: () => import('./truncate').then(m => m.truncateFixture)},
  {
    name: 'truncate-bound',
    load: () => import('./truncate-bound').then(m => m.truncateBoundFixture),
  },
  {
    name: 'truncate-maxwidth',
    load: () => import('./truncate-maxwidth').then(m => m.truncateMaxwidthFixture),
  },
  {name: 'truncate-as', load: () => import('./truncate-as').then(m => m.truncateAsFixture)},
  {
    name: 'keybindinghint',
    load: () => import('./keybindinghint').then(m => m.keybindinghintFixture),
  },
  {
    name: 'keybindinghint-bound',
    load: () => import('./keybindinghint-bound').then(m => m.keybindinghintBoundFixture),
  },
  {
    name: 'keybindinghint-formats',
    load: () => import('./keybindinghint-formats').then(m => m.keybindinghintFormatsFixture),
  },
  {
    name: 'keybindinghint-variants',
    load: () => import('./keybindinghint-variants').then(m => m.keybindinghintVariantsFixture),
  },
  {
    name: 'keybindinghint-sizes',
    load: () => import('./keybindinghint-sizes').then(m => m.keybindinghintSizesFixture),
  },
  {name: 'stack', load: () => import('./stack').then(m => m.stackFixture)},
  {
    name: 'stack-children-template',
    load: () => import('./stack-children-template').then(m => m.stackChildrenTemplateFixture),
  },
  {
    name: 'stack-direction',
    load: () => import('./stack-direction').then(m => m.stackDirectionFixture),
  },
  {name: 'stack-gap', load: () => import('./stack-gap').then(m => m.stackGapFixture)},
  {name: 'stack-align', load: () => import('./stack-align').then(m => m.stackAlignFixture)},
  {name: 'stack-justify', load: () => import('./stack-justify').then(m => m.stackJustifyFixture)},
  {name: 'stack-wrap', load: () => import('./stack-wrap').then(m => m.stackWrapFixture)},
  {name: 'stack-padding', load: () => import('./stack-padding').then(m => m.stackPaddingFixture)},
  {
    name: 'stack-paddingblock',
    load: () => import('./stack-paddingblock').then(m => m.stackPaddingblockFixture),
  },
  {
    name: 'stack-paddinginline',
    load: () => import('./stack-paddinginline').then(m => m.stackPaddinginlineFixture),
  },
  {
    name: 'stack-responsive',
    load: () => import('./stack-responsive').then(m => m.stackResponsiveFixture),
  },
  {name: 'stackitem', load: () => import('./stackitem').then(m => m.stackitemFixture)},
  {
    name: 'stackitem-grow',
    load: () => import('./stackitem-grow').then(m => m.stackitemGrowFixture),
  },
  {
    name: 'stackitem-shrink',
    load: () => import('./stackitem-shrink').then(m => m.stackitemShrinkFixture),
  },
  {name: 'label-group', load: () => import('./label-group').then(m => m.labelGroupFixture)},
  {
    name: 'label-group-children-template',
    load: () =>
      import('./label-group-children-template').then(m => m.labelGroupChildrenTemplateFixture),
  },
  {
    name: 'label-group-truncated',
    load: () => import('./label-group-truncated').then(m => m.labelGroupTruncatedFixture),
  },
  {name: 'avatarstack', load: () => import('./avatarstack').then(m => m.avatarstackFixture)},
  {
    name: 'avatarstack-children-template',
    load: () =>
      import('./avatarstack-children-template').then(m => m.avatarstackChildrenTemplateFixture),
  },
  {
    name: 'avatarstack-alignright',
    load: () => import('./avatarstack-alignright').then(m => m.avatarstackAlignrightFixture),
  },
  {
    name: 'avatarstack-variant',
    load: () => import('./avatarstack-variant').then(m => m.avatarstackVariantFixture),
  },
  {
    name: 'avatarstack-shape',
    load: () => import('./avatarstack-shape').then(m => m.avatarstackShapeFixture),
  },
  {
    name: 'avatarstack-size',
    load: () => import('./avatarstack-size').then(m => m.avatarstackSizeFixture),
  },
  {
    name: 'avatarstack-size-responsive',
    load: () =>
      import('./avatarstack-size-responsive').then(m => m.avatarstackSizeResponsiveFixture),
  },
  {
    name: 'avatarstack-disableexpand',
    load: () => import('./avatarstack-disableexpand').then(m => m.avatarstackDisableexpandFixture),
  },
  {name: 'button-group', load: () => import('./button-group').then(m => m.buttonGroupFixture)},
  {
    name: 'button-group-children-template',
    load: () =>
      import('./button-group-children-template').then(m => m.buttonGroupChildrenTemplateFixture),
  },
  {name: 'pagination', load: () => import('./pagination').then(m => m.paginationFixture)},
  {
    name: 'pagination-large',
    load: () => import('./pagination-large').then(m => m.paginationLargeFixture),
  },
  {
    name: 'pagination-first',
    load: () => import('./pagination-first').then(m => m.paginationFirstFixture),
  },
  {
    name: 'pagination-last',
    load: () => import('./pagination-last').then(m => m.paginationLastFixture),
  },
  {
    name: 'pagination-no-pages',
    load: () => import('./pagination-no-pages').then(m => m.paginationNoPagesFixture),
  },
  {
    name: 'pagination-margin',
    load: () => import('./pagination-margin').then(m => m.paginationMarginFixture),
  },
  {
    name: 'pagination-surrounding',
    load: () => import('./pagination-surrounding').then(m => m.paginationSurroundingFixture),
  },
  {
    name: 'pagination-controlled',
    load: () => import('./pagination-controlled').then(m => m.paginationControlledFixture),
  },
  {
    name: 'pagination-href',
    load: () => import('./pagination-href').then(m => m.paginationHrefFixture),
  },
  {
    name: 'pagination-accessibility',
    load: () => import('./pagination-accessibility').then(m => m.paginationAccessibilityFixture),
  },
  {
    name: 'segmentedcontrol',
    load: () => import('./segmentedcontrol').then(m => m.segmentedcontrolFixture),
  },
  {
    name: 'segmentedcontrol-children-template',
    load: () =>
      import('./segmentedcontrol-children-template').then(
        m => m.segmentedcontrolChildrenTemplateFixture,
      ),
  },
  {
    name: 'segmentedcontrol-selected',
    load: () => import('./segmentedcontrol-selected').then(m => m.segmentedcontrolSelectedFixture),
  },
  {
    name: 'segmentedcontrol-bound',
    load: () => import('./segmentedcontrol-bound').then(m => m.segmentedcontrolBoundFixture),
  },
  {
    name: 'segmentedcontrol-fn',
    load: () => import('./segmentedcontrol-fn').then(m => m.segmentedcontrolFnFixture),
  },
  {
    name: 'segmentedcontrol-event',
    load: () => import('./segmentedcontrol-event').then(m => m.segmentedcontrolEventFixture),
  },
  {
    name: 'segmentedcontrol-fullwidth',
    load: () =>
      import('./segmentedcontrol-fullwidth').then(m => m.segmentedcontrolFullwidthFixture),
  },
  {
    name: 'segmentedcontrol-size',
    load: () => import('./segmentedcontrol-size').then(m => m.segmentedcontrolSizeFixture),
  },
  {
    name: 'segmentedcontrol-variant',
    load: () => import('./segmentedcontrol-variant').then(m => m.segmentedcontrolVariantFixture),
  },
  {
    name: 'segmentedcontrolbutton',
    load: () => import('./segmentedcontrolbutton').then(m => m.segmentedcontrolbuttonFixture),
  },
  {
    name: 'segmentedcontrolbutton-leadingvisual',
    load: () =>
      import('./segmentedcontrolbutton-leadingvisual').then(
        m => m.segmentedcontrolbuttonLeadingvisualFixture,
      ),
  },
  {
    name: 'segmentedcontrolbutton-count',
    load: () =>
      import('./segmentedcontrolbutton-count').then(m => m.segmentedcontrolbuttonCountFixture),
  },
  {
    name: 'segmentedcontrolbutton-disabled',
    load: () =>
      import('./segmentedcontrolbutton-disabled').then(
        m => m.segmentedcontrolbuttonDisabledFixture,
      ),
  },
  {
    name: 'segmentedcontroliconbutton',
    load: () =>
      import('./segmentedcontroliconbutton').then(m => m.segmentedcontroliconbuttonFixture),
  },
  {
    name: 'segmentedcontroliconbutton-disabled',
    load: () =>
      import('./segmentedcontroliconbutton-disabled').then(
        m => m.segmentedcontroliconbuttonDisabledFixture,
      ),
  },
  {name: 'details-open', load: () => import('./details-open').then(m => m.detailsOpenFixture)},
  {
    name: 'details-children-template',
    load: () => import('./details-children-template').then(m => m.detailsChildrenTemplateFixture),
  },
  {
    name: 'details-clickoutside-fn',
    load: () => import('./details-clickoutside-fn').then(m => m.detailsClickoutsideFnFixture),
  },
  {name: 'details-bound', load: () => import('./details-bound').then(m => m.detailsBoundFixture)},
  {name: 'select', load: () => import('./select').then(m => m.selectFixture)},
  {
    name: 'select-children-template',
    load: () => import('./select-children-template').then(m => m.selectChildrenTemplateFixture),
  },
  {name: 'select-bound', load: () => import('./select-bound').then(m => m.selectBoundFixture)},
  {
    name: 'select-placeholder',
    load: () => import('./select-placeholder').then(m => m.selectPlaceholderFixture),
  },
  {
    name: 'select-disabled',
    load: () => import('./select-disabled').then(m => m.selectDisabledFixture),
  },
  {
    name: 'select-validation',
    load: () => import('./select-validation').then(m => m.selectValidationFixture),
  },
  {name: 'select-block', load: () => import('./select-block').then(m => m.selectBlockFixture)},
  {name: 'select-size', load: () => import('./select-size').then(m => m.selectSizeFixture)},
  {name: 'selectoption', load: () => import('./selectoption').then(m => m.selectoptionFixture)},
  {
    name: 'selectoption-disabled',
    load: () => import('./selectoption-disabled').then(m => m.selectoptionDisabledFixture),
  },
  {
    name: 'selectoptgroup',
    load: () => import('./selectoptgroup').then(m => m.selectoptgroupFixture),
  },
  {
    name: 'selectoptgroup-disabled',
    load: () => import('./selectoptgroup-disabled').then(m => m.selectoptgroupDisabledFixture),
  },
  {name: 'breadcrumbs', load: () => import('./breadcrumbs').then(m => m.breadcrumbsFixture)},
  {
    name: 'breadcrumbs-children-template',
    load: () =>
      import('./breadcrumbs-children-template').then(m => m.breadcrumbsChildrenTemplateFixture),
  },
  {
    name: 'breadcrumbs-variant',
    load: () => import('./breadcrumbs-variant').then(m => m.breadcrumbsVariantFixture),
  },
  {
    name: 'breadcrumbsitem',
    load: () => import('./breadcrumbsitem').then(m => m.breadcrumbsitemFixture),
  },
  {
    name: 'breadcrumbsitem-selected',
    load: () => import('./breadcrumbsitem-selected').then(m => m.breadcrumbsitemSelectedFixture),
  },
  {name: 'navlist', load: () => import('./navlist').then(m => m.navlistFixture)},
  {
    name: 'navlist-item-inactive',
    load: () => import('./navlist-item-inactive').then(m => m.navlistItemInactiveFixture),
  },
  {
    name: 'navlist-trailingaction-fn',
    load: () => import('./navlist-trailingaction-fn').then(m => m.navlistTrailingactionFnFixture),
  },
  {
    name: 'navlist-trailingaction-event',
    load: () =>
      import('./navlist-trailingaction-event').then(m => m.navlistTrailingactionEventFixture),
  },
  {
    name: 'navlist-trailingaction-loading',
    load: () =>
      import('./navlist-trailingaction-loading').then(m => m.navlistTrailingactionLoadingFixture),
  },
  {
    name: 'navlist-group-bound',
    load: () => import('./navlist-group-bound').then(m => m.navlistGroupBoundFixture),
  },
  {
    name: 'navlist-groupheading-variants',
    load: () =>
      import('./navlist-groupheading-variants').then(m => m.navlistGroupheadingVariantsFixture),
  },
  {
    name: 'navlist-groupheading-bound',
    load: () => import('./navlist-groupheading-bound').then(m => m.navlistGroupheadingBoundFixture),
  },
  {
    name: 'navlist-description-variants',
    load: () =>
      import('./navlist-description-variants').then(m => m.navlistDescriptionVariantsFixture),
  },
  {
    name: 'navlist-description-truncate',
    load: () =>
      import('./navlist-description-truncate').then(m => m.navlistDescriptionTruncateFixture),
  },
  {
    name: 'navlist-groupexpand',
    load: () => import('./navlist-groupexpand').then(m => m.navlistGroupexpandFixture),
  },
  {
    name: 'navlist-groupexpand-showmore',
    load: () => import('./navlist-groupexpand').then(m => m.navlistGroupexpandShowmoreFixture),
  },
  {name: 'pagelayout', load: () => import('./pagelayout').then(m => m.pagelayoutFixture)},
  {
    name: 'pagelayout-sidebar',
    load: () => import('./pagelayout-sidebar').then(m => m.pagelayoutSidebarFixture),
  },
  {
    name: 'pagelayout-containerwidth',
    load: () => import('./pagelayout-containerwidth').then(m => m.pagelayoutContainerwidthFixture),
  },
  {
    name: 'pagelayout-padding',
    load: () => import('./pagelayout-padding').then(m => m.pagelayoutPaddingFixture),
  },
  {
    name: 'pagelayout-rowgap',
    load: () => import('./pagelayout-rowgap').then(m => m.pagelayoutRowgapFixture),
  },
  {
    name: 'pagelayout-columngap',
    load: () => import('./pagelayout-columngap').then(m => m.pagelayoutColumngapFixture),
  },
  {
    name: 'pagelayout-header-padding',
    load: () => import('./pagelayout-header-padding').then(m => m.pagelayoutHeaderPaddingFixture),
  },
  {
    name: 'pagelayout-header-divider',
    load: () => import('./pagelayout-header-divider').then(m => m.pagelayoutHeaderDividerFixture),
  },
  {
    name: 'pagelayout-footer-padding',
    load: () => import('./pagelayout-footer-padding').then(m => m.pagelayoutFooterPaddingFixture),
  },
  {
    name: 'pagelayout-footer-divider',
    load: () => import('./pagelayout-footer-divider').then(m => m.pagelayoutFooterDividerFixture),
  },
  {
    name: 'pagelayout-content-width',
    load: () => import('./pagelayout-content-width').then(m => m.pagelayoutContentWidthFixture),
  },
  {
    name: 'pagelayout-content-padding',
    load: () => import('./pagelayout-content-padding').then(m => m.pagelayoutContentPaddingFixture),
  },
  {
    name: 'pagelayout-content-template',
    load: () =>
      import('./pagelayout-content-template').then(m => m.pagelayoutContentTemplateFixture),
  },
  {
    name: 'pagelayout-pane-position',
    load: () => import('./pagelayout-pane-position').then(m => m.pagelayoutPanePositionFixture),
  },
  {
    name: 'pagelayout-pane-width',
    load: () => import('./pagelayout-pane-width').then(m => m.pagelayoutPaneWidthFixture),
  },
  {
    name: 'pagelayout-pane-width-custom',
    load: () =>
      import('./pagelayout-pane-width-custom').then(m => m.pagelayoutPaneWidthCustomFixture),
  },
  {
    name: 'pagelayout-pane-divider',
    load: () => import('./pagelayout-pane-divider').then(m => m.pagelayoutPaneDividerFixture),
  },
  {
    name: 'pagelayout-pane-resizable',
    load: () => import('./pagelayout-pane-resizable').then(m => m.pagelayoutPaneResizableFixture),
  },
  {
    name: 'pagelayout-pane-padding',
    load: () => import('./pagelayout-pane-padding').then(m => m.pagelayoutPanePaddingFixture),
  },
  {
    name: 'pagelayout-pane-currentwidth',
    load: () =>
      import('./pagelayout-pane-currentwidth').then(m => m.pagelayoutPaneCurrentwidthFixture),
  },
  {
    name: 'pagelayout-sidebar-position',
    load: () =>
      import('./pagelayout-sidebar-position').then(m => m.pagelayoutSidebarPositionFixture),
  },
  {
    name: 'pagelayout-sidebar-width',
    load: () => import('./pagelayout-sidebar-width').then(m => m.pagelayoutSidebarWidthFixture),
  },
  {
    name: 'pagelayout-sidebar-width-custom',
    load: () =>
      import('./pagelayout-sidebar-width-custom').then(m => m.pagelayoutSidebarWidthCustomFixture),
  },
  {
    name: 'pagelayout-sidebar-divider',
    load: () => import('./pagelayout-sidebar-divider').then(m => m.pagelayoutSidebarDividerFixture),
  },
  {
    name: 'pagelayout-sidebar-resizable',
    load: () =>
      import('./pagelayout-sidebar-resizable').then(m => m.pagelayoutSidebarResizableFixture),
  },
  {
    name: 'pagelayout-sidebar-padding',
    load: () => import('./pagelayout-sidebar-padding').then(m => m.pagelayoutSidebarPaddingFixture),
  },
  {
    name: 'pagelayout-sidebar-currentwidth',
    load: () =>
      import('./pagelayout-sidebar-currentwidth').then(m => m.pagelayoutSidebarCurrentwidthFixture),
  },
  {
    name: 'split-page-layout',
    load: () => import('./split-page-layout').then(m => m.splitPageLayoutFixture),
  },
  {
    name: 'split-page-layout-sidebar',
    load: () => import('./split-page-layout-sidebar').then(m => m.splitPageLayoutSidebarFixture),
  },
  {
    name: 'spl-header-divider',
    load: () => import('./spl-header-divider').then(m => m.splHeaderDividerFixture),
  },
  {
    name: 'spl-content-width',
    load: () => import('./spl-content-width').then(m => m.splContentWidthFixture),
  },
  {
    name: 'spl-content-padding',
    load: () => import('./spl-content-padding').then(m => m.splContentPaddingFixture),
  },
  {
    name: 'spl-content-children-template',
    load: () =>
      import('./spl-content-children-template').then(m => m.splContentChildrenTemplateFixture),
  },
  {
    name: 'spl-pane-position',
    load: () => import('./spl-pane-position').then(m => m.splPanePositionFixture),
  },
  {name: 'spl-pane-width', load: () => import('./spl-pane-width').then(m => m.splPaneWidthFixture)},
  {
    name: 'spl-pane-divider',
    load: () => import('./spl-pane-divider').then(m => m.splPaneDividerFixture),
  },
  {
    name: 'spl-pane-resizable',
    load: () => import('./spl-pane-resizable').then(m => m.splPaneResizableFixture),
  },
  {name: 'pageheader', load: () => import('./pageheader').then(m => m.pageheaderFixture)},
  {
    name: 'pageheader-hasborder',
    load: () => import('./pageheader-hasborder').then(m => m.pageheaderHasborderFixture),
  },
  {name: 'parentlink', load: () => import('./parentlink').then(m => m.parentlinkFixture)},
  {
    name: 'parentlink-bound',
    load: () => import('./parentlink-bound').then(m => m.parentlinkBoundFixture),
  },
  {name: 'title', load: () => import('./title').then(m => m.titleFixture)},
  {name: 'title-bound', load: () => import('./title-bound').then(m => m.titleBoundFixture)},
  {
    name: 'titlearea-variant',
    load: () => import('./titlearea-variant').then(m => m.titleareaVariantFixture),
  },
  {
    name: 'breadcrumbs-template',
    load: () => import('./breadcrumbs-template').then(m => m.breadcrumbsTemplateFixture),
  },
  {name: 'actionlist', load: () => import('./actionlist').then(m => m.actionlistFixture)},
  {
    name: 'actionlist-children-template',
    load: () =>
      import('./actionlist-children-template').then(m => m.actionlistChildrenTemplateFixture),
  },
  {
    name: 'actionlist-selection',
    load: () => import('./actionlist-selection').then(m => m.actionlistSelectionFixture),
  },
  {
    name: 'actionlist-selected-bound',
    load: () => import('./actionlist-selected-bound').then(m => m.actionlistSelectedBoundFixture),
  },
  {
    name: 'actionlist-item-fn',
    load: () => import('./actionlist-item-fn').then(m => m.actionlistItemFnFixture),
  },
  {
    name: 'actionlist-item-event',
    load: () => import('./actionlist-item-event').then(m => m.actionlistItemEventFixture),
  },
  {
    name: 'actionlist-item-active',
    load: () => import('./actionlist-item-active').then(m => m.actionlistItemActiveFixture),
  },
  {
    name: 'actionlist-item-disabled',
    load: () => import('./actionlist-item-disabled').then(m => m.actionlistItemDisabledFixture),
  },
  {
    name: 'actionlist-item-loading',
    load: () => import('./actionlist-item-loading').then(m => m.actionlistItemLoadingFixture),
  },
  {
    name: 'actionlist-item-inactive',
    load: () => import('./actionlist-item-inactive').then(m => m.actionlistItemInactiveFixture),
  },
  {
    name: 'actionlist-item-variant',
    load: () => import('./actionlist-item-variant').then(m => m.actionlistItemVariantFixture),
  },
  {
    name: 'actionlist-item-size',
    load: () => import('./actionlist-item-size').then(m => m.actionlistItemSizeFixture),
  },
  {
    name: 'actionlist-variant',
    load: () => import('./actionlist-variant').then(m => m.actionlistVariantFixture),
  },
  {
    name: 'actionlist-dividers',
    load: () => import('./actionlist-dividers').then(m => m.actionlistDividersFixture),
  },
  {
    name: 'actionlist-group-variant',
    load: () => import('./actionlist-group-variant').then(m => m.actionlistGroupVariantFixture),
  },
  {
    name: 'actionlist-description',
    load: () => import('./actionlist-description').then(m => m.actionlistDescriptionFixture),
  },
  {
    name: 'actionlist-trailingaction-fn',
    load: () =>
      import('./actionlist-trailingaction-fn').then(m => m.actionlistTrailingactionFnFixture),
  },
  {
    name: 'actionlist-trailingaction-event',
    load: () =>
      import('./actionlist-trailingaction-event').then(m => m.actionlistTrailingactionEventFixture),
  },
  {
    name: 'actionlist-trailingaction-loading',
    load: () =>
      import('./actionlist-trailingaction-loading').then(
        m => m.actionlistTrailingactionLoadingFixture,
      ),
  },
  {name: 'action-bar', load: () => import('./action-bar').then(m => m.actionBarFixture)},
  {
    name: 'action-bar-children-template',
    load: () =>
      import('./action-bar-children-template').then(m => m.actionBarChildrenTemplateFixture),
  },
  {
    name: 'action-bar-sizes',
    load: () => import('./action-bar-sizes').then(m => m.actionBarSizesFixture),
  },
  {name: 'action-bar-gap', load: () => import('./action-bar-gap').then(m => m.actionBarGapFixture)},
  {
    name: 'action-bar-flush',
    load: () => import('./action-bar-flush').then(m => m.actionBarFlushFixture),
  },
  {
    name: 'action-bar-overflow',
    load: () => import('./action-bar-overflow').then(m => m.actionBarOverflowFixture),
  },
  {
    name: 'action-bar-icon-button-fn',
    load: () => import('./action-bar-icon-button-fn').then(m => m.actionBarIconButtonFnFixture),
  },
  {
    name: 'action-bar-icon-button-event',
    load: () =>
      import('./action-bar-icon-button-event').then(m => m.actionBarIconButtonEventFixture),
  },
  {
    name: 'action-bar-icon-button-disabled',
    load: () =>
      import('./action-bar-icon-button-disabled').then(m => m.actionBarIconButtonDisabledFixture),
  },
  {
    name: 'action-bar-group',
    load: () => import('./action-bar-group').then(m => m.actionBarGroupFixture),
  },
  {
    name: 'action-bar-menu',
    load: () => import('./action-bar-menu').then(m => m.actionBarMenuFixture),
  },
  {
    name: 'tree-view-nested',
    load: () => import('./tree-view-nested').then(m => m.treeViewNestedFixture),
  },
  {name: 'tree-view-flat', load: () => import('./tree-view-flat').then(m => m.treeViewFlatFixture)},
  {
    name: 'tree-view-truncate',
    load: () => import('./tree-view-truncate').then(m => m.treeViewTruncateFixture),
  },
  {
    name: 'tree-view-item-current',
    load: () => import('./tree-view-item-current').then(m => m.treeViewItemCurrentFixture),
  },
  {
    name: 'tree-view-item-expanded-bound',
    load: () =>
      import('./tree-view-item-expanded-bound').then(m => m.treeViewItemExpandedBoundFixture),
  },
  {
    name: 'tree-view-item-fn',
    load: () => import('./tree-view-item-fn').then(m => m.treeViewItemFnFixture),
  },
  {
    name: 'tree-view-item-event',
    load: () => import('./tree-view-item-event').then(m => m.treeViewItemEventFixture),
  },
  {
    name: 'tree-view-item-secondary-actions',
    load: () =>
      import('./tree-view-item-secondary-actions').then(m => m.treeViewItemSecondaryActionsFixture),
  },
  {
    name: 'tree-view-subtree-states',
    load: () => import('./tree-view-subtree-states').then(m => m.treeViewSubtreeStatesFixture),
  },
  {
    name: 'tree-view-visuals',
    load: () => import('./tree-view-visuals').then(m => m.treeViewVisualsFixture),
  },
  {
    name: 'tree-view-directory-icon',
    load: () => import('./tree-view-directory-icon').then(m => m.treeViewDirectoryIconFixture),
  },
  {
    name: 'tree-view-error-dialog',
    load: () => import('./tree-view-error-dialog').then(m => m.treeViewErrorDialogFixture),
  },
  {name: 'underline-nav', load: () => import('./underline-nav').then(m => m.underlineNavFixture)},
  {
    name: 'underline-nav-children-template',
    load: () =>
      import('./underline-nav-children-template').then(m => m.underlineNavChildrenTemplateFixture),
  },
  {
    name: 'underline-nav-variant',
    load: () => import('./underline-nav-variant').then(m => m.underlineNavVariantFixture),
  },
  {
    name: 'underline-nav-loading',
    load: () => import('./underline-nav-loading').then(m => m.underlineNavLoadingFixture),
  },
  {
    name: 'underline-nav-item-fn',
    load: () => import('./underline-nav-item-fn').then(m => m.underlineNavItemFnFixture),
  },
  {
    name: 'underline-nav-item-event',
    load: () => import('./underline-nav-item-event').then(m => m.underlineNavItemEventFixture),
  },
  {
    name: 'timeline-default',
    load: () => import('./timeline-default').then(m => m.timelineDefaultFixture),
  },
  {
    name: 'timeline-clip-sidebar',
    load: () => import('./timeline-clip-sidebar').then(m => m.timelineClipSidebarFixture),
  },
  {
    name: 'timeline-item-condensed',
    load: () => import('./timeline-item-condensed').then(m => m.timelineItemCondensedFixture),
  },
  {
    name: 'timeline-badge-variants',
    load: () => import('./timeline-badge-variants').then(m => m.timelineBadgeVariantsFixture),
  },
  {
    name: 'timeline-break',
    load: () => import('./timeline-break').then(m => m.timelineBreakFixture),
  },
  {
    name: 'timeline-actions',
    load: () => import('./timeline-actions').then(m => m.timelineActionsFixture),
  },
  {
    name: 'timeline-avatar',
    load: () => import('./timeline-avatar').then(m => m.timelineAvatarFixture),
  },
  {name: 'dialog', load: () => import('./dialog').then(m => m.dialogFixture)},
  {name: 'dialog-bound', load: () => import('./dialog-bound').then(m => m.dialogBoundFixture)},
  {
    name: 'dialog-close-fn',
    load: () => import('./dialog-close-fn').then(m => m.dialogCloseFnFixture),
  },
  {
    name: 'dialog-close-event',
    load: () => import('./dialog-close-event').then(m => m.dialogCloseEventFixture),
  },
  {
    name: 'dialog-buttons',
    load: () => import('./dialog-buttons').then(m => m.dialogButtonsFixture),
  },
  {
    name: 'dialog-button-states',
    load: () => import('./dialog-button-states').then(m => m.dialogButtonStatesFixture),
  },
  {
    name: 'dialog-width-small',
    load: () => import('./dialog-width-small').then(m => m.dialogWidthSmallFixture),
  },
  {
    name: 'dialog-width-medium',
    load: () => import('./dialog-width-medium').then(m => m.dialogWidthMediumFixture),
  },
  {
    name: 'dialog-width-large',
    load: () => import('./dialog-width-large').then(m => m.dialogWidthLargeFixture),
  },
  {
    name: 'dialog-width-custom',
    load: () => import('./dialog-width-custom').then(m => m.dialogWidthCustomFixture),
  },
  {
    name: 'dialog-height-small',
    load: () => import('./dialog-height-small').then(m => m.dialogHeightSmallFixture),
  },
  {
    name: 'dialog-height-large',
    load: () => import('./dialog-height-large').then(m => m.dialogHeightLargeFixture),
  },
  {
    name: 'dialog-position-left',
    load: () => import('./dialog-position-left').then(m => m.dialogPositionLeftFixture),
  },
  {
    name: 'dialog-position-right',
    load: () => import('./dialog-position-right').then(m => m.dialogPositionRightFixture),
  },
  {
    name: 'dialog-align-top',
    load: () => import('./dialog-align-top').then(m => m.dialogAlignTopFixture),
  },
  {
    name: 'dialog-align-bottom',
    load: () => import('./dialog-align-bottom').then(m => m.dialogAlignBottomFixture),
  },
  {name: 'dialog-slots', load: () => import('./dialog-slots').then(m => m.dialogSlotsFixture)},
  {
    name: 'confirmation-dialog',
    load: () => import('./confirmation-dialog').then(m => m.confirmationDialogFixture),
  },
  {
    name: 'confirmation-dialog-bound',
    load: () => import('./confirmation-dialog-bound').then(m => m.confirmationDialogBoundFixture),
  },
  {
    name: 'confirmation-dialog-event',
    load: () => import('./confirmation-dialog-event').then(m => m.confirmationDialogEventFixture),
  },
  {
    name: 'confirmation-dialog-confirm-primary',
    load: () =>
      import('./confirmation-dialog-confirm-primary').then(
        m => m.confirmationDialogConfirmPrimaryFixture,
      ),
  },
  {
    name: 'confirmation-dialog-confirm-danger',
    load: () =>
      import('./confirmation-dialog-confirm-danger').then(
        m => m.confirmationDialogConfirmDangerFixture,
      ),
  },
  {
    name: 'confirmation-dialog-loading',
    load: () =>
      import('./confirmation-dialog-loading').then(m => m.confirmationDialogLoadingFixture),
  },
  {
    name: 'confirmation-dialog-width-small',
    load: () =>
      import('./confirmation-dialog-width-small').then(m => m.confirmationDialogWidthSmallFixture),
  },
  {
    name: 'confirmation-dialog-width-large',
    load: () =>
      import('./confirmation-dialog-width-large').then(m => m.confirmationDialogWidthLargeFixture),
  },
  {
    name: 'confirmation-dialog-width-xlarge',
    load: () =>
      import('./confirmation-dialog-width-xlarge').then(
        m => m.confirmationDialogWidthXlargeFixture,
      ),
  },
  {
    name: 'confirmation-dialog-width-custom',
    load: () =>
      import('./confirmation-dialog-width-custom').then(
        m => m.confirmationDialogWidthCustomFixture,
      ),
  },
  {
    name: 'confirmation-dialog-height-small',
    load: () =>
      import('./confirmation-dialog-height-small').then(
        m => m.confirmationDialogHeightSmallFixture,
      ),
  },
  {
    name: 'confirmation-dialog-height-large',
    load: () =>
      import('./confirmation-dialog-height-large').then(
        m => m.confirmationDialogHeightLargeFixture,
      ),
  },
];

export function getFixture(name: string | null): FixtureEntry {
  return FIXTURES.find(f => f.name === name) ?? FIXTURES[0];
}
