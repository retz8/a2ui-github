import {describe, it, expect} from 'vitest';
import {RelativeTimeApi} from './relative-time.schema';

describe('RelativeTimeApi.schema', () => {
  it('accepts a minimal valid RelativeTime (datetime only)', () => {
    expect(RelativeTimeApi.schema.safeParse({datetime: '2025-01-01T12:00:00Z'}).success).toBe(true);
  });

  it('accepts the full carried surface', () => {
    const result = RelativeTimeApi.schema.safeParse({
      datetime: '2025-01-01T12:00:00Z',
      format: 'datetime',
      formatStyle: 'short',
      tense: 'past',
      precision: 'month',
      threshold: 'P1Y',
      prefix: 'updated',
      second: '2-digit',
      minute: '2-digit',
      hour: '2-digit',
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZoneName: 'short',
      noTitle: true,
    });
    expect(result.success).toBe(true);
  });

  it('requires datetime', () => {
    expect(RelativeTimeApi.schema.safeParse({format: 'relative'}).success).toBe(false);
  });

  it('rejects unknown props (strict)', () => {
    expect(
      RelativeTimeApi.schema.safeParse({datetime: '2025-01-01T12:00:00Z', color: 'red'}).success,
    ).toBe(false);
  });

  it('rejects out-of-enum format', () => {
    expect(
      RelativeTimeApi.schema.safeParse({datetime: '2025-01-01T12:00:00Z', format: 'elapsed'})
        .success,
    ).toBe(false);
  });

  it('rejects out-of-enum precision', () => {
    expect(
      RelativeTimeApi.schema.safeParse({datetime: '2025-01-01T12:00:00Z', precision: 'decade'})
        .success,
    ).toBe(false);
  });

  it('accepts a data-binding for datetime (DynamicString)', () => {
    expect(RelativeTimeApi.schema.safeParse({datetime: {path: '/timestamp'}}).success).toBe(true);
  });
});
