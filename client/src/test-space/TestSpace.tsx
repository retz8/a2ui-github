import {useCallback, useState} from 'react';
import type {ActionListener} from '@a2ui/web_core/v0_9';
import {FIXTURES, getFixture} from '../fixtures';
import {FixtureView} from './FixtureView';

function readFixtureFromUrl(): string {
  if (typeof window === 'undefined') return FIXTURES[0].name;
  return getFixture(new URLSearchParams(window.location.search).get('fixture')).name;
}

export function TestSpace({actionHandler}: {actionHandler?: ActionListener} = {}) {
  const [selected, setSelected] = useState(readFixtureFromUrl);
  const [events, setEvents] = useState<string[]>([]);

  // Default dev stub: record + log dispatched events so the manual/Chrome check
  // can see the event path fire. Tests pass their own actionHandler instead.
  const recorder = useCallback<ActionListener>(action => {
    const line = JSON.stringify(action);
    console.log('[A2UI:event]', line);
    setEvents(prev => [...prev, line]);
  }, []);
  const effectiveHandler = actionHandler ?? recorder;

  const onSelect = (name: string) => {
    setSelected(name);
    setEvents([]);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('fixture', name);
      window.history.replaceState({}, '', url);
    }
  };

  const fixture = getFixture(selected);

  return (
    <main>
      <label>
        Fixture:{' '}
        <select
          data-testid="fixture-select"
          value={fixture.name}
          onChange={e => onSelect(e.target.value)}
        >
          {FIXTURES.map(f => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </label>

      <FixtureView key={fixture.name} fixture={fixture} actionHandler={effectiveHandler} />

      {!actionHandler && (
        <ul data-testid="event-log">
          {events.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
