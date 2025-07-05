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

// ✅ Remove input original, se necessário
function removeTargetInputIfExists(selector: string, wrapperId: string) {
  const interval = setInterval(() => {
    const input = document.querySelector<HTMLInputElement>(selector);
    const wrapper = document.getElementById(wrapperId);
    const shouldReplace = (window as any).BUSCAFLEX_CONFIG?.replaceInput === true;

    if (input && wrapper) {
      if (shouldReplace) {
        input.style.display = "none";
        console.log("[BUSCAFLEX] ✅ Input original ocultado (replaceInput:true).");
      } else {
        console.log("[BUSCAFLEX] ⚠️ Input mantido visível.");
      }
      clearInterval(interval);
    }

    if (!input && wrapper) clearInterval(interval);
  }, 300);
}

// ✅ Injeta widget se encontrar input válido
function injectIfFound(): boolean {
  const input = document.querySelector<HTMLInputElement>(SELECTOR);
  if (input && !document.getElementById(WRAPPER_ID)) {
    console.log("[BUSCAFLEX] 🎯 Input encontrado. Injetando widget...");
    renderWidget(config, input);
    removeTargetInputIfExists(SELECTOR, WRAPPER_ID);
    return true;
  }

  if (!input && !document.getElementById(WRAPPER_ID)) {
    const fallbackInput = createFallbackInput();
    renderWidget(config, fallbackInput);
    return true;
  }

  return false;
}

// ✅ Observer sempre ativo
function observeDOMAlways() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (!(node instanceof HTMLElement)) continue;
        const input = node.querySelector?.(SELECTOR) || (node.matches?.(SELECTOR) ? node : null);
        if (input instanceof HTMLInputElement && !document.getElementById(WRAPPER_ID)) {
          console.log("[BUSCAFLEX] 📦 Input encontrado via observer. Injetando...");
          renderWidget(config, input);
          removeTargetInputIfExists(SELECTOR, WRAPPER_ID);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// ✅ Monitor de rota SPA (React Router etc.)
let lastPath = window.location.pathname;
setInterval(() => {
  const currentPath = window.location.pathname;
  if (currentPath !== lastPath) {
    lastPath = currentPath;
    console.log("[BUSCAFLEX] 🔄 Rota SPA detectada. Reiniciando bootstrap...");
    bootstrap();
  }
}, 800);

// ✅ Bootstrap
function bootstrap() {
  console.log("[BUSCAFLEX] 🚀 Iniciando bootstrap do widget...");
  if (!injectIfFound()) {
    console.log("[BUSCAFLEX] ⏳ Input ainda não disponível. Observer ativado.");
  }
}

// ✅ Autoexecução
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    bootstrap();
    observeDOMAlways();
  });
} else {
  bootstrap();
  observeDOMAlways();
}

// ✅ Execução manual
(window as any).BUSCAFLEX_BOOTSTRAP = () => {
  console.log("[BUSCAFLEX] 🛠️ Executando bootstrap manual via BUSCAFLEX_BOOTSTRAP()");
  bootstrap();
};
