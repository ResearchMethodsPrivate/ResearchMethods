/**
 * Lazy-loaded overlay hosting the OpenUI explorer. Loaded only when the
 * presenter presses E, so React/OpenUI never touch slide navigation, the
 * counted Week 5 slides or the PDF export.
 */
import { createRoot, type Root } from 'react-dom/client';
import { Renderer } from '@openuidev/react-lang';
import type Reveal from 'reveal.js';
import { library } from './library';
import { crdaProgram } from './crda.oui';
import './explore.css';

let host: HTMLDivElement | null = null;
let root: Root | null = null;
let restoreFocus: Element | null = null;
let onKey: ((e: KeyboardEvent) => void) | null = null;

export const isOpen = () => host !== null;

export function open(deck: Reveal.Api) {
  if (host) return;
  restoreFocus = document.activeElement;
  host = document.createElement('div');
  host.className = 'ox-overlay';
  host.setAttribute('role', 'dialog');
  host.setAttribute('aria-modal', 'true');
  host.setAttribute('aria-labelledby', 'ox-title');
  document.body.appendChild(host);
  deck.configure({ keyboard: false }); // slide keys stay inert while the panel is open

  root = createRoot(host);
  root.render(
    <div className="ox-panel">
      <div className="ox-bar">
        <span className="ox-badge">Optional explorer · not a counted slide · rendered with OpenUI</span>
        <button className="ox-close" onClick={() => close(deck)} aria-label="Close explorer (Esc)">Close · Esc</button>
      </div>
      <Renderer response={crdaProgram} library={library} isStreaming={false} />
    </div>,
  );
  onKey = (e) => {
    if (e.key === 'Escape' || e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      e.stopPropagation();
      close(deck);
    }
  };
  document.addEventListener('keydown', onKey, true);
  requestAnimationFrame(() => host?.querySelector<HTMLButtonElement>('.ox-close')?.focus());
}

export function close(deck: Reveal.Api) {
  if (!host) return;
  if (onKey) document.removeEventListener('keydown', onKey, true);
  root?.unmount();
  host.remove();
  host = null;
  root = null;
  onKey = null;
  deck.configure({ keyboard: true });
  (restoreFocus as HTMLElement | null)?.focus?.();
}
