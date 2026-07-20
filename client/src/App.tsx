import {ChatView} from './chat/ChatView';
import {Providers} from './providers';

const SERVER_URL = import.meta.env.VITE_A2A_SERVER_URL ?? 'http://localhost:10002';

/** The default page: the chat client. The fixture test space lives on the dev page. */
export function App() {
  return (
    <Providers>
      <ChatView serverUrl={SERVER_URL} />
    </Providers>
  );
}
