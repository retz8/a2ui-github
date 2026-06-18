import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {App} from './App';

describe('client bootstrap', () => {
  it('renders the bootstrap heading through Primer', () => {
    render(<App />);
    expect(screen.getByRole('heading', {name: 'bootstrap OK'})).toBeInTheDocument();
  });
});
