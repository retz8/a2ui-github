import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';

/** A surface component object: a component name + id, plus arbitrary A2UI props. */
export type Comp = {id: string; component: string; [k: string]: unknown};

/**
 * The three standard label options ("Bug"/"Feature"/"Docs") as `SelectOption` components, the
 * option set most Select fixtures arrange. Ids `o1`/`o2`/`o3`, values `bug`/`feature`/`docs`.
 */
export function labelOptions(): Comp[] {
  return [
    {id: 'o1', component: 'SelectOption', text: 'Bug', value: 'bug'},
    {id: 'o2', component: 'SelectOption', text: 'Feature', value: 'feature'},
    {id: 'o3', component: 'SelectOption', text: 'Docs', value: 'docs'},
  ];
}

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
