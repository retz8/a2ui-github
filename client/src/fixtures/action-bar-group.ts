import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const BUTTONS = [
  ['b1', 'Bold', 'bold'],
  ['b2', 'Italic', 'italic'],
  ['b3', 'Strikethrough', 'strikethrough'],
] as const;

/** Content — static `ChildList` on `ActionBar.Group`: three `ActionBar.IconButton`s grouped
 * together. Renders standalone (the overflow registry no-ops without an `ActionBar` parent); the
 * dynamic-template form of the identical slot is proven on the container. */
export const actionBarGroupFixture: Fixture = {
  name: 'action-bar-group',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'action-bar-group', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar-group',
        components: [
          {id: 'root', component: 'ActionBar.Group', children: BUTTONS.map(([id]) => id)},
          ...BUTTONS.flatMap(([id, label, icon]) => [
            {
              id,
              component: 'ActionBar.IconButton',
              icon: `${id}-icon`,
              accessibility: {label},
              action: {functionCall: {call: 'consoleLog', args: {message: id}, returnType: 'void'}},
            },
            {id: `${id}-icon`, component: 'Icon', name: icon},
          ]),
        ],
      },
    },
  ] as A2uiMessage[],
};
