import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * The family's `ChildList` dynamic-template proof: breadcrumbs are the most naturally data-driven
 * repeated list. `children` is a `{componentId, path}` template; the binder expands `crumb` once
 * per item in the bound `/trail` array, each in its own data scope, so the template Link resolves
 * `{path: 'label'}`/`{path: 'url'}` relative to that item (a relative JSON pointer, no leading
 * slash — the proven form used by the shipped AvatarStack template).
 */
export const breadcrumbsTemplateFixture: Fixture = {
  name: 'breadcrumbs-template',
  messages: surface(
    'breadcrumbs-template',
    [
      {
        id: 'root',
        component: 'PageHeader.Breadcrumbs',
        children: {componentId: 'crumb', path: '/trail'},
      },
      {id: 'crumb', component: 'Link', text: {path: 'label'}, href: {path: 'url'}},
    ],
    {
      trail: [
        {label: 'Repos', url: '/repos'},
        {label: 'octo/acme', url: '/repos/acme'},
        {label: 'Issues', url: '/repos/acme/issues'},
      ],
    },
  ),
};
