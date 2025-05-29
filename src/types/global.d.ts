// src/types/global.d.ts
export {};

declare global {
  interface Window {
    BUSCAFLEX_PREVIEW?: boolean;
    BUSCAFLEX_CONFIG?: {
      clientId: string;
      placeholder: string;
      layout?: "heromobile" | "line" | "grid";
      alignment?: "left" | "center" | "right";
      blockPosition?: "left" | "right";
      apiBaseUrl?: string;
      fixarAberto?: boolean;
      colors: {
        main: string;
        background: string;
        highlight: string;
        text: string;
        border?: string;
        headerText?: string;
        mutedText?: string;
        noResultsText?: string;
        hoverItem?: string;
      };
      blockConfigs: BlockConfig[];
    };
  }
}
