import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The size enum on a single StateLabel; each surface's text is the size name and status is
// pinned to one value so size is the only differing axis.
const SIZES = ['small', 'medium'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `statelabel-size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'StateLabel', text: size, status: 'issueOpened', size},
        ],
      },
    },
  ];
}

export const statelabelSizeFixture: Fixture = {
  name: 'statelabel-size',
  messages: SIZES.flatMap(sizeSurface),
};
