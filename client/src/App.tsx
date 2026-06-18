import {BaseStyles, Heading, Text, ThemeProvider} from '@primer/react';
import {PRIMER_CATALOG_ID} from 'primer-a2ui-adapter';

export function App() {
  return (
    <ThemeProvider>
      <BaseStyles>
        <Heading as="h1">bootstrap OK</Heading>
        <Text>Adapter catalog: {PRIMER_CATALOG_ID}</Text>
      </BaseStyles>
    </ThemeProvider>
  );
}
