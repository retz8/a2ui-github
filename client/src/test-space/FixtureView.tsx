import {useState} from 'react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {CATALOG} from 'primer-a2ui-adapter';
import {useSurfaces} from '../a2ui/useSurfaces';
import type {Fixture} from '../fixtures';

/** Renders every surface produced by one fixture's canned messages. */
export function FixtureView({
  fixture,
  makeActionHandler,
}: {
  fixture: Fixture;
  makeActionHandler?: (apply: (messages: A2uiMessage[]) => void) => ActionListener;
}) {
  const [processor] = useState(() => {
    // Late-binding: `apply` reaches the processor that is created right below.
    // The handler only fires on a click, long after construction, so the
    // temporal cycle is harmless.
    // eslint-disable-next-line prefer-const
    let target: {processMessages: (m: A2uiMessage[]) => void} | undefined;
    const apply = (messages: A2uiMessage[]) => target?.processMessages(messages);
    const handler = makeActionHandler?.(apply);
    const p = new MessageProcessor([CATALOG], handler);
    target = p;
    p.processMessages(fixture.messages);
    return p;
  });

  const surfaces = useSurfaces(processor);

  return (
    <div data-testid="fixture-view">
      {surfaces.map(surface => (
        <div key={surface.id} data-testid={`surface-${surface.id}`}>
          <A2uiSurface surface={surface} />
        </div>
      ))}
    </div>
  );
}
