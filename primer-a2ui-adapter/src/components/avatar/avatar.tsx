import {Avatar as PrimerAvatar} from '@primer/react';
import {createComponentImplementation} from '@a2ui/react/v0_9';
import {AvatarApi} from './avatar.schema';

/** Resolved props: `src`/`alt` are plain strings after the binder resolves the DynamicStrings. */
type AvatarViewProps = {
  src: string;
  alt?: string;
  size?: number;
  square?: boolean;
};

export function AvatarView({src, alt, size, square}: AvatarViewProps) {
  return <PrimerAvatar src={src} alt={alt} size={size} square={square} />;
}

/**
 * Catalog entry: the generic binder resolves props, then renders AvatarView. Avatar has
 * no ComponentId/Action row, so there is no buildChild/onClick — resolved values pass
 * straight through. Props are passed explicitly (no spread): resolved props include
 * extra binder setters that would leak as unknown props.
 */
export const AvatarComponent = createComponentImplementation(AvatarApi, ({props}) => (
  <AvatarView src={props.src} alt={props.alt} size={props.size} square={props.square} />
));
