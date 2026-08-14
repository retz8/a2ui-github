/**
 * The command palette: language input as a summonable overlay — summon, speak, dismiss
 * (phase-8 spec decision 1). While a paint is in flight, send is blocked with a cue; 8.3
 * replaces the block with last-intent-wins cancel.
 */
import {useEffect, useRef, useState} from 'react';
import {TextInput} from '@primer/react';

export interface PaletteProps {
  open: boolean;
  /** True while a paint is in flight — the input stays open, send is refused with a cue. */
  blocked: boolean;
  onDismiss: () => void;
  onSubmit: (utterance: string) => void;
}

export function Palette({open, blocked, onDismiss, onSubmit}: PaletteProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [refusedWhileBlocked, setRefusedWhileBlocked] = useState(false);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape works wherever focus is — clicking outside the overlay must not trap the user.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onDismiss]);

  if (!open) return null;

  const submit = () => {
    const utterance = text.trim();
    if (!utterance) return;
    if (blocked) {
      setRefusedWhileBlocked(true);
      return;
    }
    setText('');
    setRefusedWhileBlocked(false);
    onSubmit(utterance);
  };

  return (
    <div className="canvas-palette" data-testid="canvas-palette">
      <TextInput
        ref={inputRef}
        aria-label="Ask the agent"
        placeholder="Ask about GitHub…"
        block
        size="large"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          }
        }}
      />
      {blocked && refusedWhileBlocked && (
        <div className="canvas-palette-cue">Wait — a paint is in flight.</div>
      )}
      <div className="canvas-palette-hint">Enter to ask · Esc to dismiss</div>
    </div>
  );
}
