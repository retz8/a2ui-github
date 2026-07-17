import {TextApi} from './components/text';
import {ButtonApi} from './components/button';
import {IconButtonApi} from './components/iconbutton';
import {IconApi} from './components/icon';
import {LinkApi} from './components/link';
import {HeadingApi} from './components/heading';
import {BranchNameApi} from './components/branchname';
import {RelativeTimeApi} from './components/relative-time';
import {LabelApi} from './components/label';
import {StateLabelApi} from './components/statelabel';
import {CounterLabelApi} from './components/counterlabel';
import {AvatarApi} from './components/avatar';
import {SpinnerApi} from './components/spinner';
import {TokenApi} from './components/token';
import {IssueLabelTokenApi} from './components/issuelabeltoken';
import {CheckboxApi} from './components/checkbox';
import {ProgressBarApi} from './components/progressbar';
import {RadioApi} from './components/radio';
import {ToggleSwitchApi} from './components/toggleswitch';
import {TextareaApi} from './components/textarea';
import {TextInputApi} from './components/textinput';
import {TextInputActionApi} from './components/textinput-action';
import {SkeletonBoxApi} from './components/skeletonbox';
import {TruncateApi} from './components/truncate';
import {KeybindingHintApi} from './components/keybindinghint';
import {StackApi} from './components/stack';
import {StackItemApi} from './components/stackitem';
import {LabelGroupApi} from './components/label-group';
import {AvatarStackApi} from './components/avatarstack';
import {ButtonGroupApi} from './components/buttongroup';
import {PaginationApi} from './components/pagination';
import {SegmentedControlApi} from './components/segmentedcontrol';
import {SegmentedControlButtonApi} from './components/segmentedcontrolbutton';
import {SegmentedControlIconButtonApi} from './components/segmentedcontroliconbutton';
import {DetailsApi} from './components/details';
import {SelectApi} from './components/select';
import {SelectOptionApi} from './components/selectoption';
import {SelectOptGroupApi} from './components/selectoptgroup';
import {BreadcrumbsApi} from './components/breadcrumbs';
import {BreadcrumbsItemApi} from './components/breadcrumbsitem';
import {consoleLog} from './functions/console-log';
import {windowAlert} from './functions/window-alert';
import {clearValue} from './functions/clear-value';

// Component registry: zod ComponentApi keyed by component name — the hand-maintained
// expected set the parity test (catalog.parity.test.ts) and the catalog smoke test
// (catalog.test.ts) both derive from. One entry per shipped component.
export const COMPONENTS = {
  Text: TextApi,
  Button: ButtonApi,
  IconButton: IconButtonApi,
  Icon: IconApi,
  Link: LinkApi,
  Heading: HeadingApi,
  BranchName: BranchNameApi,
  RelativeTime: RelativeTimeApi,
  Label: LabelApi,
  StateLabel: StateLabelApi,
  CounterLabel: CounterLabelApi,
  Avatar: AvatarApi,
  Spinner: SpinnerApi,
  Token: TokenApi,
  IssueLabelToken: IssueLabelTokenApi,
  Checkbox: CheckboxApi,
  ProgressBar: ProgressBarApi,
  Radio: RadioApi,
  ToggleSwitch: ToggleSwitchApi,
  Textarea: TextareaApi,
  TextInput: TextInputApi,
  'TextInput.Action': TextInputActionApi,
  SkeletonBox: SkeletonBoxApi,
  Truncate: TruncateApi,
  KeybindingHint: KeybindingHintApi,
  Stack: StackApi,
  StackItem: StackItemApi,
  LabelGroup: LabelGroupApi,
  AvatarStack: AvatarStackApi,
  ButtonGroup: ButtonGroupApi,
  Pagination: PaginationApi,
  SegmentedControl: SegmentedControlApi,
  SegmentedControlButton: SegmentedControlButtonApi,
  SegmentedControlIconButton: SegmentedControlIconButtonApi,
  Details: DetailsApi,
  Select: SelectApi,
  SelectOption: SelectOptionApi,
  SelectOptGroup: SelectOptGroupApi,
  Breadcrumbs: BreadcrumbsApi,
  BreadcrumbsItem: BreadcrumbsItemApi,
} as const;
// Function registry: FunctionImplementation keyed by function name.
export const FUNCTIONS = {consoleLog, windowAlert, clearValue} as const;
