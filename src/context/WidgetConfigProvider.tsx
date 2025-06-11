import React, { useEffect, useState } from "react";
import { WidgetConfigContext } from "./WidgetConfigContext";
import type { WidgetConfig } from "../types";

type Props = {
  clientId: string;
  children: React.ReactNode;
};

export const WidgetConfigProvider = ({ clientId, children }: Props) => {
  const [config, setConfig] = useState<WidgetConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`http://localhost:8085/api/widget/autocomplete-config?client_id=${clientId}`);
        const data = await res.json();
        setConfig(data?.published || null);
      } catch (error) {
        console.error("Erro ao carregar config do widget:", error);
      }
    };

    fetchConfig();
  }, [clientId]);

  if (!config) return null;

  return (
    <WidgetConfigContext.Provider value={config}>
      {children}
    </WidgetConfigContext.Provider>
  );
};
