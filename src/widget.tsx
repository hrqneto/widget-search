import { createRoot } from 'react-dom/client';
import BuscaFlexWidget from './components/BuscaFlexWidget';
import './output.css';

// 👇 Pega config do window
const config = (window as any).BUSCAFLEX_CONFIG || {};

// 👇 Fallback seguro do seletor (usa o que vier ou o padrão)
const SELECTOR = config.selector || 'input[type="search"], input[name="q"]';

// 👇 ID fixo do wrapper pra evitar duplicação
const WRAPPER_ID = 'buscaflex-widget-wrapper';

function injectWidget(originalSearch: HTMLInputElement) {
  // Evita reinserção se já tiver injetado
  if (document.getElementById(WRAPPER_ID)) return;

  const wrapper = document.createElement('div');
  wrapper.id = WRAPPER_ID;

  // Substitui o input original pelo wrapper
  originalSearch.parentNode?.replaceChild(wrapper, originalSearch);

  // Renderiza React no wrapper
  const root = createRoot(wrapper);
  root.render(
    <BuscaFlexWidget config={config} />
  );
}

function observeAndInject() {
  const existing = document.querySelector<HTMLInputElement>(SELECTOR);
  if (existing) {
    injectWidget(existing);
    return;
  }

  // Fica observando o DOM caso o input apareça depois (ex: via JS)
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

// Garante execução mesmo que DOM ainda não tenha carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeAndInject);
} else {
  observeAndInject();
}
