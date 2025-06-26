import type { WidgetConfig } from "../types";

import { getDefaultBlockConfigs } from "../utils/defaultBlockConfigs";

export const DEFAULT_CONFIG: WidgetConfig = {
  clientId: "demo",
  placeholder: "Busque aqui...",
  layout: "grid",
  alignment: "left",
  blockPosition: "right",
  showHeroProduct: true,
  showSuggestions: true,
  showBorders: false,
  apiBaseUrl: "https://api.buscoo.com",
  selector: "#buscoo-autocomplete",
  colors: {
    main: "#000",
    highlight: "#f00",
    background: "#fff",
    text: "#333",
    mutedText: "#888",
    headerText: "#111",
    border: "#ddd",
    noResultsText: "#c00",
    hoverItem: "#eee",
  },
  blockConfigs: getDefaultBlockConfigs(),
};
