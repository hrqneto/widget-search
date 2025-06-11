import type { WidgetConfig } from "../types";
import { useWidgetConfigMerged } from "./useWidgetConfigMerged";

export function useClientConfig(externalConfig: WidgetConfig): {
  internalConfig: WidgetConfig;
  clientId: string;
} {
  const previewConfig = typeof window !== "undefined" && window.BUSCAFLEX_PREVIEW
    ? window.BUSCAFLEX_CONFIG
    : null;

  const internalConfig = useWidgetConfigMerged((previewConfig || externalConfig) as WidgetConfig);
  const clientId = previewConfig?.clientId || externalConfig.clientId || "products";

  return { internalConfig, clientId };
}
