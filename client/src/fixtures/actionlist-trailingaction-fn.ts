import {surface} from './stack-helpers';
import {labelItem} from './actionlist-helpers';
import type {Fixture} from './types';

/**
 * `TrailingAction.action` — functionCall (local): a realistic menu whose row carries a trailing
 * action (a kebab overflow button) that runs the registered `consoleLog` locally when clicked.
 */
export const actionlistTrailingactionFnFixture: Fixture = {
  name: 'actionlist-trailingaction-fn',
  messages: surface('actionlist-trailingaction-fn', [
    {id: 'root', component: 'ActionList', role: 'menu', children: ['t0', 't1']},
    ...labelItem('t0', 'octocat', {children: ['t0-label', 't0-ta']}),
    {
      id: 't0-ta',
      component: 'ActionList.TrailingAction',
      icon: 't0-ta-icon',
      label: 'More options',
      action: {
        functionCall: {call: 'consoleLog', args: {message: 'trailing action'}, returnType: 'void'},
      },
    },
    {id: 't0-ta-icon', component: 'Icon', name: 'kebab-horizontal'},
    ...labelItem('t1', 'hubot'),
  ]),
};
