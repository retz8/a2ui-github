import {describe, it, expect, afterEach} from 'vitest';
import {screen, cleanup, waitFor, act} from '@testing-library/react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import {PRIMER_CATALOG} from 'primer-a2ui-adapter';
import {renderWithPrimer} from './helpers';
import {buttonEventFixture} from '../src/fixtures/button-event';

afterEach(cleanup);

describe('round-trip re-render', () => {
  it('re-renders an existing surface when the server-style response is applied', async () => {
    const processor = new MessageProcessor([PRIMER_CATALOG]);
    processor.processMessages(buttonEventFixture.messages);
    const surface = Array.from(processor.model.surfacesMap.values())[0];

    renderWithPrimer(<A2uiSurface surface={surface} />);

    // Before: enabled button, original label.
    expect(screen.getByRole('button', {name: 'Send event'})).not.toBeDisabled();

    // Apply the canned response the deterministic server returns for `submit`
    // (surfaceId stamped, as the server does before sending).
    await act(async () => {
      processor.processMessages([
        {
          version: 'v0.9',
          updateDataModel: {surfaceId: 'button-event', path: '/submitted', value: true},
        },
        {
          version: 'v0.9',
          updateComponents: {
            surfaceId: 'button-event',
            components: [
              {id: 'label', component: 'Text', text: '✅ Sent — server received submit'},
            ],
          },
        },
      ]);
    });

    // After: label flipped and the button disabled (binds to /submitted).
    await waitFor(() =>
      expect(screen.getByText('✅ Sent — server received submit')).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', {name: '✅ Sent — server received submit'})).toBeDisabled();
  });
});
