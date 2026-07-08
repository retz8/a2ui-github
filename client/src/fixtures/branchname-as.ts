import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The `as` (rendering element) enum on a single BranchName: an anchor when the branch
// name navigates, a plain span when the reference is contextual. Each surface's text is
// the tag name it renders as.
const AS = ['a', 'span'] as const;

function asSurface(as: (typeof AS)[number]): A2uiMessage[] {
  const surfaceId = `branchname-as-${as}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'BranchName', text: as, as}],
      },
    },
  ];
}

export const branchnameAsFixture: Fixture = {
  name: 'branchname-as',
  messages: AS.flatMap(asSurface),
};
