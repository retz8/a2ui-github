import {describe, it, expect, vi, afterEach} from 'vitest';
import {render, screen, cleanup, fireEvent} from '@testing-library/react';
import {ButtonView} from './button';

afterEach(cleanup);

describe('ButtonView', () => {
  it('renders its child content as the label', () => {
    render(<ButtonView>Save</ButtonView>);
    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
  });

  it('fires onClick when clicked (the resolved action)', () => {
    const onClick = vi.fn();
    render(<ButtonView onClick={onClick}>Save</ButtonView>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('passes variant and size to Primer as data-* attributes', () => {
    render(
      <ButtonView variant="primary" size="large">
        Save
      </ButtonView>,
    );
    const el = screen.getByRole('button');
    expect(el).toHaveAttribute('data-variant', 'primary');
    expect(el).toHaveAttribute('data-size', 'large');
  });

  it('honors disabled', () => {
    render(<ButtonView disabled>Save</ButtonView>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies accessibility label and description as aria-* attributes', () => {
    render(
      <ButtonView accessibility={{label: 'Submit form', description: 'Submits the data'}}>
        Save
      </ButtonView>,
    );
    const el = screen.getByRole('button', {name: 'Submit form'});
    expect(el).toHaveAttribute('aria-label', 'Submit form');
    expect(el).toHaveAttribute('aria-description', 'Submits the data');
  });
});
