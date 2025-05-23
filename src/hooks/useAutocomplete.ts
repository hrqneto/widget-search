import { useCallback, useMemo, useRef } from "react";
import debounce from "lodash.debounce";
import type { Produto } from "../types";
import { normalizeAutocomplete } from "../utils/normalizeAutocomplete";

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
      const data = await res.json();
      const { queries, categories, brands, products } = normalizeAutocomplete(data);

      setTopQueries(queries);
      setTopCategories(categories);
      setTopBrands(brands);
      setResults(products);

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
        `http://localhost:8085/api/autocomplete?q=${encodeURIComponent(value)}&client_id=${clientId}`
      );

      if (fetchStateRef.current.activeRequests !== requestId) return;

      const data = await res.json();
      const { queries, categories, brands, products } = normalizeAutocomplete(data);

      setTopQueries(queries);
      setTopCategories(categories);
      setTopBrands(brands);
      setResults(products);
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
