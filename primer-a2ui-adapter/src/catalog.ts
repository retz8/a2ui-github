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
  ],
  [consoleLog, windowAlert, clearValue],
);
