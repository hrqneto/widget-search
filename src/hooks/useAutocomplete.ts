import { useCallback, useMemo, useRef } from "react";
import debounce from "lodash.debounce";
import type { Produto, SuggestionResponse } from "../types";

export function useAutocomplete(
  clientId: string,
  setTopQueries: (val: string[]) => void,
  setTopCategories: (val: string[]) => void,
  setTopBrands: (val: string[]) => void,
  setResults: (val: Produto[]) => void,
  setIsLoading: (val: boolean) => void
) {
  const fetchStateRef = useRef({
    hasFetchedInitialSuggestions: false,
    activeRequests: 0,
  });

  const fetchInitialSuggestions = useCallback(async () => {
    if (fetchStateRef.current.hasFetchedInitialSuggestions) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8085/api/autocomplete/suggestions?client_id=${clientId}`
      );
      const data: SuggestionResponse = await res.json();

      setTopQueries(data.topQueries?.map((q) => q.query) || []);
      setTopCategories(data.topCategories?.map((c) => c.name) || []);
      setTopBrands(data.topBrands?.map((b) => b.name) || []);
      setResults(data.topProducts || []);

      fetchStateRef.current.hasFetchedInitialSuggestions = true;
    } catch (err) {
      console.error("Erro ao buscar sugestões iniciais:", err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, setTopQueries, setTopCategories, setTopBrands, setResults, setIsLoading]);

  const fetchAutocompleteResults = useCallback(async (value: string) => {
    const requestId = Date.now();
    fetchStateRef.current.activeRequests = requestId;

    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8085/api/autocomplete/search?q=${encodeURIComponent(value)}&client_id=${clientId}`
      );
      if (fetchStateRef.current.activeRequests !== requestId) return;

      const data: SuggestionResponse = await res.json();

      setTopQueries(data.queries?.map((q) => q.query) || []);
      setTopCategories(data.catalogues?.map((c) => c.name) || []);
      setTopBrands(data.brands?.map((b) => b.name) || []);
      setResults(data.products || []);
    } catch (err) {
      if (fetchStateRef.current.activeRequests === requestId) {
        console.error("Erro ao buscar autocomplete:", err);
        setResults([]);
      }
    } finally {
      if (fetchStateRef.current.activeRequests === requestId) {
        setIsLoading(false);
      }
    }
  }, [clientId, setTopQueries, setTopCategories, setTopBrands, setResults, setIsLoading]);

  const debouncedFetchAutocomplete = useMemo(() => {
    return debounce((value: string) => {
      fetchAutocompleteResults(value);
    }, 300);
  }, [fetchAutocompleteResults]);

  return {
    fetchInitialSuggestions,
    fetchAutocompleteResults,
    debouncedFetchAutocomplete,
  };
}
