import type {ReactNode} from 'react';
import {SplitPageLayout as PrimerSplitPageLayout} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {SplitPageLayoutApi} from './split-page-layout.schema';

/** Resolved props: each region `ComponentId` slot arrives as a built node (or undefined). */
type SplitPageLayoutViewProps = {
  header?: ReactNode;
  content?: ReactNode;
  pane?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
};

export function SplitPageLayoutView({
  header,
  content,
  pane,
  sidebar,
  footer,
}: SplitPageLayoutViewProps) {
  return (
    <PrimerSplitPageLayout>
      {header}
      {sidebar}
      {content}
      {pane}
      {footer}
    </PrimerSplitPageLayout>
  );
}

/**
 * Catalog entry: the generic binder resolves props, then renders SplitPageLayoutView.
 * - Each region prop is a synthetic `ComponentId` slot built via `buildChild` (the corresponding
 *   region leaf, whose render emits the real Primer subcomponent carrying its slot-marker).
 * - The Root has no resolved scalar props — it is a pure layout container.
 * Props are passed explicitly (no spread): resolved props include extra binder setters.
 */
export const SplitPageLayoutComponent = createComponentImplementation(
  SplitPageLayoutApi,
  ({props, buildChild}) => (
    <SplitPageLayoutView
      header={props.header ? buildChild(props.header) : undefined}
      content={props.content ? buildChild(props.content) : undefined}
      pane={props.pane ? buildChild(props.pane) : undefined}
      sidebar={props.sidebar ? buildChild(props.sidebar) : undefined}
      footer={props.footer ? buildChild(props.footer) : undefined}
    />
  ),
);
