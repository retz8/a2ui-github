import {TextApi} from './components/text';
import {ButtonApi} from './components/button';
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
import {consoleLog} from './functions/console-log';

// Component registry: zod ComponentApi keyed by component name — the hand-maintained
// expected set the parity test (catalog.parity.test.ts) and the catalog smoke test
// (catalog.test.ts) both derive from. One entry per shipped component.
export const COMPONENTS = {
  Text: TextApi,
  Button: ButtonApi,
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
} as const;
// Function registry: FunctionImplementation keyed by function name.
export const FUNCTIONS = {consoleLog} as const;
