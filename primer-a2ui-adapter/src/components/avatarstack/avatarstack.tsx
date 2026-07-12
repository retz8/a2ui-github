import type {ReactNode} from 'react';
import {AvatarStack as PrimerAvatarStack} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {AvatarStackApi} from './avatarstack.schema';
import {renderChildList} from '../../shared/child-list';

/** A resolved `size`: either a scalar pixel value or Primer's `{narrow, regular, wide}` responsive map. */
type Responsive<T> = T | {narrow?: T; regular?: T; wide?: T};

/** Resolved props: ChildList arrives as built `children`; `size` passes through (scalar or map). */
type AvatarStackViewProps = {
  alignRight?: boolean;
  disableExpand?: boolean;
  variant?: 'cascade' | 'stack';
  shape?: 'circle' | 'square';
  size?: Responsive<number>;
  children?: ReactNode;
};

export function AvatarStackView({
  alignRight,
  disableExpand,
  variant,
  shape,
  size,
  children,
}: AvatarStackViewProps) {
  return (
    <PrimerAvatarStack
      alignRight={alignRight}
      disableExpand={disableExpand}
      variant={variant}
      shape={shape}
      size={size}
    >
      {children}
    </PrimerAvatarStack>
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders AvatarStackView.
 * - `props.children` is a resolved `ChildList` (static `string[]` of ids or a `{id, basePath}[]`
 *   template expansion); `renderChildList` builds each via `buildChild` as a direct avatar child.
 * - `size` resolves as a STATIC pass-through (scalar or responsive map) — forwarded to Primer,
 *   which handles the CSS. There is no ComponentId/Action row beyond `children`, so no `onClick`.
 *   Props are passed explicitly (no spread): resolved props include extra binder setters.
 */
export const AvatarStackComponent = createComponentImplementation(
  AvatarStackApi,
  ({props, buildChild}) => (
    <AvatarStackView
      alignRight={props.alignRight}
      disableExpand={props.disableExpand}
      variant={props.variant}
      shape={props.shape}
      size={props.size}
    >
      {renderChildList(props.children, buildChild)}
    </AvatarStackView>
  ),
);
