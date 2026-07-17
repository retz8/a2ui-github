import {z} from 'zod';
import {CommonSchemas} from '@a2ui/web_core/v0_9';

/**
 * Runtime (zod) representation of Primer `Dialog.CloseButton`, props-only. An icon button that
 * closes the dialog, rendered inside a custom dialog header. Part of the `Dialog` compound family
 * (6.52) — see `dialog.md`.
 *
 * Composed inside `DialogHeader`. Primer renders a canned invisible X icon button with a hardcoded
 * accessible name (`"Close"`), so there is no `accessibility` prop.
 *
 * - `closeAction` (← `onClose`, required, synthetic) → `Action`: performed when the close button is
 *   clicked.
 *
 * `onKeyDown` (focus-trap keyboard plumbing) and the declared but unrendered `children` are dropped
 * (code is authority). `.strict()` forbids any prop outside this surface.
 */
export const DialogCloseButtonApi = {
  name: 'DialogCloseButton',
  schema: z
    .object({
      closeAction: CommonSchemas.Action,
    })
    .strict(),
} as const;

export type DialogCloseButtonProps = z.infer<typeof DialogCloseButtonApi.schema>;
