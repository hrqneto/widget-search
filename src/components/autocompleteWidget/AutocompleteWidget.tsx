import { useEffect, useRef, useState } from "react";
import SearchInput from "../searchInput/SearchInput";
import LayoutSwitch from "../layout/LayoutSwitch";
import MobileLayout from "../columnLayout/MobileLayout";

import { useAutocomplete } from "../../hooks/useAutocomplete";
import { useWidgetState } from "../../hooks/useWidgetState";
import { useOutsideClickClose } from "../../hooks/useOutsideClickClose";
import { useWidgetConfigMerged } from "../../hooks/useWidgetConfigMerged";
import { useDropdownPosition } from "../../hooks/useDropdownPosition";
import { useHandleQueryChange } from "../../hooks/useHandleQueryChange";
import { useBlockUpdater } from "../../hooks/useBlockUpdater";

import { highlightQuery as baseHighlightQuery } from "../../utils/highlightQuery";
import { WidgetConfigContext } from "../../context/WidgetConfigContext";
import type { AutocompleteWidgetProps, BlockConfig, WidgetConfig } from "../../types";
import { useIsMobile } from "../../hooks/useIsMobile";
import { getDefaultBlockConfigs } from "../../utils/defaultBlockConfigs";
import WidgetEditorUI from "../autocompleteWidget/WidgetEditorUI";

const AutocompleteWidget = ({ config: externalConfig, showConfigUI = false }: AutocompleteWidgetProps) => {
  const {
    query, setQuery, results, setResults,
    isLoading, setIsLoading, isOpen, setIsOpen,
    topQueries, setTopQueries,
    topCategories, setTopCategories,
    topBrands, setTopBrands,
  } = useWidgetState();

  const [blockConfigs, setBlockConfigs] = useState<BlockConfig[]>(getDefaultBlockConfigs());
  const [caretLeftOffset, setCaretLeftOffset] = useState(0);
  const [fixarAberto, setFixarAberto] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dropdownLeftOffset, setDropdownLeftOffset] = useState<number>(0);
  const highlightQuery = (text: string) => baseHighlightQuery(text, query);
  const isMobile = useIsMobile(1020);

  const previewConfig =
    typeof window !== "undefined" && window.BUSCAFLEX_CONFIG
      ? window.BUSCAFLEX_CONFIG
      : null;

  console.log("🟡 previewConfig =", previewConfig);

  const internalConfig = useWidgetConfigMerged((previewConfig || externalConfig) as WidgetConfig);
  const clientId = previewConfig?.clientId || externalConfig.clientId || "products";

  useEffect(() => {
    if (previewConfig?.blockConfigs?.length) {
      console.log("🟢 Aplicando blockConfigs vindos do previewConfig:", previewConfig.blockConfigs);
      setBlockConfigs(previewConfig.blockConfigs);
    } else {
      console.log("🔴 Nenhum blockConfig válido no previewConfig");
    }
  }, [previewConfig]);

  const sortedBlockConfigs = [...blockConfigs]
    .filter((b) => b.enabled)
    .sort((a, b) => a.position - b.position);

  console.log("🧩 blockConfigs dentro do AutocompleteWidget:", blockConfigs);

  const structure = sortedBlockConfigs.map((b) => b.id);

  const {
    fetchInitialSuggestions,
    fetchAutocompleteResults,
    debouncedFetchAutocomplete,
  } = useAutocomplete(
    clientId, setTopQueries, setTopCategories, setTopBrands, setResults, setIsLoading
  );

  const updateBlock = useBlockUpdater(setBlockConfigs);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);

  useHandleQueryChange(query, fetchInitialSuggestions, debouncedFetchAutocomplete, setIsOpen);
  useDropdownPosition({
    inputRef,
    dropdownRef,
    setDropdownLeftOffset,
    setCaretLeftOffset,
    deps: [query, isOpen],
    inputContainerRef,
  });
  
  useOutsideClickClose([dropdownRef, inputRef, inputContainerRef], () => {
    if (!fixarAberto) setIsOpen(false);
  });
  
  return (
    <WidgetConfigContext.Provider value={internalConfig}>
      <div ref={inputContainerRef}  className="relative w-full max-w-full mx-auto mt-4">
        <div className={isMobile && isOpen ? "hidden" : "block"}>
          {showConfigUI && (
            <WidgetEditorUI
              blockConfigs={blockConfigs}
              updateBlock={updateBlock}
              fixarAberto={fixarAberto}
              setFixarAberto={setFixarAberto}
            />
          )}
          <SearchInput
            inputRef={inputRef}
            query={query}
            setQuery={setQuery}
            setIsOpen={setIsOpen}
            placeholder={internalConfig.placeholder || ""}
            fetchAutocompleteResults={fetchAutocompleteResults}
            fetchSuggestions={fetchInitialSuggestions}
          />
        </div>
        {isOpen && (
          <div
          ref={dropdownRef}
          className={`autocomplete-dropdown ${
            isMobile
              ? "fixed inset-0 w-screen h-screen bg-white z-[9999] rounded-none"
              : "absolute min-h-[500px] mt-3.5 border border-gray-950 rounded-lg z-50 bg-white"
          }`}
          style={{
            overflow: "visible",
            backgroundColor: internalConfig.colors?.background,
            width: isMobile ? "100%" : "980px",
            left: !isMobile ? `${dropdownLeftOffset}px` : undefined,
            top: !isMobile ? '40px' : undefined,
          }}
        >
          {!isMobile && (
            <>
              <div className="h-1 bg-black rounded-t-md absolute top-0 left-0 w-full" />
              <div
                className="w-2 h-2 bg-black absolute -top-1.5 -rotate-45 z-50"
                style={{ left: `${caretLeftOffset}px` }}
              />
            </>
          )}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar dropdown"
            >✕</button>
            {isLoading ? (
              <p className="text-center text-gray-500 py-6">Carregando resultados...</p>
            ) : (
              (topQueries.length || topCategories.length || topBrands.length || results.length) ? (
                isMobile ? (
                  <MobileLayout
                    layout={internalConfig.layout || "destaqueMobile"}
                    isMobile={isMobile}
                    results={results}
                    topQueries={topQueries}
                    topCategories={topCategories}
                    topBrands={topBrands}
                    highlightQuery={highlightQuery}
                    colors={internalConfig.colors || {}}
                    showBorders={internalConfig.showBorders}
                    query={query}
                    setQuery={setQuery}
                    setIsOpen={setIsOpen}
                    placeholder={internalConfig.placeholder || ""}
                    structure={structure}
                    blockConfigs={sortedBlockConfigs}
                  />
                ) : (
                  <LayoutSwitch
                    layout={internalConfig.layout || "grid"}
                    isMobile={isMobile}
                    results={results}
                    topQueries={topQueries}
                    topCategories={topCategories}
                    topBrands={topBrands}
                    highlightQuery={highlightQuery}
                    colors={internalConfig.colors || {}}
                    showBorders={internalConfig.showBorders}
                    query={query}
                    setQuery={setQuery}
                    setIsOpen={setIsOpen}
                    placeholder={internalConfig.placeholder || ""}
                    structure={structure}
                    blockConfigs={sortedBlockConfigs}
                  />
                )
              ) : (
                <p className="text-center text-gray-400 text-sm py-8">Nenhuma sugestão disponível.</p>
              )
            )}
          </div>
        )}
      </div>
    </WidgetConfigContext.Provider>
  );
};

export default AutocompleteWidget;
