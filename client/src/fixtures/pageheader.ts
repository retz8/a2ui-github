import {surface, type Comp} from './stack-helpers';
import type {Fixture} from './types';

const noop = {event: {name: 'noop', context: {}}};

/**
 * The family's composed baseline: a fully assembled PageHeader built from already-shipped filler
 * leaves (Text, Heading, Button, IconButton, Icon, Label, Link) that visually exercises every
 * container leaf's `children` slot at once — all 14 subcomponent leaves present. The dev-only
 * "interactive items in TitleArea" focus-order warning may fire for this busy assembly; it does
 * not affect the render or the baseline.
 */
const components: Comp[] = [
  {
    id: 'root',
    component: 'PageHeader',
    'aria-label': 'Pull request header',
    children: ['ctx', 'ta', 'bc', 'desc', 'nav'],
  },

  // ContextArea: ParentLink + ContextBar(Text) + ContextAreaActions(IconButton)
  {id: 'ctx', component: 'PageHeader.ContextArea', children: ['plink', 'cbar', 'cactions']},
  {id: 'plink', component: 'PageHeader.ParentLink', text: 'Issues', href: '/repos/acme/issues'},
  {id: 'cbar', component: 'PageHeader.ContextBar', children: ['cbar-text']},
  {id: 'cbar-text', component: 'Text', text: 'octo/acme'},
  {id: 'cactions', component: 'PageHeader.ContextAreaActions', children: ['cactions-ib']},
  {
    id: 'cactions-ib',
    component: 'IconButton',
    icon: 'cactions-icon',
    accessibility: {label: 'More'},
    action: noop,
  },
  {id: 'cactions-icon', component: 'Icon', name: 'kebab-horizontal'},

  // TitleArea (variant medium): LeadingAction, LeadingVisual, Title, TrailingVisual, TrailingAction, Actions
  {
    id: 'ta',
    component: 'PageHeader.TitleArea',
    variant: 'medium',
    children: ['la', 'lv', 'title', 'tv', 'tract', 'acts'],
  },
  {id: 'la', component: 'PageHeader.LeadingAction', children: ['la-ib']},
  {
    id: 'la-ib',
    component: 'IconButton',
    icon: 'la-icon',
    accessibility: {label: 'Back'},
    action: noop,
  },
  {id: 'la-icon', component: 'Icon', name: 'arrow-left'},
  {id: 'lv', component: 'PageHeader.LeadingVisual', children: ['lv-icon']},
  {id: 'lv-icon', component: 'Icon', name: 'git-pull-request'},
  {id: 'title', component: 'PageHeader.Title', text: 'Pull request #42'},
  {id: 'tv', component: 'PageHeader.TrailingVisual', children: ['tv-label']},
  {id: 'tv-label', component: 'Label', text: 'Open', variant: 'success'},
  {id: 'tract', component: 'PageHeader.TrailingAction', children: ['tract-ib']},
  {
    id: 'tract-ib',
    component: 'IconButton',
    icon: 'tract-icon',
    accessibility: {label: 'Edit'},
    action: noop,
  },
  {id: 'tract-icon', component: 'Icon', name: 'pencil'},
  {id: 'acts', component: 'PageHeader.Actions', children: ['acts-edit', 'acts-new']},
  {id: 'acts-edit', component: 'Button', child: 'acts-edit-label', action: noop},
  {id: 'acts-edit-label', component: 'Text', text: 'Edit'},
  {id: 'acts-new', component: 'Button', child: 'acts-new-label', variant: 'primary', action: noop},
  {id: 'acts-new-label', component: 'Text', text: 'New'},

  // Breadcrumbs (Link x2)
  {id: 'bc', component: 'PageHeader.Breadcrumbs', children: ['bc1', 'bc2']},
  {id: 'bc1', component: 'Link', text: 'octo/acme', href: '/repos/acme'},
  {id: 'bc2', component: 'Link', text: 'Issues', href: '/repos/acme/issues'},

  // Description (Text)
  {id: 'desc', component: 'PageHeader.Description', children: ['desc-text']},
  {id: 'desc-text', component: 'Text', text: 'Updates the heading cleanup across the docs.'},

  // Navigation (Link x3)
  {
    id: 'nav',
    component: 'PageHeader.Navigation',
    as: 'nav',
    'aria-label': 'Pull request navigation',
    children: ['nav1', 'nav2', 'nav3'],
  },
  {id: 'nav1', component: 'Link', text: 'Conversation', href: '#conversation'},
  {id: 'nav2', component: 'Link', text: 'Commits', href: '#commits'},
  {id: 'nav3', component: 'Link', text: 'Files changed', href: '#files'},
];

export const pageheaderFixture: Fixture = {
  name: 'pageheader',
  messages: surface('pageheader', components),
};
