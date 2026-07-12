import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';

/** A surface component object: a component name + id, plus arbitrary A2UI props. */
export type Comp = {id: string; component: string; [k: string]: unknown};

/**
 * A filler Button (`id`) plus its label Text (`${id}-label`), as the component pair a Stack
 * fixture arranges. Button's `action` is required, so a harmless local `consoleLog` is wired.
 * Extra Button props (e.g. `size`) pass through via `props`.
 */
export function labeledButton(id: string, label: string, props: Record<string, unknown> = {}): Comp[] {
  return [
    {
      id,
      component: 'Button',
      child: `${id}-label`,
      action: {functionCall: {call: 'consoleLog', args: {message: id}, returnType: 'void'}},
      ...props,
    },
    {id: `${id}-label`, component: 'Text', text: label},
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
