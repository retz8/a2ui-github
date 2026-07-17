import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

/** An `ActionBar.IconButton` (`id`) plus its `Icon` (`${id}-icon`); a harmless local `consoleLog`
 * satisfies the required `action`, and the required `accessibility.label` doubles as the tooltip. */
function iconButton(id: string, label: string, icon: string): Array<Record<string, unknown>> {
  return [
    {
      id,
      component: 'ActionBar.IconButton',
      icon: `${id}-icon`,
      accessibility: {label},
      action: {functionCall: {call: 'consoleLog', args: {message: id}, returnType: 'void'}},
    },
    {id: `${id}-icon`, component: 'Icon', name: icon},
  ];
}

/**
 * Base fixture: a static `ChildList` in a default `ActionBar` (`size: medium`, `gap: condensed`,
 * `flush: false`). Three `ActionBar.IconButton`s split by an `ActionBar.Divider`.
 */
export const actionBarFixture: Fixture = {
  name: 'action-bar',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'action-bar', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar',
        components: [
          {
            id: 'root',
            component: 'ActionBar',
            accessibility: {label: 'Formatting'},
            children: ['b1', 'b2', 'div1', 'b3'],
          },
          ...iconButton('b1', 'Bold', 'bold'),
          ...iconButton('b2', 'Italic', 'italic'),
          {id: 'div1', component: 'ActionBar.Divider'},
          ...iconButton('b3', 'Strikethrough', 'strikethrough'),
        ],
      },
    },
  ] as A2uiMessage[],
};
