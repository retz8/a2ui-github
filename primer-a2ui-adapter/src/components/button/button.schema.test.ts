import {describe, it, expect} from 'vitest';
import {ButtonApi} from './button.schema';

const action = {event: {name: 'submit'}};

describe('ButtonApi.schema', () => {
  it('accepts a minimal valid Button (child + action)', () => {
    expect(ButtonApi.schema.safeParse({child: 'label-1', action}).success).toBe(true);
  });

  it('accepts an event action', () => {
    expect(
      ButtonApi.schema.safeParse({child: 'l', action: {event: {name: 'submit'}}}).success,
    ).toBe(true);
  });

  it('accepts a functionCall action', () => {
    expect(
      ButtonApi.schema.safeParse({
        child: 'l',
        action: {functionCall: {call: 'consoleLog', args: {message: 'hi'}}},
      }).success,
    ).toBe(true);
  });

  it('accepts the full prop surface', () => {
    const result = ButtonApi.schema.safeParse({
      child: 'l',
      action,
      variant: 'primary',
      size: 'large',
      alignContent: 'center',
      disabled: true,
      loading: false,
      inactive: false,
      count: '5',
      block: true,
      labelWrap: true,
      loadingAnnouncement: 'Loading',
      accessibility: {label: 'Submit', description: 'Submits the form'},
    });
    expect(result.success).toBe(true);
  });

  it('requires child', () => {
    expect(ButtonApi.schema.safeParse({action}).success).toBe(false);
  });

  it('requires action', () => {
    expect(ButtonApi.schema.safeParse({child: 'l'}).success).toBe(false);
  });

  it('rejects unknown props (strict)', () => {
    expect(ButtonApi.schema.safeParse({child: 'l', action, color: 'red'}).success).toBe(false);
  });

  it('rejects out-of-enum variant', () => {
    expect(ButtonApi.schema.safeParse({child: 'l', action, variant: 'ghost'}).success).toBe(false);
  });

  it('accepts a data-binding for disabled (DynamicBoolean)', () => {
    expect(
      ButtonApi.schema.safeParse({child: 'l', action, disabled: {path: '/canSubmit'}}).success,
    ).toBe(true);
  });

  it('accepts accessibility label and description', () => {
    expect(
      ButtonApi.schema.safeParse({child: 'l', action, accessibility: {label: 'Submit'}}).success,
    ).toBe(true);
  });
});
