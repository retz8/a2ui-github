import {TextApi} from './components/text';
import {ButtonApi} from './components/button';
import {IconApi} from './components/icon';
import {consoleLog} from './functions/console-log';

// Component registry: zod ComponentApi keyed by component name — the hand-maintained
// expected set the parity test (catalog.parity.test.ts) and the catalog smoke test
// (catalog.test.ts) both derive from. One entry per shipped component.
export const COMPONENTS = {Text: TextApi, Button: ButtonApi, Icon: IconApi} as const;
// Function registry: FunctionImplementation keyed by function name.
export const FUNCTIONS = {consoleLog} as const;
