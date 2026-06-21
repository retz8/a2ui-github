import {useCallback} from 'react';
import {BaseStyles, ThemeProvider} from '@primer/react';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {createA2AActionHandler} from './a2a/createA2AActionHandler';
import {TestSpace} from './test-space/TestSpace';

const SERVER_URL = import.meta.env.VITE_A2A_SERVER_URL ?? 'http://localhost:10002';

export function App() {
  const makeActionHandler = useCallback(
    (apply: (messages: A2uiMessage[]) => void): ActionListener =>
      createA2AActionHandler({apply, serverUrl: SERVER_URL}),
    [],
  );

  return (
    <ThemeProvider>
      <BaseStyles>
        <TestSpace makeActionHandler={makeActionHandler} />
      </BaseStyles>
    </ThemeProvider>
  );
}
