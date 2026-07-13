import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Mini-gallery: loading × loaderPosition. The indicator's position is only observable while
// loading is set, and the `auto` branch only differs when a leadingVisual is present — so the
// four surfaces are a semantically-coupled gallery.
const POSITIONS = ['auto', 'leading', 'trailing'] as const;

function positionSurface(loaderPosition: (typeof POSITIONS)[number]): A2uiMessage[] {
  const surfaceId = `textinput-loading-${loaderPosition}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'TextInput', value: 'octocat', loading: true, loaderPosition},
        ],
      },
    },
  ];
}

// Fourth surface: a leadingVisual paired with loading — under `auto` the spinner moves leading.
const leadingVisualSurface: A2uiMessage[] = [
  {
    version: 'v0.9',
    createSurface: {surfaceId: 'textinput-loading-leading-visual', catalogId: CATALOG_ID},
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'textinput-loading-leading-visual',
      components: [
        {
          id: 'root',
          component: 'TextInput',
          value: 'octocat',
          loading: true,
          loaderPosition: 'auto',
          leadingVisual: 'lv',
        },
        {id: 'lv', component: 'Icon', name: 'search'},
      ],
    },
  },
];

export const textinputLoadingFixture: Fixture = {
  name: 'textinput-loading',
  messages: [...POSITIONS.flatMap(positionSurface), ...leadingVisualSurface],
};
