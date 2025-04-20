import { useCallback } from "react";
import type { SuggestionResponse, SearchResults } from "../types";

type Setters = {
  setTopQueries: (q: string[]) => void;
  setTopCategories: (c: string[]) => void;
  setTopBrands: (b: string[]) => void;
  setResults: (r: SearchResults) => void;
};

export const useFetchSuggestions = (
  clientId: string,
  apiBaseUrl: string,
  { setTopQueries, setTopCategories, setTopBrands, setResults }: Setters
) => {
  const fetchSuggestions = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/autocomplete/suggestions?client_id=${clientId}`);
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);

      const data: SuggestionResponse = await res.json();

      setTopQueries(data.topQueries?.map((q) => q.query) || []);
      setTopCategories(data.topCategories?.map((c) => c.name) || []);
      setTopBrands(data.topBrands?.map((b) => b.name) || []);
      setResults({ resultados: data.topProducts || [] });

    } catch (err) {
      console.error("Erro ao buscar sugestões iniciais:", err);
      setResults({ resultados: [] });
    }
  }, [clientId, apiBaseUrl, setResults, setTopQueries, setTopCategories, setTopBrands]);

  return fetchSuggestions;
};
