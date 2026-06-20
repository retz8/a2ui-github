import {describe, it, expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {z} from 'zod';
import {TextApi} from './components/text';
import {consoleLog} from './functions/console-log';

const catalog = JSON.parse(
  readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), '../catalogs/v0.9.1/catalog.json'),
    'utf8',
  ),
) as {
  components: Record<string, {properties: Record<string, {enum?: string[]}>; required: string[]}>;
  functions: Record<string, {args: {properties: Record<string, unknown>}}>;
  $defs: {anyComponent: {oneOf: {$ref: string}[]}; anyFunction: {oneOf: {$ref: string}[]}};
};

// Envelope fields the framework owns; present in catalog.json but never in the props-only zod schema.
const ENVELOPE_FIELDS = ['component', 'id'];

function unwrap(field: z.ZodTypeAny): z.ZodTypeAny {
  let f = field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  while (f instanceof z.ZodOptional || f instanceof z.ZodDefault) {
    f = f instanceof z.ZodOptional ? f.unwrap() : (f._def as any).innerType;
  }
  return f;
}

function enumValues(field: z.ZodTypeAny): string[] | null {
  const f = unwrap(field);
  return f instanceof z.ZodEnum ? [...f.options] : null;
}

function refName(ref: string): string {
  return ref.split('/').pop() as string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const textShape = (TextApi.schema as z.ZodObject<any>).shape as Record<string, z.ZodTypeAny>;

describe('Text: zod ↔ catalog.json parity', () => {
  const jsonProps = catalog.components.Text.properties;
  const jsonPropNames = Object.keys(jsonProps).filter((k) => !ENVELOPE_FIELDS.includes(k));

  it('property-name sets match (excluding envelope fields)', () => {
    expect(jsonPropNames.sort()).toEqual(Object.keys(textShape).sort());
  });

  it('required sets match (excluding envelope fields)', () => {
    const jsonRequired = catalog.components.Text.required
      .filter((k) => !ENVELOPE_FIELDS.includes(k))
      .sort();
    const zodRequired = Object.entries(textShape)
      .filter(([, v]) => !v.isOptional())
      .map(([k]) => k)
      .sort();
    expect(jsonRequired).toEqual(zodRequired);
  });

  it('enum value sets match per styling prop', () => {
    for (const key of ['as', 'size', 'weight', 'whiteSpace']) {
      const zodEnum = enumValues(textShape[key]);
      expect(zodEnum, `zod enum for ${key}`).not.toBeNull();
      const jsonEnum = jsonProps[key]?.enum ?? [];
      expect([...jsonEnum].sort(), `json enum for ${key}`).toEqual([...(zodEnum as string[])].sort());
    }
  });

  it('anyComponent oneOf covers exactly the declared components', () => {
    const refNames = catalog.$defs.anyComponent.oneOf.map((r) => refName(r.$ref)).sort();
    expect(refNames).toEqual(Object.keys(catalog.components).sort());
  });
});

describe('consoleLog: zod ↔ catalog.json parity', () => {
  it('function name appears in functions and anyFunction', () => {
    expect(Object.keys(catalog.functions)).toContain(consoleLog.name);
    const refNames = catalog.$defs.anyFunction.oneOf.map((r) => refName(r.$ref));
    expect(refNames).toContain(consoleLog.name);
  });

  it('arg-name sets match', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zodArgs = Object.keys((consoleLog.schema as z.ZodObject<any>).shape).sort();
    const jsonArgs = Object.keys(catalog.functions.consoleLog.args.properties).sort();
    expect(jsonArgs).toEqual(zodArgs);
  });
});
