import { createContext, useContext } from "react";
import type { WidgetConfig } from "../types";

export const WidgetConfigContext = createContext<WidgetConfig | null>(null);

export const useWidgetConfig = (): WidgetConfig => {
  const context = useContext(WidgetConfigContext);
  if (!context) {
    throw new Error("useWidgetConfig precisa estar dentro de <WidgetConfigContext.Provider>");
  }
  return context;
};
