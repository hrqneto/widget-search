// 📁 src/hooks/useWidgetConfigMerged.ts
import { DEFAULT_CONFIG } from "../contants/defaultConfig";
import type { WidgetConfig } from "../types";

export function useWidgetConfigMerged(externalConfig: WidgetConfig): WidgetConfig {
  const defaultColors = DEFAULT_CONFIG.colors!;

  const mergedColors = {
    main: externalConfig.colors?.main ?? defaultColors.main,
    highlight: externalConfig.colors?.highlight ?? defaultColors.highlight,
    background: externalConfig.colors?.background ?? defaultColors.background,
    text: externalConfig.colors?.text ?? defaultColors.text,
    mutedText: externalConfig.colors?.mutedText ?? defaultColors.mutedText,
    headerText: externalConfig.colors?.headerText ?? defaultColors.headerText,
    border: externalConfig.colors?.border ?? defaultColors.border,
    noResultsText: externalConfig.colors?.noResultsText ?? defaultColors.noResultsText,
    hoverItem: externalConfig.colors?.hoverItem ?? defaultColors.hoverItem,
  };

  return {
    ...DEFAULT_CONFIG,
    ...externalConfig,
    colors: mergedColors,
  };
}
