import type {ReactNode} from 'react';
import {Button as PrimerButton} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {ButtonApi} from './button.schema';

/** Resolved accessibility: nested DynamicStrings are plain strings after the binder resolves them. */
type ResolvedAccessibility = {label?: string; description?: string};

/** Resolved props: Dynamic* are resolved to primitives, action -> onClick, child -> children. */
type ButtonViewProps = {
  variant?: 'default' | 'primary' | 'invisible' | 'danger' | 'link';
  size?: 'small' | 'medium' | 'large';
  alignContent?: 'start' | 'center';
  disabled?: boolean;
  loading?: boolean;
  inactive?: boolean;
  block?: boolean;
  labelWrap?: boolean;
  loadingAnnouncement?: string;
  count?: string;
  accessibility?: ResolvedAccessibility;
  onClick?: () => void;
  children?: ReactNode;
};

export function ButtonView({
  variant,
  size,
  alignContent,
  disabled,
  loading,
  inactive,
  block,
  labelWrap,
  loadingAnnouncement,
  count,
  accessibility,
  onClick,
  children,
}: ButtonViewProps) {
  return (
    <PrimerButton
      variant={variant}
      size={size}
      alignContent={alignContent}
      disabled={disabled}
      loading={loading}
      inactive={inactive}
      block={block}
      labelWrap={labelWrap}
      loadingAnnouncement={loadingAnnouncement}
      count={count}
      aria-label={accessibility?.label}
      aria-description={accessibility?.description}
      onClick={onClick}
    >
      {children}
    </PrimerButton>
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders ButtonView.
 * - `props.action` is resolved to a () => void closure (the renderer routes event vs
 *   functionCall) -> passed as onClick.
 * - `props.child` is the resolved ComponentId string -> built into the label via buildChild.
 * - `props.accessibility` carries resolved (plain-string) label/description at runtime; its
 *   inferred type still shows the nested DynamicString, so it is cast to the resolved shape.
 * Props are passed explicitly (no spread): resolved props include extra binder setters.
 */
export const ButtonComponent = createComponentImplementation(ButtonApi, ({props, buildChild}) => (
  <ButtonView
    variant={props.variant}
    size={props.size}
    alignContent={props.alignContent}
    disabled={props.disabled}
    loading={props.loading}
    inactive={props.inactive}
    block={props.block}
    labelWrap={props.labelWrap}
    loadingAnnouncement={props.loadingAnnouncement}
    count={props.count}
    accessibility={props.accessibility as ResolvedAccessibility | undefined}
    onClick={props.action}
  >
    {buildChild(props.child)}
  </ButtonView>
));
