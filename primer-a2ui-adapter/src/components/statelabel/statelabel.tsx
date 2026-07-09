import {StateLabel as PrimerStateLabel} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {StateLabelApi, type StateLabelProps} from './statelabel.schema';

/** Resolved props: `text` is a plain string after the binder resolves the DynamicString. */
type StateLabelViewProps = Omit<StateLabelProps, 'text'> & {text: string};

export function StateLabelView({text, status, size}: StateLabelViewProps) {
  return (
    <PrimerStateLabel status={status} size={size}>
      {text}
    </PrimerStateLabel>
  );
}

/** Catalog entry: the generic binder resolves props, then renders StateLabelView. */
export const StateLabelComponent = createComponentImplementation(StateLabelApi, ({props}) => (
  <StateLabelView text={props.text} status={props.status} size={props.size} />
));
