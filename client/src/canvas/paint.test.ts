/**
 * The paint vocabulary (task 8.3): cause-derived in-flight labels — the permanent fallback
 * under the 8.5 agent-authored titles.
 */
import {describe, it, expect} from 'vitest';
import type {A2uiClientAction} from '@a2ui/web_core/v0_9';
import {describeCause} from './paint';

const action = (name: string, context: Record<string, unknown> = {}): A2uiClientAction => ({
  name,
  context,
  surfaceId: 'stage',
  sourceComponentId: 'root',
  timestamp: '2026-08-14T00:00:00Z',
});

describe('describeCause', () => {
  it('quotes an utterance', () => {
    expect(describeCause({kind: 'utterance', parent: null, payload: {text: 'show my PRs'}})).toBe(
      '“show my PRs” — generating…',
    );
  });

  it('truncates a long utterance', () => {
    const text = 'a'.repeat(80);
    const label = describeCause({kind: 'utterance', parent: null, payload: {text}});
    expect(label.length).toBeLessThan(70);
    expect(label).toMatch(/…” — generating…$/);
  });

  it('labels a surface action by its subject', () => {
    expect(
      describeCause({
        kind: 'surface-action',
        parent: 1,
        payload: {action: action('open-issue', {number: 117})},
      }),
    ).toBe('open issue #117 — generating…');
  });

  it('falls back to a generic label for an empty action', () => {
    expect(
      describeCause({kind: 'surface-action', parent: 1, payload: {action: action('')}}),
    ).toBe('Generating…');
  });

  it('labels an overlay answer by its question', () => {
    expect(
      describeCause({
        kind: 'overlay-answer',
        parent: 2,
        payload: {question: 'Which repository?', answer: action('confirm')},
      }),
    ).toBe('answered “Which repository?” — generating…');
  });

  it('labels an overlay answer by the action when the question is unknown', () => {
    expect(
      describeCause({kind: 'overlay-answer', parent: 2, payload: {answer: action('confirm')}}),
    ).toBe('confirm — generating…');
  });
});
