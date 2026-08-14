import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {CanvasApp} from './canvas/CanvasApp';
import {Providers} from './providers';

const SERVER_URL = import.meta.env.VITE_A2A_SERVER_URL ?? 'http://localhost:10002';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <CanvasApp serverUrl={SERVER_URL} />
    </Providers>
  </StrictMode>,
);
