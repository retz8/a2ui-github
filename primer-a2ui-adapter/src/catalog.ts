import {Catalog} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {CATALOG_ID} from './catalog-id';
import {TextComponent} from './components/text';
import {ButtonComponent} from './components/button';
import {IconButtonComponent} from './components/iconbutton';
import {IconComponent} from './components/icon';
import {LinkComponent} from './components/link';
import {HeadingComponent} from './components/heading';
import {BranchNameComponent} from './components/branchname';
import {RelativeTimeComponent} from './components/relative-time';
import {LabelComponent} from './components/label';
import {StateLabelComponent} from './components/statelabel';
import {CounterLabelComponent} from './components/counterlabel';
import {AvatarComponent} from './components/avatar';
import {SpinnerComponent} from './components/spinner';
import {TokenComponent} from './components/token';
import {IssueLabelTokenComponent} from './components/issuelabeltoken';
import {CheckboxComponent} from './components/checkbox';
import {ProgressBarComponent} from './components/progressbar';
import {RadioComponent} from './components/radio';
import {ToggleSwitchComponent} from './components/toggleswitch';
import {TextareaComponent} from './components/textarea';
import {TextInputComponent} from './components/textinput';
import {TextInputActionComponent} from './components/textinput-action';
import {SkeletonBoxComponent} from './components/skeletonbox';
import {TruncateComponent} from './components/truncate';
import {KeybindingHintComponent} from './components/keybindinghint';
import {StackComponent} from './components/stack';
import {StackItemComponent} from './components/stackitem';
import {LabelGroupComponent} from './components/label-group';
import {AvatarStackComponent} from './components/avatarstack';
import {ButtonGroupComponent} from './components/buttongroup';
import {PaginationComponent} from './components/pagination';
import {SegmentedControlComponent} from './components/segmentedcontrol';
import {SegmentedControlButtonComponent} from './components/segmentedcontrolbutton';
import {SegmentedControlIconButtonComponent} from './components/segmentedcontroliconbutton';
import {DetailsComponent} from './components/details';
import {SelectComponent} from './components/select';
import {SelectOptionComponent} from './components/selectoption';
import {SelectOptGroupComponent} from './components/selectoptgroup';
import {BreadcrumbsComponent} from './components/breadcrumbs';
import {BreadcrumbsItemComponent} from './components/breadcrumbsitem';
import {NavListComponent} from './components/navlist';
import {NavListItemComponent} from './components/navlist-item';
import {NavListSubNavComponent} from './components/navlist-subnav';
import {NavListLeadingVisualComponent} from './components/navlist-leadingvisual';
import {NavListTrailingVisualComponent} from './components/navlist-trailingvisual';
import {NavListTrailingActionComponent} from './components/navlist-trailingaction';
import {NavListGroupComponent} from './components/navlist-group';
import {NavListGroupHeadingComponent} from './components/navlist-groupheading';
import {NavListDividerComponent} from './components/navlist-divider';
import {NavListDescriptionComponent} from './components/navlist-description';
import {NavListGroupExpandComponent} from './components/navlist-groupexpand';
import {PageLayoutComponent} from './components/pagelayout';
import {PageLayoutHeaderComponent} from './components/pagelayout-header';
import {PageLayoutContentComponent} from './components/pagelayout-content';
import {PageLayoutPaneComponent} from './components/pagelayout-pane';
import {PageLayoutSidebarComponent} from './components/pagelayout-sidebar';
import {PageLayoutFooterComponent} from './components/pagelayout-footer';
import {SplitPageLayoutComponent} from './components/split-page-layout';
import {SplitPageLayoutHeaderComponent} from './components/split-page-layout-header';
import {SplitPageLayoutContentComponent} from './components/split-page-layout-content';
import {SplitPageLayoutPaneComponent} from './components/split-page-layout-pane';
import {SplitPageLayoutSidebarComponent} from './components/split-page-layout-sidebar';
import {SplitPageLayoutFooterComponent} from './components/split-page-layout-footer';
import {PageHeaderComponent} from './components/pageheader';
import {PageHeaderContextAreaComponent} from './components/pageheader-contextarea';
import {PageHeaderParentLinkComponent} from './components/pageheader-parentlink';
import {PageHeaderContextBarComponent} from './components/pageheader-contextbar';
import {PageHeaderContextAreaActionsComponent} from './components/pageheader-contextareaactions';
import {PageHeaderTitleAreaComponent} from './components/pageheader-titlearea';
import {PageHeaderLeadingActionComponent} from './components/pageheader-leadingaction';
import {PageHeaderLeadingVisualComponent} from './components/pageheader-leadingvisual';
import {PageHeaderTitleComponent} from './components/pageheader-title';
import {PageHeaderTrailingVisualComponent} from './components/pageheader-trailingvisual';
import {PageHeaderTrailingActionComponent} from './components/pageheader-trailingaction';
import {PageHeaderActionsComponent} from './components/pageheader-actions';
import {PageHeaderBreadcrumbsComponent} from './components/pageheader-breadcrumbs';
import {PageHeaderDescriptionComponent} from './components/pageheader-description';
import {PageHeaderNavigationComponent} from './components/pageheader-navigation';
import {ActionListComponent} from './components/actionlist';
import {ActionListItemComponent} from './components/actionlist-item';
import {ActionListLinkItemComponent} from './components/actionlist-linkitem';
import {ActionListGroupComponent} from './components/actionlist-group';
import {ActionListGroupHeadingComponent} from './components/actionlist-groupheading';
import {ActionListLeadingVisualComponent} from './components/actionlist-leadingvisual';
import {ActionListTrailingVisualComponent} from './components/actionlist-trailingvisual';
import {ActionListDescriptionComponent} from './components/actionlist-description';
import {ActionListDividerComponent} from './components/actionlist-divider';
import {ActionListTrailingActionComponent} from './components/actionlist-trailingaction';
import {ActionListHeadingComponent} from './components/actionlist-heading';
import {ActionBarComponent} from './components/actionbar';
import {ActionBarIconButtonComponent} from './components/actionbar-iconbutton';
import {ActionBarDividerComponent} from './components/actionbar-divider';
import {ActionBarGroupComponent} from './components/actionbar-group';
import {ActionBarMenuComponent} from './components/actionbar-menu';
import {TreeViewComponent} from './components/treeview';
import {TreeViewItemComponent} from './components/treeview-item';
import {TreeViewSubTreeComponent} from './components/treeview-subtree';
import {TreeViewLeadingVisualComponent} from './components/treeview-leadingvisual';
import {TreeViewTrailingVisualComponent} from './components/treeview-trailingvisual';
import {TreeViewDirectoryIconComponent} from './components/treeview-directoryicon';
import {TreeViewErrorDialogComponent} from './components/treeview-errordialog';
import {UnderlineNavComponent} from './components/underline-nav';
import {UnderlineNavItemComponent} from './components/underline-nav-item';
import {TimelineComponent} from './components/timeline';
import {TimelineItemComponent} from './components/timeline-item';
import {TimelineBadgeComponent} from './components/timeline-badge';
import {TimelineBodyComponent} from './components/timeline-body';
import {TimelineBreakComponent} from './components/timeline-break';
import {TimelineActionsComponent} from './components/timeline-actions';
import {TimelineAvatarComponent} from './components/timeline-avatar';
import {DialogComponent} from './components/dialog';
import {DialogHeaderComponent} from './components/dialog-header';
import {DialogTitleComponent} from './components/dialog-title';
import {DialogSubtitleComponent} from './components/dialog-subtitle';
import {DialogBodyComponent} from './components/dialog-body';
import {DialogFooterComponent} from './components/dialog-footer';
import {DialogButtonsComponent} from './components/dialog-buttons';
import {DialogCloseButtonComponent} from './components/dialog-closebutton';
import {ConfirmationDialogComponent} from './components/confirmationdialog';
import {consoleLog} from './functions/console-log';
import {windowAlert} from './functions/window-alert';
import {clearValue} from './functions/clear-value';

