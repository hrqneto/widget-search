import { createRoot } from "react-dom/client";
import AutocompleteWidget from "../components/autocompleteWidget/AutocompleteWidget";
import type { WidgetConfig } from "../types";

export const WRAPPER_ID = "buscaflex-widget-wrapper";

export function renderWidget(config: WidgetConfig, container: HTMLElement) {
  if (document.getElementById(WRAPPER_ID)) {
    console.warn("[BUSCAFLEX] ⚠️ Wrapper já existe ou já renderizado. Abortando render.");
    return;
  }  

  if (!(container instanceof HTMLInputElement)) {
    console.warn("[BUSCAFLEX] ❌ Elemento alvo não é um input válido.");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.id = WRAPPER_ID;
  container.replaceWith(wrapper);

  console.log("[BUSCAFLEX] ✅ Widget renderizado com sucesso.");
  console.log("🔥 CONFIG FINAL RECEBIDO NO renderWidget:", config);

  const root = createRoot(wrapper);
  root.render(<AutocompleteWidget config={config} />);
}
