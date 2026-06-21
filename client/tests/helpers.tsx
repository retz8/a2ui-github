import type {ReactElement} from 'react';
import {render} from '@testing-library/react';
import {BaseStyles, ThemeProvider} from '@primer/react';
import {FixtureView} from '../src/test-space/FixtureView';
import type {Fixture} from '../src/fixtures';
import type {ActionListener} from '@a2ui/web_core/v0_9';

export function renderWithPrimer(ui: ReactElement) {
  return render(
    <ThemeProvider>
      <BaseStyles>{ui}</BaseStyles>
    </ThemeProvider>,
  );
}

export function renderFixture(fixture: Fixture, opts: {actionHandler?: ActionListener} = {}) {
  const makeActionHandler = opts.actionHandler ? () => opts.actionHandler! : undefined;
  return renderWithPrimer(<FixtureView fixture={fixture} makeActionHandler={makeActionHandler} />);
}
