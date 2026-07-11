import {describe, it, expect, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import {StateLabelView} from './statelabel';

afterEach(cleanup);

describe('StateLabelView', () => {
  it('renders the status text content', () => {
    render(<StateLabelView text="Open" status="issueOpened" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('stamps the status onto the rendered badge', () => {
    render(<StateLabelView text="Merged" status="pullMerged" />);
    // Primer stamps the resolved status onto the visible span as data-status.
    expect(screen.getByText('Merged')).toHaveAttribute('data-status', 'pullMerged');
  });

  it('renders the medium size by default', () => {
    render(<StateLabelView text="Open" status="issueOpened" />);
    expect(screen.getByText('Open')).toHaveAttribute('data-size', 'medium');
  });

  it('honors the size prop', () => {
    render(<StateLabelView text="Open" status="issueOpened" size="small" />);
    expect(screen.getByText('Open')).toHaveAttribute('data-size', 'small');
  });
});
