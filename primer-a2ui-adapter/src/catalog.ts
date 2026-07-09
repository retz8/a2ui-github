import {Catalog} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {CATALOG_ID} from './catalog-id';
import {TextComponent} from './components/text';
import {ButtonComponent} from './components/button';
import {IconComponent} from './components/icon';
import {LinkComponent} from './components/link';
import {HeadingComponent} from './components/heading';
import {BranchNameComponent} from './components/branchname';
import {RelativeTimeComponent} from './components/relative-time';
import {LabelComponent} from './components/label';
import {StateLabelComponent} from './components/statelabel';
import {CounterLabelComponent} from './components/counterlabel';
import {consoleLog} from './functions/console-log';

/** From-scratch catalog over CommonSchemas: id, component implementations, functions. */
export const CATALOG = new Catalog<ReactComponentImplementation>(
  CATALOG_ID,
  [
    TextComponent,
    ButtonComponent,
    IconComponent,
    LinkComponent,
    HeadingComponent,
    BranchNameComponent,
    RelativeTimeComponent,
    LabelComponent,
    StateLabelComponent,
    CounterLabelComponent,
  ],
  [consoleLog],
);
