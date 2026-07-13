import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// One TextInput.Action per tooltipDirection enum value. The tooltip is invisible at rest, so this
// gallery is loaded live and hovered for manual review (not baselined).
const DIRECTIONS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;

function directionSurface(tooltipDirection: (typeof DIRECTIONS)[number]): A2uiMessage[] {
  const surfaceId = `textinput-action-tooltip-${tooltipDirection}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'TextInput.Action',
            icon: 'glyph',
            tooltipDirection,
            accessibility: {label: tooltipDirection},
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: tooltipDirection},
                returnType: 'void',
              },
            },
          },
          {id: 'glyph', component: 'Icon', name: 'search'},
        ],
      },
    },
  ];
}

export const textinputActionTooltipFixture: Fixture = {
  name: 'textinput-action-tooltip',
  messages: DIRECTIONS.flatMap(directionSurface),
};
