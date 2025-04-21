// 📁 src/components/autocompleteWidget/AutocompleteWidget.tsx
import { useEffect, useRef, useState } from "react";
import SearchInput from "../searchInput/SearchInput";
import ColumnLayout from "../columnLayout/ColumnLayout";
import MobileLayout from "../columnLayout/MobileLayout";

import { useAutocomplete } from "../../hooks/useAutocomplete";
import { useWidgetState } from "../../hooks/useWidgetState";
import { useOutsideClickClose } from "../../hooks/useOutsideClickClose";
import { useWidgetConfigMerged } from "../../hooks/useWidgetConfigMerged";
import { highlightQuery as baseHighlightQuery } from "../../utils/highlightQuery";
import { WidgetConfigContext } from "../../context/WidgetConfigContext";
import type { WidgetConfig } from "../../types";
import { useIsMobile } from "../../hooks/useIsMobile";

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
  const internalConfig = useWidgetConfigMerged(externalConfig);
  const highlightQuery = (text: string) => baseHighlightQuery(text, query);
  const isMobile = useIsMobile(1020);

  const {
    fetchInitialSuggestions,
    fetchAutocompleteResults,
    debouncedFetchAutocomplete
  } = useAutocomplete(clientId, setTopQueries, setTopCategories, setTopBrands, setResults, setIsLoading);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownLeftOffset, setDropdownLeftOffset] = useState(0);

  useEffect(() => () => debouncedFetchAutocomplete.cancel(), [debouncedFetchAutocomplete]);

  useEffect(() => {
    if (query.trim().length === 0) {
      fetchInitialSuggestions();
      setIsOpen(true);
    } else {
      debouncedFetchAutocomplete(query);
    }
  }, [query, fetchInitialSuggestions, debouncedFetchAutocomplete, setIsOpen]);

useEffect(() => {
  if (!inputRef.current || !dropdownRef.current) return;
  const inputRect = inputRef.current.getBoundingClientRect();
  const dropdownWidth = 980;
  const screenWidth = window.innerWidth;
  const margin = 16;

  // posição ideal (centralizado ao input)
  let idealLeft = inputRect.left + inputRect.width / 2 - dropdownWidth / 2;

  // ajuste: se ultrapassa a tela, puxa pra dentro
  const maxLeft = screenWidth - dropdownWidth - margin;
  const boundedLeft = Math.max(margin, Math.min(idealLeft, maxLeft));

  setDropdownLeftOffset(boundedLeft);
}, [query, isOpen]);

  useOutsideClickClose("autocomplete-dropdown", () => setIsOpen(false));

  return (
    <WidgetConfigContext.Provider value={internalConfig}>
      <div className="relative w-full max-w-full mx-auto mt-4">
        <div className={isMobile && isOpen ? "hidden" : "block"}>
          <SearchInput
            inputRef={inputRef}
            query={query}
            setQuery={setQuery}
            setIsOpen={setIsOpen}
            placeholder={internalConfig.placeholder}
            fetchAutocompleteResults={fetchAutocompleteResults}
            fetchSuggestions={fetchInitialSuggestions}
          />
        </div>

        {isOpen && (topQueries.length || topCategories.length || topBrands.length || results.length) > 0 && (
          <div
            ref={dropdownRef}
            className={`autocomplete-dropdown ${
              isMobile
                ? "fixed inset-0 w-screen h-screen bg-white z-[9999] rounded-none"
                : "absolute min-h-[500px] mt-3.5 border border-gray-950 rounded-lg z-50 bg-white"
            }`}
            style={{
              backgroundColor: internalConfig.colors?.background,
              left: isMobile ? undefined : dropdownLeftOffset,
              width: isMobile ? "100%" : "980px",
            }}
          >
            {!isMobile && (
              <>
                <div className="h-1 bg-black rounded-t-md absolute top-0 left-0 w-full" />
                <div
                  className="w-2 h-2 bg-black absolute -top-1.5 -rotate-45 z-50"
                  style={{
                    left: inputRef.current
                      ? `${inputRef.current.getBoundingClientRect().left + inputRef.current.offsetWidth / 2 - dropdownLeftOffset}px`
                      : "50%",
                  }}
                />
              </>
            )}
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
              isMobile ? (
                <MobileLayout
                  results={results}
                  topCategories={topCategories}
                  topBrands={topBrands}
                  highlightQuery={highlightQuery}
                  colors={internalConfig.colors!}
                  showBorders={internalConfig.showBorders ?? false}
                  query={query}
                  setQuery={setQuery}
                  setIsOpen={setIsOpen}
                  placeholder={internalConfig.placeholder}
                />
              ) : (
                <ColumnLayout
                  results={results}
                  topQueries={topQueries}
                  topCategories={topCategories}
                  topBrands={topBrands}
                  highlightQuery={highlightQuery}
                  colors={internalConfig.colors!}
                  showBorders={internalConfig.showBorders ?? false}
                />
              )
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