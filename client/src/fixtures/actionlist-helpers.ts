import type {Comp} from './stack-helpers';

/**
 * Shared builders for the ActionList family fixtures. Every fixture is a realistic `ActionList`
 * surface built from already-shipped leaves — never a naked leaf.
 */

/** An `ActionList.Item` holding a single `Text` label (id `${id}-label`), plus optional item props. */
export function labelItem(id: string, label: string, props: Record<string, unknown> = {}): Comp[] {
  return [
    {id, component: 'ActionList.Item', children: [`${id}-label`], ...props},
    {id: `${id}-label`, component: 'Text', text: label},
  ];
}

/** An `ActionList.LeadingVisual` wrapping an `Icon` (ids `${id}` / `${id}-icon`). */
export function leadingIcon(id: string, name: string): Comp[] {
  return [
    {id, component: 'ActionList.LeadingVisual', children: [`${id}-icon`]},
    {id: `${id}-icon`, component: 'Icon', name, accessibility: {label: name}},
  ];
}
