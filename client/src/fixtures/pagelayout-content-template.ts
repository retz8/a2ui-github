import {root, headerRegion, surface} from './pagelayout-helpers';
import type {Fixture} from './types';

/**
 * Content — dynamic template (bound `ChildList`): the content region's `children` is a
 * `{componentId, path}` template. The binder expands `tpl` once per item in the bound `/items`
 * array, each in its own data scope, so the template `Text` resolves `{path: 'label'}` relative to
 * that item (a relative JSON pointer, no leading slash). Proves the region's bound-content path.
 */
export const pagelayoutContentTemplateFixture: Fixture = {
  name: 'pagelayout-content-template',
  messages: surface(
    'pagelayout-content-template',
    [
      root({header: 'h', content: 'c'}),
      ...headerRegion(),
      {id: 'c', component: 'PageLayout.Content', children: {componentId: 'tpl', path: '/items'}},
      {id: 'tpl', component: 'Text', text: {path: 'label'}},
    ],
    {items: [{label: 'Alpha'}, {label: 'Beta'}, {label: 'Gamma'}]},
  ),
};
