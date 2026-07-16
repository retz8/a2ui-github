import type {ReactNode} from 'react';
import {NavList as PrimerNavList} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {NavListItemApi} from './navlist-item.schema';
import {renderChildList} from '../../shared/child-list';

type AriaCurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';

/** Resolved props: `children` arrives as a built `ChildList`; the Dynamic* strings resolve to plain strings. */
type NavListItemViewProps = {
  href?: string;
  ariaCurrent?: AriaCurrent;
  defaultOpen?: boolean;
  inactiveText?: string;
  children?: ReactNode;
};

export function NavListItemView({
  href,
  ariaCurrent,
  defaultOpen,
  inactiveText,
  children,
}: NavListItemViewProps) {
  return (
    <PrimerNavList.Item
      href={href}
      aria-current={ariaCurrent}
      defaultOpen={defaultOpen}
      inactiveText={inactiveText}
    >
      {children}
    </PrimerNavList.Item>
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders NavListItemView.
 * - `props.children` is a resolved `ChildList`; `renderChildList` builds each via `buildChild`.
 * Props are passed explicitly (no spread): resolved props include extra binder setters.
 */
export const NavListItemComponent = createComponentImplementation(
  NavListItemApi,
  ({props, buildChild}) => (
    <NavListItemView
      href={props.href}
      ariaCurrent={props['aria-current']}
      defaultOpen={props.defaultOpen}
      inactiveText={props.inactiveText}
    >
      {renderChildList(props.children, buildChild)}
    </NavListItemView>
  ),
);
