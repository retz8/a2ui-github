import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {App} from './App';

afterEach(cleanup);

describe('App', () => {
  it('mounts the test space with a fixture selector', () => {
    render(<App />);
    expect(screen.getByTestId('fixture-select')).toBeInTheDocument();
  });
});
