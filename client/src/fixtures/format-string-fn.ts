import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * `formatString` (task 7.9) composing a bound label from live data, alongside a two-way-bound
 * `TextInput` over the same path. Typing in the input rewrites the heading with no agent round
 * trip — the renderer-level proof that the function's computed signal actually subscribes and
 * repaints, which a unit test against a stubbed data context cannot give.
 *
 * The template also nests `pluralize`, since a function call is a valid `${...}` expression: one
 * label, live data, and agreement handled on the client.
 */
export const formatStringFnFixture: Fixture = {
  name: 'format-string-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'format-string-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'format-string-fn',
        components: [
          {
            id: 'root',
            component: 'Stack',
            direction: 'vertical',
            gap: 'normal',
            children: ['title', 'summary', 'editor'],
          },
          {
            id: 'title',
            component: 'Heading',
            // A function bound as a VALUE is the bare FunctionCall; the `{functionCall: ...}`
            // wrapper is the Action envelope and belongs only on action props.
            text: {call: 'formatString', args: {value: '${/pr/title}'}, returnType: 'string'},
            variant: 'medium',
          },
          {
            id: 'summary',
            component: 'Text',
            text: {
              call: 'formatString',
              args: {
                value:
                  "${/pr/repo} — ${/pr/comments} ${pluralize(value: ${/pr/comments}, one: 'comment', other: 'comments')}",
              },
              returnType: 'string',
            },
          },
          {
            id: 'editor',
            component: 'TextInput',
            value: {path: '/pr/title'},
            placeholder: 'Pull request title',
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'format-string-fn',
        path: '/',
        value: {pr: {title: 'Fix heading levels', repo: 'a2ui-project/a2ui', comments: 3}},
      },
    },
  ],
};
