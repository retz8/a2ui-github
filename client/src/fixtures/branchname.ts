import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const branchnameFixture: Fixture = {
  name: 'branchname',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'branchname', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'branchname',
        components: [
          {
            id: 'root',
            component: 'BranchName',
            text: 'main',
            href: 'https://github.com/a2ui-project/a2ui/tree/main',
          },
        ],
      },
    },
  ],
};
