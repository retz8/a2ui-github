import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {DevApp} from './DevApp';

afterEach(cleanup);

describe('DevApp', () => {
  it('mounts the test space with a fixture selector', () => {
    render(<DevApp />);
    expect(screen.getByTestId('fixture-select')).toBeInTheDocument();
  });
});
