import { renderWidget, WRAPPER_ID } from "./renderWidget";
import "../output.css";
import type { WidgetConfig, BlockConfig } from "../types";

// 🔧 Função local para normalizar blockConfigs do window
function normalizeBlockConfigs(rawBlocks: any[] = []): BlockConfig[] {
  return rawBlocks
    .filter((block) => block && block.enabled !== false)
    .map((block, index) => ({
      id: block.id || `block-${index}`,
      name: block.name || "",
      size: typeof block.size === "number" ? block.size : 4,
      position: typeof block.position === "number" ? block.position : index,
      enabled: block.enabled ?? true,
      recommendedName: block.recommendedName || "",
      recommendedSize: typeof block.recommendedSize === "number" ? block.recommendedSize : 4,
      heroName: block.heroName || "",
    }));
}

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
    blockConfigs: normalizeBlockConfigs(raw?.blockConfigs),
  };
}

const config = getWidgetConfig();
const SELECTOR = config.selector || [
  'input[type="search"]',
  'input[type="text"]',
  'input[name="q"]',
  'input[class*="search"]',
  'input[placeholder*="buscar"]',
  'input[placeholder*="search"]',
  '.widget-search-input'
].join(', ');

// 🔧 Fallback para criar input se nenhum for encontrado
function createFallbackInput(): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "search";
  input.placeholder = config.placeholder || "Buscar produtos...";
  input.className = "widget-search-input";
  input.style.cssText = `
    padding: 10px;
    width: 300px;
    margin: 20px;
    display: block;
  `;
  document.body.insertBefore(input, document.body.firstChild);
  return input;
}

// ✅ 2. Injeta o widget ou cria input se necessário
function injectIfFound(): boolean {
  const input = document.querySelector<HTMLInputElement>(SELECTOR);
  if (input && !document.getElementById(WRAPPER_ID)) {
    renderWidget(config, input);
    return true;
  }

  // 🔁 Se não encontrar input nenhum, cria um de fallback
  if (!document.getElementById(WRAPPER_ID)) {
    const fallbackInput = createFallbackInput();
    renderWidget(config, fallbackInput);
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
