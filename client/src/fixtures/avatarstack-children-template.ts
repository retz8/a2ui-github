import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';
import {avatarPlaceholder, AVATAR_COLORS} from './avatarstack-helpers';

/**
 * Dynamic-template ChildList: `children` is a `{componentId, path}` template. The binder expands
 * `tpl` once per item in the bound `/users` array, each in its own data scope, so the template
 * Avatar resolves `{path: 'avatarUrl'}`/`{path: 'name'}` relative to that item (a relative JSON
 * pointer, no leading slash). Proves the container's bound-content path.
 */
export const avatarstackChildrenTemplateFixture: Fixture = {
  name: 'avatarstack-children-template',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'avatarstack-children-template', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'avatarstack-children-template',
        components: [
          {
            id: 'root',
            component: 'AvatarStack',
            children: {componentId: 'tpl', path: '/users'},
          },
          {id: 'tpl', component: 'Avatar', src: {path: 'avatarUrl'}, alt: {path: 'name'}},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'avatarstack-children-template',
        path: '/',
        value: {
          users: [
            {avatarUrl: avatarPlaceholder(AVATAR_COLORS[0]), name: 'Mona'},
            {avatarUrl: avatarPlaceholder(AVATAR_COLORS[1]), name: 'Hubot'},
            {avatarUrl: avatarPlaceholder(AVATAR_COLORS[2]), name: 'Octo'},
            {avatarUrl: avatarPlaceholder(AVATAR_COLORS[3]), name: 'Bender'},
          ],
        },
      },
    },
  ],
};
