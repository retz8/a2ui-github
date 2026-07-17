import type {ReactNode} from 'react';
import {Dialog as PrimerDialog} from '@primer/react';
import type {DialogProps as PrimerDialogProps} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {DialogApi} from './dialog.schema';
import {renderSlottedChildList, type SlotMap} from '../../shared/slotted-child-list';

/**
 * Slot routing for the root's `children`. Primer's `Dialog` scans direct children for its
 * `Dialog.Header`/`Dialog.Body`/`Dialog.Footer` slots by `__SLOT__` marker (`useSlots`), but the
 * binder renders every child through an opaque `DeferredChild` wrapper that buries the marker — so
 * each slot leaf is wrapped in a marker-carrying `bridge` (the `ActionList.Item` precedent). Every
 * other child (e.g. the body `Text`) falls through to become the dialog's default body content.
 */
const DIALOG_SLOTS: SlotMap = {
  DialogHeader: {mode: 'bridge', slot: PrimerDialog.Header},
  DialogBody: {mode: 'bridge', slot: PrimerDialog.Body},
  DialogFooter: {mode: 'bridge', slot: PrimerDialog.Footer},
};

type PrimerFooterButtons = NonNullable<PrimerDialogProps['footerButtons']>;

/**
 * A `footerButtons` entry AFTER binder resolution: `content` is a plain string, `action` a
 * ready-to-call closure, `disabled`/`loading` booleans. The inferred prop type still shows the raw
 * pre-resolution shapes, so `props.footerButtons` is cast to this element-wise.
 */
type ResolvedDialogButton = {
  content: string;
  buttonType?: 'default' | 'primary' | 'danger' | 'normal';
  action?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

/** Maps a resolved `dialogButton` to Primer's `DialogButtonProps`: `action` → `onClick`, the rest
 * pass through (Primer's `Buttons` maps `buttonType 'normal'` → `'default'` and focuses the first
 * `autoFocus` entry). */
function toPrimerButton(button: ResolvedDialogButton): PrimerFooterButtons[number] {
  return {
    content: button.content,
    buttonType: button.buttonType,
    autoFocus: button.autoFocus,
    disabled: button.disabled,
    loading: button.loading,
    onClick: button.action,
  } as PrimerFooterButtons[number];
}

/** Resolved props: Dynamic* resolve to primitives, `closeAction` → onClose, `footerButtons` to
 * Primer's button shape, and the slot-routed ChildList arrives as built `children`. */
type DialogViewProps = {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  footerButtons?: PrimerFooterButtons;
  role?: 'dialog' | 'alertdialog';
  width?: PrimerDialogProps['width'];
  height?: 'small' | 'large' | 'auto';
  position?: PrimerDialogProps['position'];
  align?: 'top' | 'center' | 'bottom';
  children?: ReactNode;
};

export function DialogView({
  title,
  subtitle,
  onClose,
  footerButtons,
  role,
  width,
  height,
  position,
  align,
  children,
}: DialogViewProps) {
  return (
    <PrimerDialog
      title={title}
      subtitle={subtitle}
      // Primer's onClose receives a gesture argument our authored Action does not consume.
      onClose={onClose ?? (() => {})}
      footerButtons={footerButtons}
      role={role}
      width={width}
      height={height}
      position={position}
      align={align}
    >
      {children}
    </PrimerDialog>
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders DialogView. It wraps Primer's
 * self-contained `Dialog`, which portals to the body and manages its own backdrop/focus.
 * - `props.children` is a resolved `ChildList`; `renderSlottedChildList` routes `DialogHeader`/
 *   `DialogBody`/`DialogFooter` leaves into Primer's slots (see `DIALOG_SLOTS`); the `context` gives
 *   each child's type via the surface model.
 * - `props.closeAction` resolves to a () => void closure → onClose (event vs functionCall routing is
 *   the renderer's job).
 * - `props.footerButtons` is resolved element-wise by the binder (each `action` → a closure); mapped
 *   to Primer's `DialogButtonProps`.
 * Props are passed explicitly (no spread): resolved props include extra binder setters.
 */
export const DialogComponent = createComponentImplementation(
  DialogApi,
  ({props, buildChild, context}) => {
    const footerButtons = (props.footerButtons as ResolvedDialogButton[] | undefined)?.map(
      toPrimerButton,
    );
    return (
      <DialogView
        title={props.title}
        subtitle={props.subtitle}
        onClose={props.closeAction}
        footerButtons={footerButtons}
        role={props.role}
        width={props.width}
        height={props.height}
        // The schema's `responsive()` arm permits `bottom`/`fullscreen` as bare scalars (they take
        // effect only below the narrow breakpoint); Primer types them object-only, so cast the
        // resolved (STATIC-passthrough) value to Primer's position type.
        position={props.position as PrimerDialogProps['position']}
        align={props.align}
      >
        {renderSlottedChildList(props.children, buildChild, context, DIALOG_SLOTS)}
      </DialogView>
    );
  },
);
