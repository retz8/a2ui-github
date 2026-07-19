import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {App} from './App';

afterEach(cleanup);

describe('App', () => {
  it('mounts the chat shell with a prompt box and send button', () => {
    render(<App />);
    expect(screen.getByRole('textbox', {name: /prompt/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /send/i})).toBeInTheDocument();
  });
});
