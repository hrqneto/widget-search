// 📁 src/widgetConfig/widget.ts
import { renderWidget, WRAPPER_ID } from "./renderWidget";
import "../output.css";
import type { WidgetConfig } from "../types";

// ✅ 1. Função segura pra extrair config do window
function getWidgetConfig(): WidgetConfig {
  const raw = (window as unknown as { BUSCAFLEX_CONFIG?: Partial<WidgetConfig> }).BUSCAFLEX_CONFIG;

  return {
    clientId: raw?.clientId || "default",
    placeholder: raw?.placeholder || "Buscar...",
    layout: raw?.layout || "grid",
    alignment: raw?.alignment || "left",
    blockPosition: raw?.blockPosition || "right",
    showHeroProduct: raw?.showHeroProduct ?? true,
    showSuggestions: raw?.showSuggestions ?? true,
    showBorders: raw?.showBorders ?? false,
    apiBaseUrl: raw?.apiBaseUrl,
    colors: {
      main: raw?.colors?.main || "#770195",
      background: raw?.colors?.background || "#ffffff",
      highlight: raw?.colors?.highlight || "#EC46D8",
      text: raw?.colors?.text || "#000000",
      border: raw?.colors?.border || "#dddddd",
      headerText: raw?.colors?.headerText || "#333333",
      mutedText: raw?.colors?.mutedText || "#888888",
      noResultsText: raw?.colors?.noResultsText || "#222222",
      hoverItem: raw?.colors?.hoverItem || "#eeeeee",
    },
  };
}

const config = getWidgetConfig();
const SELECTOR = config.selector || 'input[type="search"], input[name="q"]';

// ✅ 2. Injeta o widget se input for encontrado e ainda não tiver wrapper
function injectIfFound(): boolean {
  const input = document.querySelector<HTMLInputElement>(SELECTOR);
  if (input && !document.getElementById(WRAPPER_ID)) {
    renderWidget(config, input);
    return true;
  }
  return false;
}

// ✅ 3. Observa DOM até encontrar o input (ex: conteúdo injetado por JS)
function observeDOMUntilFound() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (!(node instanceof HTMLElement)) continue;

        const input =
          node.querySelector?.(SELECTOR) || (node.matches?.(SELECTOR) ? node : null);

        if (input instanceof HTMLInputElement && !document.getElementById(WRAPPER_ID)) {
          renderWidget(config, input);
          observer.disconnect();
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// ✅ 4. Bootstrap do widget: executa imediatamente ou aguarda DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!injectIfFound()) observeDOMUntilFound();
  });
} else {
  if (!injectIfFound()) observeDOMUntilFound();
}
