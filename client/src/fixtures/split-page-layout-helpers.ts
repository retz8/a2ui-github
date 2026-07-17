import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';

/** A surface component object: a component name + id, plus arbitrary A2UI props. */
export type Comp = {id: string; component: string; [k: string]: unknown};

/** One surface: a createSurface + updateComponents (and an optional initial data model). */
export function surface(surfaceId: string, components: Comp[], dataModel?: unknown): A2uiMessage[] {
  const messages: A2uiMessage[] = [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {version: 'v0.9', updateComponents: {surfaceId, components}},
  ];
  if (dataModel !== undefined) {
    messages.push({version: 'v0.9', updateDataModel: {surfaceId, path: '/', value: dataModel}});
  }
  return messages;
}

/**
 * A canned side-region body: three `Link` components (the panel/sidebar content a `Pane` or
 * `Sidebar` arranges). `prefix` scopes the ids so several regions can coexist on one surface.
 */
export function regionLinks(prefix: string): Comp[] {
  return [
    {id: `${prefix}-l1`, component: 'Link', text: 'Overview', href: '#overview'},
    {id: `${prefix}-l2`, component: 'Link', text: 'Settings', href: '#settings'},
    {id: `${prefix}-l3`, component: 'Link', text: 'Members', href: '#members'},
  ];
}

/** The ids produced by `regionLinks(prefix)`, for a region's `children` slot. */
export function regionLinkIds(prefix: string): string[] {
  return [`${prefix}-l1`, `${prefix}-l2`, `${prefix}-l3`];
}
