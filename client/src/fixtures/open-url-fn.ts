import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * `openUrl` (task 7.9) on a button's action — the one adopted function matching the action-effect
 * shape the catalog's original five already use. It is how a surface leaves for github.com without
 * a round trip through the agent; navigation *within* the app stays an event.
 */
export const openUrlFnFixture: Fixture = {
  name: 'open-url-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'open-url-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'open-url-fn',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'open-label',
            action: {
              functionCall: {
                call: 'openUrl',
                args: {url: 'https://github.com/a2ui-project/a2ui/pull/1668'},
                returnType: 'void',
              },
            },
          },
          {id: 'open-label', component: 'Text', text: 'View on GitHub'},
        ],
      },
    },
  ],
};
