import { DEFAULT_CONFIG } from "../contants/defaultConfig";
import type { WidgetConfig, Colors, BlockConfig } from "../types";

export function useWidgetConfigMerged(externalConfig: Partial<WidgetConfig>): WidgetConfig {
  const defaultColors = DEFAULT_CONFIG.colors;

  const mergedColors: Colors = {
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

  const mergedBlockConfigs: BlockConfig[] =
    Array.isArray(externalConfig.blockConfigs) && externalConfig.blockConfigs.length > 0
      ? externalConfig.blockConfigs
      : DEFAULT_CONFIG.blockConfigs;


  return {
    clientId: externalConfig.clientId ?? DEFAULT_CONFIG.clientId,
    placeholder: externalConfig.placeholder ?? DEFAULT_CONFIG.placeholder,
    layout: externalConfig.layout ?? DEFAULT_CONFIG.layout,
    alignment: externalConfig.alignment ?? DEFAULT_CONFIG.alignment,
    blockPosition: externalConfig.blockPosition ?? DEFAULT_CONFIG.blockPosition,
    showHeroProduct: externalConfig.showHeroProduct ?? DEFAULT_CONFIG.showHeroProduct,
    showSuggestions: externalConfig.showSuggestions ?? DEFAULT_CONFIG.showSuggestions,
    showBorders: externalConfig.showBorders ?? DEFAULT_CONFIG.showBorders,
    apiBaseUrl: externalConfig.apiBaseUrl ?? DEFAULT_CONFIG.apiBaseUrl,
    selector: externalConfig.selector ?? DEFAULT_CONFIG.selector,
    blockConfigs: mergedBlockConfigs,
    colors: mergedColors,
  };
}
