import type { BuscaflexPreviewConfig } from "./index"; // ajuste o path se estiver diferente

export {};

declare global {
  interface Window {
    BUSCAFLEX_PREVIEW?: boolean;
    BUSCAFLEX_CONFIG?: BuscaflexPreviewConfig;
  }
}
