// 📁 src/hooks/useWidgetConfigMerged.ts
import { DEFAULT_CONFIG } from "../contants/defaultConfig";
import type { WidgetConfig } from "../types";

export function useWidgetConfigMerged(externalConfig: WidgetConfig): WidgetConfig {
  return {
    ...DEFAULT_CONFIG,
    ...externalConfig,
    colors: {
      ...DEFAULT_CONFIG.colors,
      ...externalConfig.colors,
    },
  };
}
