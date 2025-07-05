import { renderWidget, WRAPPER_ID } from "./renderWidget";
import "../output.css";
import type { WidgetConfig, BlockConfig } from "../types";

// 🔧 Normaliza blockConfigs vindos do window
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

// ✅ Extrai config global do window
function getWidgetConfig(): WidgetConfig {
  const raw = (window as any).BUSCAFLEX_CONFIG ?? {};

  return {
    clientId: raw.clientId || "default",
    placeholder: raw.placeholder || "Buscar...",
    layout: raw.layout || "grid",
    alignment: raw.alignment || "left",
    blockPosition: raw.blockPosition || "right",
    showHeroProduct: raw.showHeroProduct ?? true,
    showSuggestions: raw.showSuggestions ?? true,
    showBorders: raw.showBorders ?? false,
    apiBaseUrl: raw.apiBaseUrl,
    colors: {
      main: raw.colors?.main || "#770195",
      background: raw.colors?.background || "#ffffff",
      highlight: raw.colors?.highlight || "#EC46D8",
      text: raw.colors?.text || "#000000",
      border: raw.colors?.border || "#dddddd",
      headerText: raw.colors?.headerText || "#333333",
      mutedText: raw.colors?.mutedText || "#888888",
      noResultsText: raw.colors?.noResultsText || "#222222",
      hoverItem: raw.colors?.hoverItem || "#eeeeee",
    },
    blockConfigs: normalizeBlockConfigs(raw.blockConfigs),
  };
}

// ✅ Remove o input original após o widget ser renderizado
function removeTargetInputIfExists(selector: string, wrapperId: string) {
  const interval = setInterval(() => {
    const input = document.querySelector<HTMLInputElement>(selector);
    const wrapper = document.getElementById(wrapperId);

    if (input && wrapper) {
      console.log("[BUSCAFLEX] ✅ Input original encontrado e removido.");
      input.remove();
      clearInterval(interval);
    }

    if (!input && wrapper) {
      clearInterval(interval); // já foi removido
    }
  }, 300);
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

// ✅ Cria input de fallback se não encontrar nenhum
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
  console.log("[BUSCAFLEX] ⚠️ Nenhum input encontrado. Criando fallback.");
  return input;
}

// ✅ Tenta injetar o widget diretamente
function injectIfFound(): boolean {
  const input = document.querySelector<HTMLInputElement>(SELECTOR);
  if (input) {
    const wrapper = document.getElementById(WRAPPER_ID);
    if (!wrapper) {
      console.log("[BUSCAFLEX] 🎯 Input encontrado. Injetando widget...");
      renderWidget(config, input);
      removeTargetInputIfExists(SELECTOR, WRAPPER_ID);
      return true;
    }
  }

  if (!document.getElementById(WRAPPER_ID)) {
    const fallbackInput = createFallbackInput();
    renderWidget(config, fallbackInput);
    return true;
  }

  return false;
}

// ✅ Observa o DOM se o input for injetado dinamicamente
function observeDOMUntilFound() {
  console.log("[BUSCAFLEX] 👀 Observando DOM para encontrar input...");
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (!(node instanceof HTMLElement)) continue;

        const input =
          node.querySelector?.(SELECTOR) || (node.matches?.(SELECTOR) ? node : null);

        if (input instanceof HTMLInputElement && !document.getElementById(WRAPPER_ID)) {
          console.log("[BUSCAFLEX] 📦 Input encontrado via observer. Injetando...");
          renderWidget(config, input);
          removeTargetInputIfExists(SELECTOR, WRAPPER_ID);
          observer.disconnect();
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// ✅ Inicializa o widget (tentativas + fallback observer)
function bootstrap() {
  console.log("[BUSCAFLEX] 🚀 Iniciando bootstrap do widget...");
  let attempts = 0;
  const interval = setInterval(() => {
    if (injectIfFound()) {
      clearInterval(interval);
    } else if (++attempts > 20) {
      clearInterval(interval);
      observeDOMUntilFound();
    }
  }, 150);
}

// ✅ Executa automaticamente se o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

// ✅ Exposição global para chamadas manuais
(window as any).BUSCAFLEX_BOOTSTRAP = () => {
  console.log("[BUSCAFLEX] 🛠️ Executando bootstrap manual via BUSCAFLEX_BOOTSTRAP()");
  bootstrap();
};
