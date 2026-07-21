import {useState} from 'react';
import {FixtureView} from '../test-space/FixtureView';
import {EXAMPLES, getExample} from './examples';

function readExampleFromUrl(): string {
  if (typeof window === 'undefined') return EXAMPLES[0].name;
  return getExample(new URLSearchParams(window.location.search).get('example')).name;
}

/**
 * The examples dev oracle: a dropdown over the curated agent examples, showing one at a time. Each
 * example's natural-language intent renders as a caption directly above its surface, which is drawn
 * through the shared {@link FixtureView} — an example is a `Fixture` plus `intent`. No action
 * handler is wired (see task 7.8 decision 5): local `functionCall` actions run live, `event` actions
 * are inert (they emit to no subscriber), so the page has zero server dependency.
 */
export function ExamplesSpace() {
  const [selected, setSelected] = useState(readExampleFromUrl);

  // Normalize through getExample so an unknown ?example= falls back to the first.
  const example = getExample(selected);

  const onSelect = (name: string) => {
    setSelected(name);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('example', name);
      window.history.replaceState({}, '', url);
    }
  };

  return (
    <main>
      <label>
        Example:{' '}
        <select
          data-testid="example-select"
          value={example.name}
          onChange={e => onSelect(e.target.value)}
        >
          {EXAMPLES.map(e => (
            <option key={e.name} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>
      </label>

      <p data-testid="example-intent">{example.intent}</p>

      <FixtureView key={example.name} fixture={example} />
    </main>
  );
}
