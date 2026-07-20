import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Comp} from './stack-helpers';

/**
 * Shared builders for the `SelectPanel` compound-family fixtures (6.50). Every fixture is a
 * realistic label-picker surface — an open panel opened from a presentational `Button` trigger,
 * with `SelectPanel.Item` rows built as data leaves. The trigger's label Text is always id
 * `anchor-label` (the surface visible in both open and closed states, and the target the agent
 * swaps in the event fixtures).
 */

/** The presentational anchor `Button` (id `trigger`) + its label `Text` (id `anchor-label`). */
export function anchor(label = 'Labels'): Comp[] {
  return [
    {
      id: 'trigger',
      component: 'Button',
      child: 'anchor-label',
      action: {
        functionCall: {
          call: 'consoleLog',
          args: {message: 'trigger (presentational — gestures handled by the panel)'},
          returnType: 'void',
        },
      },
    },
    {id: 'anchor-label', component: 'Text', text: label},
  ];
}

/** One `SelectPanel.Item` — its `text` is a direct prop (not a child), plus optional item props. */
export function spItem(id: string, text: unknown, props: Record<string, unknown> = {}): Comp {
  return {id, component: 'SelectPanel.Item', text, ...props};
}

/** An `Icon` leaf referenced by a `SelectPanel.Item.leadingVisual`/`trailingVisual` ComponentId. */
export function spIcon(id: string, name: string): Comp {
  return {id, component: 'Icon', name, accessibility: {label: name}};
}

/**
 * Assembles one `SelectPanel` surface: a `root` SelectPanel (defaulting `open: true`) opened from
 * the shared `anchor`, plus the item leaves and any extra comps (icons, secondary action). A
 * `dataModel` seeds bound paths.
 */
export function spSurface(
  surfaceId: string,
  rootProps: Record<string, unknown>,
  children: string[],
  comps: Comp[],
  dataModel?: unknown,
  anchorLabel = 'Labels',
): A2uiMessage[] {
  const messages: A2uiMessage[] = [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'SelectPanel',
            anchor: 'trigger',
            open: true,
            children,
            ...rootProps,
          },
          ...anchor(anchorLabel),
          ...comps,
        ],
      },
    },
  ];
  if (dataModel !== undefined) {
    messages.push({version: 'v0.9', updateDataModel: {surfaceId, path: '/', value: dataModel}});
  }
  return messages;
}
