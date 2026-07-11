import {IssueLabelToken as PrimerIssueLabelToken} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {IssueLabelTokenApi} from './issuelabeltoken.schema';

/** Resolved accessibility: nested DynamicStrings are plain strings after the binder resolves them. */
type ResolvedAccessibility = {label?: string; description?: string};

/** Resolved props: Dynamic* are resolved to primitives, removeAction -> onRemove. */
type IssueLabelTokenViewProps = {
  text: string;
  fillColor?: string;
  as?: 'span' | 'button' | 'a';
  onRemove?: () => void;
  hideRemoveButton?: boolean;
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  accessibility?: ResolvedAccessibility;
};

export function IssueLabelTokenView({
  text,
  fillColor,
  as,
  onRemove,
  hideRemoveButton,
  isSelected,
  size,
  disabled,
  accessibility,
}: IssueLabelTokenViewProps) {
  return (
    <PrimerIssueLabelToken
      as={as}
      text={text}
      fillColor={fillColor}
      onRemove={onRemove}
      hideRemoveButton={hideRemoveButton}
      isSelected={isSelected}
      size={size}
      disabled={disabled}
      aria-label={accessibility?.label}
      aria-description={accessibility?.description}
    />
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders IssueLabelTokenView.
 * - `props.removeAction` (optional) is resolved to a () => void closure -> passed as onRemove;
 *   omitting it renders no remove button.
 * - `props.accessibility` carries resolved (plain-string) label/description at runtime; its
 *   inferred type still shows the nested DynamicString, so it is cast to the resolved shape.
 * Props are passed explicitly (no spread): resolved props include extra binder setters.
 */
export const IssueLabelTokenComponent = createComponentImplementation(
  IssueLabelTokenApi,
  ({props}) => (
    <IssueLabelTokenView
      text={props.text}
      fillColor={props.fillColor}
      as={props.as}
      onRemove={props.removeAction}
      hideRemoveButton={props.hideRemoveButton}
      isSelected={props.isSelected}
      size={props.size}
      disabled={props.disabled}
      accessibility={props.accessibility as ResolvedAccessibility | undefined}
    />
  ),
);
