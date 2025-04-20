import { useEffect } from "react";
import SearchInput from "../searchInput/SearchInput";
import ColumnTopItems from "../dropDownContainer/ColumnTopItems";
import ColumnHeroProduct from "../dropDownContainer/ColumnHeroProduct";
import ColumnProductList from "../dropDownContainer/ColumnProductList";

import { useAutocomplete } from "../../hooks/useAutocomplete";
import { useWidgetState } from "../../hooks/useWidgetState";
import { highlightQuery as baseHighlightQuery } from "../../utils/highlightQuery";
import { WidgetConfigContext } from "../../context/WidgetConfigContext";
import type { WidgetConfig } from "../../types";

// 🔧 Default config
const DEFAULT_CONFIG: WidgetConfig = {
  placeholder: "O que você procura?",
  colors: {
    background: "#770195",
    text: "#000000",
    main: "#770195",
    highlight: "#EC46D8",
    border: "#E5E7EB",
    headerText: "#770195",
    mutedText: "#484848",
    noResultsText: "#000000",
    hoverItem: "#EC46D8",
  },
};

declare global {
  interface Window {
    BUSCAFLEX_PREVIEW?: boolean;
  }
}

const AutocompleteWidget = ({ config: externalConfig }: { config: WidgetConfig }) => {
  const state = useWidgetState();
  const {
    query, setQuery,
    results, setResults,
    isLoading, setIsLoading,
    isOpen, setIsOpen,
    topQueries, setTopQueries,
    topCategories, setTopCategories,
    topBrands, setTopBrands,
  } = state;

  const clientId = externalConfig.clientId || "products";
  const {
    fetchInitialSuggestions,
    fetchAutocompleteResults,
    debouncedFetchAutocomplete
  } = useAutocomplete(clientId, setTopQueries, setTopCategories, setTopBrands, setResults, setIsLoading);

  const internalConfig: WidgetConfig = {
    ...DEFAULT_CONFIG,
    ...externalConfig,
    colors: {
      ...DEFAULT_CONFIG.colors,
      ...externalConfig.colors,
    },
  };

  const highlightQuery = (text: string) => baseHighlightQuery(text, query);

  useEffect(() => {
    return () => debouncedFetchAutocomplete.cancel();
  }, [debouncedFetchAutocomplete]);

  useEffect(() => {
    if (query.trim().length === 0) {
      fetchInitialSuggestions();
      setIsOpen(true);
    } else {
      debouncedFetchAutocomplete(query);
    }
  }, [query, fetchInitialSuggestions, debouncedFetchAutocomplete, setIsOpen]);

  useEffect(() => {
    if (!window.BUSCAFLEX_PREVIEW) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".autocomplete-dropdown") && !target.closest("input[name='q']")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [setIsOpen]);

  return (
    <WidgetConfigContext.Provider value={internalConfig}>
      <div className="relative w-full max-w-2xl mx-auto mt-4">
        <SearchInput
          query={query}
          setQuery={setQuery}
          setIsOpen={setIsOpen}
          placeholder={internalConfig.placeholder}
          fetchAutocompleteResults={fetchAutocompleteResults}
          fetchSuggestions={fetchInitialSuggestions}
        />

        {isOpen && (topQueries.length || topCategories.length || topBrands.length || results.length) > 0 && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-[980px] min-h-[500px] border border-gray-950 rounded-lg z-50 bg-white autocomplete-dropdown"
            style={{ backgroundColor: internalConfig.colors?.background }}
          >
            <div className="h-1 bg-black rounded-t-md absolute top-0 left-0 w-full" />
            <div className="w-2 h-2 bg-black absolute -top-1.5 left-1/2 transform -translate-x-1/2 -rotate-45 z-50" />
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar dropdown"
            >
              ✕
            </button>

            {isLoading ? (
              <p className="text-center text-gray-500 py-6">Carregando resultados...</p>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-[210px_210px_1fr] min-h-[540px] gap-4">
                <ColumnTopItems {...{ topQueries, topCategories, topBrands, highlightQuery, colors: internalConfig.colors || {}, showBorders: internalConfig.showBorders }} />
                <ColumnHeroProduct product={results[0]} highlightQuery={highlightQuery} colors={internalConfig.colors || {}} />
                <ColumnProductList products={results} highlightQuery={highlightQuery} colors={internalConfig.colors || {}} showBorders={internalConfig.showBorders} />
              </div>
            ) : (
              <div className="py-6 text-center text-base mt-2" style={{ color: internalConfig.colors?.noResultsText }}>
                Nenhum resultado encontrado para <strong>{query}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </WidgetConfigContext.Provider>
  );
};

export default AutocompleteWidget;
