import {useEffect, useState} from 'react';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {FIXTURES, getFixture} from '../fixtures';
import type {Fixture} from '../fixtures';
import {FixtureView} from './FixtureView';

function readFixtureFromUrl(): string {
  if (typeof window === 'undefined') return FIXTURES[0].name;
  return getFixture(new URLSearchParams(window.location.search).get('fixture')).name;
}

export function TestSpace({
  makeActionHandler,
}: {
  makeActionHandler?: (apply: (messages: A2uiMessage[]) => void) => ActionListener;
} = {}) {
  const [selected, setSelected] = useState(readFixtureFromUrl);
  // Only the selected fixture's body is imported (on demand); the selector below is populated
  // from the cheap name list without pulling in any fixture body.
  const [fixture, setFixture] = useState<Fixture | null>(null);

  // Normalize the selection through getFixture so an unknown ?fixture= falls back to the first.
  const entry = getFixture(selected);

  useEffect(() => {
    let active = true;
    entry.load().then(loaded => {
      if (active) setFixture(loaded);
    });
    return () => {
      active = false;
    };
  }, [entry]);

  const onSelect = (name: string) => {
    setSelected(name);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('fixture', name);
      window.history.replaceState({}, '', url);
    }
  };

  return (
    <main>
      <label>
        Fixture:{' '}
        <select
          data-testid="fixture-select"
          value={entry.name}
          onChange={e => onSelect(e.target.value)}
        >
          {FIXTURES.map(f => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </label>

      {fixture && (
        <FixtureView key={fixture.name} fixture={fixture} makeActionHandler={makeActionHandler} />
      )}
    </main>
  );
}
