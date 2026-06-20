import {useEffect, useState} from 'react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import type {ActionListener} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {PRIMER_CATALOG} from 'primer-a2ui-adapter';
import type {Fixture} from '../fixtures';

/** Renders every surface produced by one fixture's canned messages. */
export function FixtureView({
  fixture,
  actionHandler,
}: {
  fixture: Fixture;
  actionHandler?: ActionListener;
}) {
  const [processor] = useState(() => {
    // TODO(2.5): replace the injected dev-stub actionHandler with the real A2A
    // client middleware so `event` actions go out over the wire to the server.
    const p = new MessageProcessor([PRIMER_CATALOG], actionHandler);
    p.processMessages(fixture.messages);
    return p;
  });

  const [surfaces, setSurfaces] = useState(() => Array.from(processor.model.surfacesMap.values()));
  useEffect(() => {
    const sync = () => setSurfaces(Array.from(processor.model.surfacesMap.values()));
    const created = processor.onSurfaceCreated(sync);
    const deleted = processor.onSurfaceDeleted(sync);
    return () => {
      created.unsubscribe();
      deleted.unsubscribe();
    };
  }, [processor]);

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
