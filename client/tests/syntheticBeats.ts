/**
 * Synthetic beat fixtures (task 8.3): hand-authored streams in the recorded `BeatFixture`
 * format for the cases the 8.1 recordings lack — a validation-failure turn (partial paint →
 * cleanup delete → final apology) and a question paint (`ConfirmationDialog` root). They are
 * deliberately NOT in `agent/recordings/beats/` and never enter `BEAT_FIXTURES`: they are
 * test inputs for the 8.3 transition gates, not recordings. Live confirmation of the agent
 * producing these shapes belongs to 8.6 (and 8.5's question prompting).
 */
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {BeatFixture} from '../src/beats/beatFixtures';

const msg = (m: Record<string, unknown>): A2uiMessage =>
  ({version: 'v0.9', ...m}) as unknown as A2uiMessage;

const base = {
  model: 'synthetic',
  recordedAt: '2026-08-14T00:00:00Z',
  contextId: 'ctx-synthetic',
  chainedFrom: null,
};

/**
 * The wire shape of a server-side validation failure, as the agent's `_teardown` produces it:
 * the partial paint streams, then the cleanup `deleteSurface`, then the apology prose.
 */
export const VALIDATION_FAILURE_BEAT: BeatFixture = {
  ...base,
  name: 'synthetic-validation-failure',
  beat: 101,
  title: 'Validation-failure turn',
  prompt: 'show me something the agent cannot build',
  turns: [
    {
      taskId: 'synthetic-failure',
      kind: 'utterance',
      prompt: 'show me something the agent cannot build',
      action: null,
      outcome: 'apology',
      durationMs: 300,
      batches: [
        {
          offsetMs: 0,
          messages: [msg({createSurface: {surfaceId: 'doomed-view', catalogId: CATALOG_ID}})],
          texts: [],
        },
        {
          offsetMs: 100,
          messages: [
            msg({
              updateComponents: {
                surfaceId: 'doomed-view',
                components: [{id: 'root', component: 'Text', text: 'half-built content'}],
              },
            }),
          ],
          texts: [],
        },
        {
          offsetMs: 200,
          messages: [msg({deleteSurface: {surfaceId: 'doomed-view'}})],
          texts: ['I could not build that view.'],
        },
      ],
    },
  ],
};

/** A question paint: a `ConfirmationDialog`-rooted surface — the overlay carrier. */
export const QUESTION_BEAT: BeatFixture = {
  ...base,
  name: 'synthetic-question',
  beat: 102,
  title: 'Question paint',
  prompt: 'do the ambiguous thing',
  turns: [
    {
      taskId: 'synthetic-question',
      kind: 'utterance',
      prompt: 'do the ambiguous thing',
      action: null,
      outcome: 'completed',
      durationMs: 200,
      batches: [
        {
          offsetMs: 0,
          messages: [msg({createSurface: {surfaceId: 'which-repo', catalogId: CATALOG_ID}})],
          texts: [],
        },
        {
          offsetMs: 100,
          messages: [
            msg({
              updateComponents: {
                surfaceId: 'which-repo',
                components: [
                  {
                    id: 'root',
                    component: 'ConfirmationDialog',
                    title: 'Which repository?',
                    confirmButtonContent: 'a2ui-project/a2ui',
                    cancelButtonContent: 'Somewhere else',
                    confirmAction: {event: {name: 'choose-a2ui-repo', context: {}}},
                    cancelAction: {event: {name: 'choose-other-repo', context: {}}},
                    children: ['body'],
                  },
                  {
                    id: 'body',
                    component: 'Text',
                    text: 'You have PRs in more than one repository.',
                  },
                ],
              },
            }),
          ],
          texts: [],
        },
      ],
    },
  ],
};
