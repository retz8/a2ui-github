import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * `items` breadth + both action shapes, plus the agent-visibility coupling. Packs every item-schema
 * variation into one authored array: a leading-icon item, a trailing-text item, a trailing-icon
 * item, a divider, a `danger` variant, a disabled item, and a nested submenu. Baselined in the
 * OPEN state (Playwright opens the menu before the screenshot).
 *
 * `Copy` emits the `copy` event. `ActionBar.Menu` has no self-bindable `Dynamic` prop (its `items`
 * are authored config), so the server's data-model write surfaces through a companion `Text`
 * (`menu-status`, `text <- /status`); the menu button's icon swap is self-visible. The two sit in a
 * horizontal `Stack` so both are on screen.
 */
export const actionBarMenuFixture: Fixture = {
  name: 'action-bar-menu',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'action-bar-menu', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar-menu',
        components: [
          {
            id: 'root',
            component: 'Stack',
            direction: 'horizontal',
            gap: 'condensed',
            align: 'center',
            children: ['menu', 'menu-status'],
          },
          {
            id: 'menu',
            component: 'ActionBar.Menu',
            icon: 'menu-icon',
            accessibility: {label: 'Actions'},
            items: [
              {
                label: 'Cut',
                leadingVisual: 'cut-icon',
                action: {
                  functionCall: {call: 'consoleLog', args: {message: 'cut'}, returnType: 'void'},
                },
              },
              {
                label: 'Copy',
                trailingVisual: '⌘C',
                action: {event: {name: 'copy', context: {}}},
              },
              {label: 'Paste', trailingVisual: 'paste-icon'},
              {type: 'divider'},
              {
                label: 'Delete',
                variant: 'danger',
                action: {
                  functionCall: {call: 'consoleLog', args: {message: 'delete'}, returnType: 'void'},
                },
              },
              {label: 'Archive', disabled: true},
              {
                label: 'More',
                leadingVisual: 'more-icon',
                items: [
                  {
                    label: 'Sub A',
                    action: {
                      functionCall: {
                        call: 'consoleLog',
                        args: {message: 'sub-a'},
                        returnType: 'void',
                      },
                    },
                  },
                  {label: 'Sub B'},
                ],
              },
            ],
          },
          {id: 'menu-icon', component: 'Icon', name: 'kebab-horizontal'},
          {id: 'cut-icon', component: 'Icon', name: 'diff'},
          {id: 'paste-icon', component: 'Icon', name: 'clock'},
          {id: 'more-icon', component: 'Icon', name: 'kebab-horizontal'},
          {id: 'menu-status', component: 'Text', text: {path: '/status'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'action-bar-menu', path: '/', value: {status: 'Ready'}},
    },
  ],
};
