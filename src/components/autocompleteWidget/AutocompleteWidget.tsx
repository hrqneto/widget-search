import { useEffect } from "react";
import SearchInput from "../searchInput/SearchInput";
import ColumnLayout from "../columnLayout/ColumnLayout";

import { useAutocomplete } from "../../hooks/useAutocomplete";
import { useWidgetState } from "../../hooks/useWidgetState";
import { useOutsideClickClose } from "../../hooks/useOutsideClickClose";
import { useWidgetConfigMerged } from "../../hooks/useWidgetConfigMerged";
import { highlightQuery as baseHighlightQuery } from "../../utils/highlightQuery";
import { WidgetConfigContext } from "../../context/WidgetConfigContext";
import type { WidgetConfig } from "../../types";

const AutocompleteWidget = ({ config: externalConfig }: { config: WidgetConfig }) => {
  const {
    query, setQuery,
    results, setResults,
    isLoading, setIsLoading,
    isOpen, setIsOpen,
    topQueries, setTopQueries,
    topCategories, setTopCategories,
    topBrands, setTopBrands,
  } = useWidgetState();

  const clientId = externalConfig.clientId || "products";
  const {
    fetchInitialSuggestions,
    fetchAutocompleteResults,
    debouncedFetchAutocomplete
  } = useAutocomplete(clientId, setTopQueries, setTopCategories, setTopBrands, setResults, setIsLoading);

  const internalConfig = useWidgetConfigMerged(externalConfig);
  const highlightQuery = (text: string) => baseHighlightQuery(text, query);

  // cancela debounce no unmount
  useEffect(() => () => debouncedFetchAutocomplete.cancel(), [debouncedFetchAutocomplete]);

  // dispara sugestões ou resultados
  useEffect(() => {
    if (query.trim().length === 0) {
      fetchInitialSuggestions();
      setIsOpen(true);
    } else {
      debouncedFetchAutocomplete(query);
    }
  }, [query, fetchInitialSuggestions, debouncedFetchAutocomplete, setIsOpen]);

  // fecha dropdown ao clicar fora
  useOutsideClickClose("autocomplete-dropdown", () => setIsOpen(false));

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
            className="autocomplete-dropdown absolute left-1/2 transform -translate-x-1/2 w-[980px] min-h-[500px] border border-gray-950 rounded-lg z-50 bg-white"
            style={{ backgroundColor: internalConfig.colors?.background }}
          >
            {/* Ribbon + Caret + Close */}
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
              <ColumnLayout
                results={results}
                topQueries={topQueries}
                topCategories={topCategories}
                topBrands={topBrands}
                highlightQuery={highlightQuery}
                colors={internalConfig.colors!}
                showBorders={internalConfig.showBorders}
              />
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
