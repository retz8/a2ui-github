/**
 * The canvas apply pipeline (task 8.2): every agent/replay message enters the canvas through
 * this, which enforces the 8.2 stage semantics — naive replace, delete-on-replace (live
 * registry ≡ canvas occupancy), last-createSurface-wins.
 */
import {describe, it, expect} from 'vitest';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {CATALOG, CATALOG_ID} from 'primer-a2ui-adapter';
import {createCanvasStore} from './canvasStore';
import {createCanvasApplier} from './canvasApplier';

function paint(surfaceId: string, text: string): A2uiMessage[] {
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'Text', text}],
      },
    },
  ] as unknown as A2uiMessage[];
}

function setup() {
  const processor = new MessageProcessor([CATALOG]);
  const store = createCanvasStore();
  const apply = createCanvasApplier({processor, store});
  return {processor, store, apply};
}

describe('createCanvasApplier', () => {
  it('a paint on an empty canvas takes the stage', () => {
    const {processor, store, apply} = setup();
    apply(paint('pull-request-list', 'PRs'));
    expect(store.getState().stageId).toBe('pull-request-list');
    expect(processor.model.getSurface('pull-request-list')).toBeTruthy();
  });

  it('bumps appliedSeq once per applied batch', () => {
    const {store, apply} = setup();
    apply(paint('a', 'first'));
    apply([]);
    expect(store.getState().appliedSeq).toBe(2);
  });

  it('last createSurface in a batch wins the stage; earlier ones are deleted', () => {
    const {processor, store, apply} = setup();
    apply([...paint('first-surface', 'one'), ...paint('second-surface', 'two')]);
    expect(store.getState().stageId).toBe('second-surface');
    expect(processor.model.getSurface('second-surface')).toBeTruthy();
    expect(processor.model.getSurface('first-surface')).toBeFalsy();
  });

  it('a later paint naively replaces the stage and deletes the outgoing surface', () => {
    const {processor, store, apply} = setup();
    apply(paint('old-stage', 'old'));
    apply(paint('new-stage', 'new'));
    expect(store.getState().stageId).toBe('new-stage');
    expect(processor.model.getSurface('old-stage')).toBeFalsy();
    expect(processor.model.getSurface('new-stage')).toBeTruthy();
  });

  it('a repaint of the same id keeps the stage on that id', () => {
    const {processor, store, apply} = setup();
    apply(paint('user-profile', 'v1'));
    apply(paint('user-profile', 'v2'));
    expect(store.getState().stageId).toBe('user-profile');
    expect(processor.model.getSurface('user-profile')).toBeTruthy();
  });

  it('reports a failing message to the store and still applies the rest', () => {
    const {processor, store, apply} = setup();
    const bad = {
      version: 'v0.9',
      updateComponents: {surfaceId: 'never-created', components: []},
    } as unknown as A2uiMessage;
    apply([bad, ...paint('survivor', 'still here')]);
    expect(store.getState().error).toBeTruthy();
    expect(store.getState().stageId).toBe('survivor');
    expect(processor.model.getSurface('survivor')).toBeTruthy();
  });
});
