/**
 * Pins the renderer behaviour that `SurfaceErrorBoundary`'s recovery exists for.
 *
 * A streamed surface is rendered mid-parse, so `updateComponents` can carry a component whose
 * function-call-valued prop has `call` but not yet `args`. The renderer's binder resolves that
 * prop eagerly and throws `TypeError: Cannot convert undefined or null to object`
 * (`DataContext.resolveSignal` -> `Object.entries(undefined)`). The window is milliseconds long;
 * the next message completes the component.
 *
 * Found live in task 7.7, beat 5 round 2: a surface that renders perfectly when complete showed
 * "This view failed to render." for the whole session, because the boundary latched. The controls
 * below are the reason the surface itself was exonerated — complete function-call props render in
 * every application order.
 */
import {describe, it, expect} from 'vitest';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {CATALOG, CATALOG_ID} from 'primer-a2ui-adapter';
import {useSurfaces} from '../src/a2ui/useSurfaces';
import {renderWithPrimer} from './helpers';

function makeProcessor() {
  return new MessageProcessor([CATALOG]);
}
type Processor = ReturnType<typeof makeProcessor>;

function View({processor}: {processor: Processor}) {
  const surfaces = useSurfaces(processor);
  return (
    <div>
      {surfaces.map(s => (
        <A2uiSurface key={s.id} surface={s} />
      ))}
    </div>
  );
}

const create = {version: 'v0.9', createSurface: {surfaceId: 's', catalogId: CATALOG_ID}};
const dataModel = {
  version: 'v0.9',
  updateDataModel: {surfaceId: 's', path: '/', value: {title: 'Hello', number: 2124, draft: ''}},
};

function components(root: Record<string, unknown>) {
  return {version: 'v0.9', updateComponents: {surfaceId: 's', components: [root]}};
}

/** Streaming order: create + components first, data model after — as `applyA2uiMessages` does. */
function renderStreamed(root: Record<string, unknown>, withDataModel = false) {
  const p = makeProcessor();
  p.processMessages([create] as unknown as A2uiMessage[]);
  p.processMessages([components(root)] as unknown as A2uiMessage[]);
  if (withDataModel) p.processMessages([dataModel] as unknown as A2uiMessage[]);
  return renderWithPrimer(<View processor={p} />);
}

const COMPLETE_FORMAT_STRING = {
  id: 'root',
  component: 'Text',
  text: {call: 'formatString', args: {value: '${/title} #${/number}'}, returnType: 'string'},
};

const COMPLETE_VALIDATION = {
  id: 'root',
  component: 'Button',
  child: 'lbl',
  disabled: {
    call: 'not',
    args: {value: {call: 'required', args: {value: {path: '/draft'}}, returnType: 'boolean'}},
    returnType: 'boolean',
  },
};

describe('complete function-call props render', () => {
  it('formatString, data model already applied', () => {
    const {container} = renderStreamed(COMPLETE_FORMAT_STRING, true);
    expect(container.textContent).toContain('Hello');
  });

  it('formatString, rendered before its data model arrives', () => {
    expect(() => renderStreamed(COMPLETE_FORMAT_STRING)).not.toThrow();
  });

  it('not(required(path)) on a Button, rendered before its data model arrives', () => {
    expect(() => renderStreamed(COMPLETE_VALIDATION)).not.toThrow();
  });
});

describe('half-parsed function-call props throw in the binder', () => {
  it('formatString with `call` but no `args`', () => {
    expect(() =>
      renderStreamed({
        id: 'root',
        component: 'Text',
        text: {call: 'formatString', returnType: 'string'},
      }),
    ).toThrow(/Cannot convert undefined or null to object/);
  });

  it('a validation chain with `call` but no `args`', () => {
    expect(() =>
      renderStreamed({
        id: 'root',
        component: 'Button',
        child: 'lbl',
        disabled: {call: 'not', returnType: 'boolean'},
      }),
    ).toThrow(/Cannot convert undefined or null to object/);
  });
});