/** From-scratch catalog over CommonSchemas: id, component implementations, functions. */
export const CATALOG = new Catalog<ReactComponentImplementation>(
  CATALOG_ID,
  [
    TextComponent,
    ButtonComponent,
    IconButtonComponent,
    IconComponent,
    LinkComponent,
    HeadingComponent,
    BranchNameComponent,
    RelativeTimeComponent,
    LabelComponent,
    StateLabelComponent,
    CounterLabelComponent,
    AvatarComponent,
    SpinnerComponent,
    TokenComponent,
    IssueLabelTokenComponent,
    CheckboxComponent,
    ProgressBarComponent,
    RadioComponent,
    ToggleSwitchComponent,
    TextareaComponent,
    TextInputComponent,
    TextInputActionComponent,
    SkeletonBoxComponent,
    TruncateComponent,
    KeybindingHintComponent,
    StackComponent,
    StackItemComponent,
    LabelGroupComponent,
    AvatarStackComponent,
    ButtonGroupComponent,
    PaginationComponent,
    SegmentedControlComponent,
    SegmentedControlButtonComponent,
    SegmentedControlIconButtonComponent,
    DetailsComponent,
    SelectComponent,
    SelectOptionComponent,
    SelectOptGroupComponent,
    BreadcrumbsComponent,
    BreadcrumbsItemComponent,
    NavListComponent,
    NavListItemComponent,
    NavListSubNavComponent,
    NavListLeadingVisualComponent,
    NavListTrailingVisualComponent,
    NavListTrailingActionComponent,
    NavListGroupComponent,
    NavListGroupHeadingComponent,
    NavListDividerComponent,
    NavListDescriptionComponent,
    NavListGroupExpandComponent,
    PageLayoutComponent,
    PageLayoutHeaderComponent,
    PageLayoutContentComponent,
    PageLayoutPaneComponent,
    PageLayoutSidebarComponent,
    PageLayoutFooterComponent,
    SplitPageLayoutComponent,
    SplitPageLayoutHeaderComponent,
    SplitPageLayoutContentComponent,
    SplitPageLayoutPaneComponent,
    SplitPageLayoutSidebarComponent,
    SplitPageLayoutFooterComponent,
    PageHeaderComponent,
    PageHeaderContextAreaComponent,
    PageHeaderParentLinkComponent,
    PageHeaderContextBarComponent,
    PageHeaderContextAreaActionsComponent,
    PageHeaderTitleAreaComponent,
    PageHeaderLeadingActionComponent,
    PageHeaderLeadingVisualComponent,
    PageHeaderTitleComponent,
    PageHeaderTrailingVisualComponent,
    PageHeaderTrailingActionComponent,
    PageHeaderActionsComponent,
    PageHeaderBreadcrumbsComponent,
    PageHeaderDescriptionComponent,
    PageHeaderNavigationComponent,
    ActionListComponent,
    ActionListItemComponent,
    ActionListLinkItemComponent,
    ActionListGroupComponent,
    ActionListGroupHeadingComponent,
    ActionListLeadingVisualComponent,
    ActionListTrailingVisualComponent,
    ActionListDescriptionComponent,
    ActionListDividerComponent,
    ActionListTrailingActionComponent,
    ActionListHeadingComponent,
    ActionBarComponent,
    ActionBarIconButtonComponent,
    ActionBarDividerComponent,
    ActionBarGroupComponent,
    ActionBarMenuComponent,
    TreeViewComponent,
    TreeViewItemComponent,
    TreeViewSubTreeComponent,
    TreeViewLeadingVisualComponent,
    TreeViewTrailingVisualComponent,
    TreeViewDirectoryIconComponent,
    TreeViewErrorDialogComponent,
    UnderlineNavComponent,
    UnderlineNavItemComponent,
    TimelineComponent,
    TimelineItemComponent,
    TimelineBadgeComponent,
    TimelineBodyComponent,
    TimelineBreakComponent,
    TimelineActionsComponent,
    TimelineAvatarComponent,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogSubtitleComponent,
    DialogBodyComponent,
    DialogFooterComponent,
    DialogButtonsComponent,
    DialogCloseButtonComponent,
    ConfirmationDialogComponent,
  ],
  [consoleLog, windowAlert, clearValue],
);
