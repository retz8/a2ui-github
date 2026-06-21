import {Catalog} from '@a2ui/web_core/v0_9';
import type {ReactComponentImplementation} from '@a2ui/react/v0_9';
import {CATALOG_ID} from './catalog-id';

// Empty-but-wired catalog. Register your component implementations (2nd arg) and
// local functions (3rd arg) here as you author them. Component and function
// schema format: the official A2UI v0.9 specification —
// https://a2ui.org/specification/v0_9/
export const CATALOG = new Catalog<ReactComponentImplementation>(CATALOG_ID, [], []);
