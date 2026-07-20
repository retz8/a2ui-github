import type {Comp} from './stack-helpers';
import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Shared builders for the `ActionMenu` family fixtures. Every fixture is a realistic, GitHub-triage-
 * flavored `ActionMenu` surface assembled from already-shipped leaves (`ActionMenu.Button` trigger,
 * `ActionMenu.Overlay`, the `ActionList` family, `Icon`, `Text`) — never a naked leaf. The static
 * baseline harness cannot drive gestures, so open menus render with `open: true`; the open/close
 * gesture and two-way write-back are covered by vitest render-tests.
 */

/** The base menu content: an `ActionList` of triage actions with a leading icon, a divider, and a
 * danger item — the composition shared by every fixture (decision doc base composition). */
export function menuContent(): Comp[] {
  return [
    {
      id: 'list',
      component: 'ActionList',
      children: ['item-view', 'item-edit', 'divider', 'item-delete'],
    },
    {id: 'item-view', component: 'ActionList.Item', children: ['view-lead', 'item-view-label']},
    {id: 'view-lead', component: 'ActionList.LeadingVisual', children: ['view-icon']},
    {
      id: 'view-icon',
      component: 'Icon',
      name: 'git-pull-request',
      accessibility: {label: 'pull request'},
    },
    {id: 'item-view-label', component: 'Text', text: 'View pull request'},
    {id: 'item-edit', component: 'ActionList.Item', children: ['item-edit-label']},
    {id: 'item-edit-label', component: 'Text', text: 'Edit'},
    {id: 'divider', component: 'ActionMenu.Divider'},
    {
      id: 'item-delete',
      component: 'ActionList.Item',
      variant: 'danger',
      children: ['delete-lead', 'item-delete-label'],
    },
    {id: 'delete-lead', component: 'ActionList.LeadingVisual', children: ['delete-icon']},
    {id: 'delete-icon', component: 'Icon', name: 'trash', accessibility: {label: 'delete'}},
    {id: 'item-delete-label', component: 'Text', text: 'Delete branch'},
  ];
}

/** The default trigger: an `ActionMenu.Button` labelled "Actions". */
export function buttonTrigger(props: Record<string, unknown> = {}): Comp[] {
  return [
    {id: 'trigger', component: 'ActionMenu.Button', child: 'trigger-label', ...props},
    {id: 'trigger-label', component: 'Text', text: 'Actions'},
  ];
}

export interface MenuFixtureOptions {
  /** Root `open` value: a literal, a `{path}` binding, or omitted (Primer uncontrolled). */
  open?: unknown;
  /** Extra props for the `ActionMenu.Overlay` (align / side / variant / sizing). */
  overlayProps?: Record<string, unknown>;
  /** Override the trigger component array (default: the "Actions" `ActionMenu.Button`). */
  trigger?: Comp[];
  /** Override the menu content component array (default: the base triage list). */
  content?: Comp[];
  /** An optional initial data model (for a bound `open`). */
  dataModel?: unknown;
}

/**
 * Builds one `ActionMenu` fixture: a root `ActionMenu` whose `children` are the trigger and an
 * `ActionMenu.Overlay` holding the menu content. `open` and overlay props are applied from options.
 */
export function menuFixture(name: string, opts: MenuFixtureOptions = {}): Fixture {
  const {
    open,
    overlayProps = {},
    trigger = buttonTrigger(),
    content = menuContent(),
    dataModel,
  } = opts;
  const root: Comp = {id: 'root', component: 'ActionMenu', children: ['trigger', 'overlay']};
  if (open !== undefined) root.open = open;
  const overlay: Comp = {
    id: 'overlay',
    component: 'ActionMenu.Overlay',
    children: ['list'],
    ...overlayProps,
  };
  const components: Comp[] = [root, ...trigger, overlay, ...content];
  return {name, messages: surface(name, components, dataModel)};
}
