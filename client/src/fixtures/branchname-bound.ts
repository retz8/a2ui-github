import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const branchnameBoundFixture: Fixture = {
  name: 'branchname-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'branchname-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'branchname-bound',
        components: [{id: 'root', component: 'BranchName', text: {path: '/branch'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'branchname-bound',
        path: '/',
        value: {branch: 'feature/login'},
      },
    },
  ],
};
