import type {A2uiMessage} from '@a2ui/web_core/v0_9';

export interface Fixture {
  /** Stable id; shown in the selector and used as the ?fixture= URL value. */
  name: string;
  /** Canned A2UI v0.9 messages fed to MessageProcessor.processMessages. */
  messages: A2uiMessage[];
}
