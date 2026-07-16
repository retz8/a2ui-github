import type {ElementType, ReactNode} from 'react';
import {ActionBar as PrimerActionBar} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {ActionBarIconButtonApi} from './actionbar-iconbutton.schema';

/** Resolved accessibility: nested DynamicStrings are plain strings after the binder resolves them. */
type ResolvedAccessibility = {label?: string; description?: string};

/**
 * Resolved props: `action` -> onClick (() => void), the required `icon` ComponentId -> a built
 * child (ReactNode), `disabled` -> the resolved boolean. `variant` is hardcoded to `invisible` by
 * ActionBar and `size` comes from the parent ActionBar context — neither is authored here.
 */
type ActionBarIconButtonViewProps = {
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  accessibility?: ResolvedAccessibility;
};

export function ActionBarIconButtonView({
  onClick,
  icon,
  disabled,
  accessibility,
}: ActionBarIconButtonViewProps) {
  return (
    <PrimerActionBar.IconButton
      // Primer's ActionBar.IconButton spreads the icon to Primer's IconButton, whose ButtonBase
      // renderModuleVisual accepts an already-built element at runtime (react-is isElement); the
      // type wants a component, so it is cast (the same path IconButton (6.29) uses).
      icon={icon as unknown as ElementType}
      aria-label={accessibility?.label ?? ''}
      aria-description={accessibility?.description}
      disabled={disabled}
      onClick={onClick}
    />
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders ActionBarIconButtonView.
 * - `props.action` is resolved to a () => void closure (the renderer routes event vs functionCall)
 *   -> passed as onClick.
 * - `props.icon` (required ComponentId) is built via buildChild and passed as the icon slot.
 * - `props.accessibility` carries resolved (plain-string) label/description at runtime; its
 *   inferred type still shows the nested DynamicString, so it is cast to the resolved shape.
 * Standalone (no ActionBar parent) the overflow registry no-ops and `size` falls back to the
 * ActionBar context default. Props are passed explicitly (no spread): resolved props include extra
 * binder setters.
 */
export const ActionBarIconButtonComponent = createComponentImplementation(
  ActionBarIconButtonApi,
  ({props, buildChild}) => (
    <ActionBarIconButtonView
      onClick={props.action}
      icon={buildChild(props.icon)}
      disabled={props.disabled}
      accessibility={props.accessibility as ResolvedAccessibility | undefined}
    />
  ),
);
