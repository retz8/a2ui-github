import {Providers} from '../providers';
import {ExamplesSpace} from './ExamplesSpace';

/**
 * The examples showcase page: the selectable examples space under the shared Primer providers. No
 * A2A action handler is wired — the page is server-independent (task 7.8 decisions 5 and 8).
 */
export function ExamplesApp() {
  return (
    <Providers>
      <ExamplesSpace />
    </Providers>
  );
}
