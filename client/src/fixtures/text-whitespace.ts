import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The whiteSpace enum on a single Text. Each surface's text is a multi-line string
// with runs of spaces and newlines so the collapse/preserve differences render.
const WHITE_SPACES = ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line'] as const;

// Leading spaces, a run of interior spaces, and an explicit newline — the content
// whose treatment visibly differs across the whiteSpace modes.
const SAMPLE = 'whiteSpace:    line one   with   spaces\nand a second line';

function whiteSpaceSurface(whiteSpace: (typeof WHITE_SPACES)[number]): A2uiMessage[] {
  const surfaceId = `text-whitespace-${whiteSpace}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Text', text: `${whiteSpace}\n${SAMPLE}`, whiteSpace}],
      },
    },
  ];
}

export const textWhitespaceFixture: Fixture = {
  name: 'text-whitespace',
  messages: WHITE_SPACES.flatMap(whiteSpaceSurface),
};
