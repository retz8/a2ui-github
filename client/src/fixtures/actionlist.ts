import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Composed baseline: the root `children` slot plus every container/content leaf's slot, assembled
 * into one realistic GitHub-triage `ActionList` (the `pageheader.md` composed-centered model). A
 * list `Heading`, two `Group`s each with a `GroupHeading`, `Item`s carrying `LeadingVisual` (Icon),
 * `Description`, `TrailingVisual` (CounterLabel), and `TrailingAction`, a `LinkItem`, and a
 * `Divider` between the groups.
 */
export const actionlistFixture: Fixture = {
  name: 'actionlist',
  messages: surface('actionlist', [
    {id: 'root', component: 'ActionList', children: ['heading', 'g1', 'div1', 'g2']},
    {id: 'heading', component: 'ActionList.Heading', text: 'Repository actions'},

    {id: 'g1', component: 'ActionList.Group', children: ['gh1', 'it1', 'it2', 'link1']},
    {
      id: 'gh1',
      component: 'ActionList.GroupHeading',
      as: 'h3',
      auxiliaryText: 'opened by octocat',
      children: ['gh1-label'],
    },
    {id: 'gh1-label', component: 'Text', text: 'Pull request #42'},

    {
      id: 'it1',
      component: 'ActionList.Item',
      children: ['it1-lv', 'it1-label', 'it1-desc', 'it1-tv'],
    },
    {id: 'it1-lv', component: 'ActionList.LeadingVisual', children: ['it1-icon']},
    {
      id: 'it1-icon',
      component: 'Icon',
      name: 'git-pull-request',
      accessibility: {label: 'pull request'},
    },
    {id: 'it1-label', component: 'Text', text: 'View pull request'},
    {
      id: 'it1-desc',
      component: 'ActionList.Description',
      text: 'opened 2 days ago',
      variant: 'inline',
    },
    {id: 'it1-tv', component: 'ActionList.TrailingVisual', children: ['it1-counter']},
    {id: 'it1-counter', component: 'CounterLabel', count: '3'},

    {id: 'it2', component: 'ActionList.Item', children: ['it2-label', 'it2-ta']},
    {id: 'it2-label', component: 'Text', text: 'Merge pull request'},
    {
      id: 'it2-ta',
      component: 'ActionList.TrailingAction',
      icon: 'it2-ta-icon',
      label: 'More options',
    },
    {id: 'it2-ta-icon', component: 'Icon', name: 'kebab-horizontal'},

    {
      id: 'link1',
      component: 'ActionList.LinkItem',
      href: 'https://github.com/octocat/repo',
      children: ['link1-lv', 'link1-label'],
    },
    {id: 'link1-lv', component: 'ActionList.LeadingVisual', children: ['link1-icon']},
    {
      id: 'link1-icon',
      component: 'Icon',
      name: 'link-external',
      accessibility: {label: 'external link'},
    },
    {id: 'link1-label', component: 'Text', text: 'Open on GitHub'},

    {id: 'div1', component: 'ActionList.Divider'},

    {id: 'g2', component: 'ActionList.Group', children: ['gh2', 'it3']},
    {id: 'gh2', component: 'ActionList.GroupHeading', as: 'h3', children: ['gh2-label']},
    {id: 'gh2-label', component: 'Text', text: 'Danger zone'},
    {id: 'it3', component: 'ActionList.Item', variant: 'danger', children: ['it3-lv', 'it3-label']},
    {id: 'it3-lv', component: 'ActionList.LeadingVisual', children: ['it3-icon']},
    {id: 'it3-icon', component: 'Icon', name: 'trash', accessibility: {label: 'delete'}},
    {id: 'it3-label', component: 'Text', text: 'Delete branch'},
  ]),
};
