import {useCallback} from 'react';
import type {ActionListener, A2uiMessage} from '@a2ui/web_core/v0_9';
import {createA2AActionHandler} from '../a2a/createA2AActionHandler';
import {Providers} from '../providers';
import {TestSpace} from './TestSpace';

const SERVER_URL = import.meta.env.VITE_A2A_SERVER_URL ?? 'http://localhost:10002';

/** The fixture dev page: the selectable test space over the A2A action handler. */
export function DevApp() {
  const makeActionHandler = useCallback(
    (apply: (messages: A2uiMessage[]) => void): ActionListener =>
      createA2AActionHandler({apply, serverUrl: SERVER_URL}),
    [],
  );

  return (
    <Providers>
      <TestSpace makeActionHandler={makeActionHandler} />
    </Providers>
  );
}
