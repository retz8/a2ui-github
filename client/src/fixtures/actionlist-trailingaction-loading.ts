import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** `TrailingAction.loading` (boolean state): a realistic menu whose trailing action is loading. */
export const actionlistTrailingactionLoadingFixture: Fixture = {
  name: 'actionlist-trailingaction-loading',
  messages: surface('actionlist-trailingaction-loading', [
    {id: 'root', component: 'ActionList', role: 'menu', children: ['ta0', 'ta1']},
    {id: 'ta0', component: 'ActionList.Item', children: ['ta0-label', 'ta0-ta']},
    {id: 'ta0-label', component: 'Text', text: 'Deploy to production'},
    {
      id: 'ta0-ta',
      component: 'ActionList.TrailingAction',
      icon: 'ta0-ta-icon',
      label: 'Retry deploy',
      loading: true,
    },
    {id: 'ta0-ta-icon', component: 'Icon', name: 'sync'},
    {id: 'ta1', component: 'ActionList.Item', children: ['ta1-label']},
    {id: 'ta1-label', component: 'Text', text: 'View logs'},
  ]),
};
