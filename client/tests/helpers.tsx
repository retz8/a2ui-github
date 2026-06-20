import type {ReactElement} from 'react';
import {render} from '@testing-library/react';
import {BaseStyles, ThemeProvider} from '@primer/react';
import {FixtureView} from '../src/test-space/FixtureView';
import type {Fixture} from '../src/fixtures';

export function renderWithPrimer(ui: ReactElement) {
  return render(
    <ThemeProvider>
      <BaseStyles>{ui}</BaseStyles>
    </ThemeProvider>,
  );
}

export function renderFixture(fixture: Fixture) {
  return renderWithPrimer(<FixtureView fixture={fixture} />);
}
