import type {ComponentType, ReactNode} from 'react';
import {ActionList as PrimerActionList} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {ActionListLinkItemApi} from './actionlist-linkitem.schema';
import {renderChildList} from '../../shared/child-list';

/** Resolved props: Dynamic* resolve to primitives; the ChildList arrives as built `children`. */
type ActionListLinkItemViewProps = {
  href: string;
  active?: boolean;
  inactiveText?: string;
  variant?: 'default' | 'danger';
  size?: 'medium' | 'large';
  target?: '_self' | '_blank';
  children?: ReactNode;
};

/**
 * Primer ActionList.LinkItem is a strict polymorphic whose overloads reject a runtime-chosen prop
 * surface. Cast it to a plain component typed with exactly the props we drive; the `variant`/
 * `size`/`target` enums are already validated by the schema.
 */
const LinkItem = PrimerActionList.LinkItem as unknown as ComponentType<{
  href: string;
  active?: boolean;
  inactiveText?: string;
  variant?: 'default' | 'danger';
  size?: 'medium' | 'large';
  target?: '_self' | '_blank';
  children?: ReactNode;
}>;

export function ActionListLinkItemView({
  href,
  active,
  inactiveText,
  variant,
  size,
  target,
  children,
}: ActionListLinkItemViewProps) {
  return (
    <LinkItem
      href={href}
      active={active}
      inactiveText={inactiveText}
      variant={variant}
      size={size}
      target={target}
    >
      {children}
    </LinkItem>
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders ActionListLinkItemView.
 * - `props.children` (label + slot leaves) is a resolved `ChildList`; `renderChildList` builds
 *   each via `buildChild`. `LinkItem` navigates via `href` (no `Action`/`buildChild`/`onClick`).
 * Props are passed explicitly (no spread): resolved props include extra binder setters.
 */
export const ActionListLinkItemComponent = createComponentImplementation(
  ActionListLinkItemApi,
  ({props, buildChild}) => (
    <ActionListLinkItemView
      href={props.href}
      active={props.active}
      inactiveText={props.inactiveText}
      variant={props.variant}
      size={props.size}
      target={props.target}
    >
      {renderChildList(props.children, buildChild)}
    </ActionListLinkItemView>
  ),
);
