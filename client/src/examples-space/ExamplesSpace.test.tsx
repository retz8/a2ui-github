import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {ExamplesApp} from './ExamplesApp';
import {EXAMPLES} from './examples';

afterEach(cleanup);

describe('ExamplesSpace', () => {
  it('bundles the curated agent examples via import.meta.glob', () => {
    expect(EXAMPLES.length).toBeGreaterThan(0);
    const names = EXAMPLES.map(e => e.name);
    expect(new Set(names).size).toBe(EXAMPLES.length);
    for (const example of EXAMPLES) {
      expect(example.name).toBeTruthy();
      expect(example.intent).toBeTruthy();
    }
  });

  // Glob-driven and count-agnostic: every bundled example is driven through the page and asserted to
  // mount — its intent caption present, its surface rendered, no throw. Any example 7.7 adds is
  // covered automatically.
  it.each(EXAMPLES.map(e => e.name))('mounts the "%s" example through the page', name => {
    window.history.replaceState({}, '', `/?example=${name}`);
    render(<ExamplesApp />);

    const example = EXAMPLES.find(e => e.name === name)!;
    // The selector reflects the chosen example and its intent renders as the caption.
    expect(screen.getByTestId('example-select')).toHaveValue(name);
    expect(screen.getByTestId('example-intent')).toHaveTextContent(example.intent);
    // The surface mounted through the shared renderer.
    expect(screen.getByTestId('fixture-view')).toBeInTheDocument();
    expect(document.querySelector('[data-testid^="surface-"]')).not.toBeNull();
  });
});
