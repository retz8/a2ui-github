import {BaseStyles, ThemeProvider} from '@primer/react';
import {TestSpace} from './test-space/TestSpace';

export function App() {
  return (
    <ThemeProvider>
      <BaseStyles>
        <TestSpace />
      </BaseStyles>
    </ThemeProvider>
  );
}
