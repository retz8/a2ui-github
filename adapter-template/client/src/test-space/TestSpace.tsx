import {useState} from 'react';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {FIXTURES, getFixture} from '../fixtures';
import {FixtureView} from './FixtureView';

function readFixtureFromUrl(): string | undefined {
  if (typeof window === 'undefined') return FIXTURES[0]?.name;
  const param = new URLSearchParams(window.location.search).get('fixture');
  return getFixture(param)?.name;
}

export function TestSpace({
  makeActionHandler,
}: {
  makeActionHandler?: (apply: (messages: A2uiMessage[]) => void) => ActionListener;
} = {}) {
  const [selected, setSelected] = useState(readFixtureFromUrl);

  const onSelect = (name: string) => {
    setSelected(name);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('fixture', name);
      window.history.replaceState({}, '', url);
    }
  };

  const fixture = getFixture(selected ?? null);

  return (
    <main>
      <label>
        Fixture:{' '}
        <select
          data-testid="fixture-select"
          value={fixture?.name ?? ''}
          onChange={e => onSelect(e.target.value)}
        >
          {FIXTURES.map(f => (
            <option key={f.name} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>
      </label>

      {fixture ? (
        <FixtureView key={fixture.name} fixture={fixture} makeActionHandler={makeActionHandler} />
      ) : (
        <p data-testid="no-fixtures">
          No fixtures yet — add one in <code>src/fixtures/</code>.
        </p>
      )}
    </main>
  );
}
