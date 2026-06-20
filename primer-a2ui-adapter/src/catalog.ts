import {Catalog} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {PRIMER_CATALOG_ID} from './catalog-id';
import {TextComponent} from './components/text';
import {ButtonComponent} from './components/button';
import {consoleLog} from './functions/console-log';

/** From-scratch Primer-native catalog: id, component implementations, functions. */
export const PRIMER_CATALOG = new Catalog<ReactComponentImplementation>(
  PRIMER_CATALOG_ID,
  [TextComponent, ButtonComponent],
  [consoleLog],
);
