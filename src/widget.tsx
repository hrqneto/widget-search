import { createRoot } from 'react-dom/client';
import BuscaFlexWidget from './components/BuscaFlexWidget';
import './output.css';

const config = (window as any).BUSCAFLEX_CONFIG || {};
const SELECTOR = config.selector || 'input[type="search"], input[name="q"]';
const WRAPPER_ID = 'buscaflex-widget-wrapper';

function injectWidget(originalSearch: HTMLInputElement) {
  if (document.getElementById(WRAPPER_ID)) return;

  const wrapper = document.createElement('div');
  wrapper.id = WRAPPER_ID;

  originalSearch.parentNode?.replaceChild(wrapper, originalSearch);

  const root = createRoot(wrapper);
    root.render(<BuscaFlexWidget config={config} />);
}

function observeAndInject() {
  const existing = document.querySelector<HTMLInputElement>(SELECTOR);
  if (existing) {
    injectWidget(existing);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (!(node instanceof HTMLElement)) continue;
        const input = node.querySelector?.(SELECTOR) || (node.matches?.(SELECTOR) ? node : null);
        if (input) {
          injectWidget(input as HTMLInputElement);
          observer.disconnect();
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeAndInject);
} else {
  observeAndInject();
}
