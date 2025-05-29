
import { useEffect, useRef, useState } from "react";
import SearchInput from "../searchInput/SearchInput";
import LayoutSwitch from "../layout/LayoutSwitch";
import MobileLayout from "../columnLayout/MobileLayout";
import { useAutocomplete } from "../../hooks/useAutocomplete";
import { useWidgetState } from "../../hooks/useWidgetState";
import { useOutsideClickClose } from "../../hooks/useOutsideClickClose";
import { useWidgetConfigMerged } from "../../hooks/useWidgetConfigMerged";
import { highlightQuery as baseHighlightQuery } from "../../utils/highlightQuery";
import { WidgetConfigContext } from "../../context/WidgetConfigContext";
import type { AutocompleteWidgetProps, BlockConfig } from "../../types";
import { useIsMobile } from "../../hooks/useIsMobile";
import { ReactNode } from "react";

const defaultBlockConfigs: BlockConfig[] = [
  { id: "hero", enabled: true, position: 0, name: "Top product", size: 1, heroName: "Top product" },
  { id: "products", enabled: true, position: 1, name: "Products", size: 7 },
  { id: "queries", enabled: true, position: 2, name: "Queries", size: 4, recommendedName: "Top queries", recommendedSize: 4 },
  { id: "categories", enabled: true, position: 3, name: "Categories", size: 5, recommendedName: "Top categories", recommendedSize: 5 },
  { id: "brands", enabled: true, position: 4, name: "Brands", size: 5, recommendedName: "Top brands", recommendedSize: 5 },
];

const AutocompleteWidget = ({ config: externalConfig, showConfigUI = false }: AutocompleteWidgetProps) => {
  console.log("AutocompleteWidget showConfigUI:", showConfigUI);
  const {
    query, setQuery, results, setResults,
    isLoading, setIsLoading, isOpen, setIsOpen,
    topQueries, setTopQueries,
    topCategories, setTopCategories,
    topBrands, setTopBrands,
  } = useWidgetState();

  const clientId = externalConfig.clientId || "products";
  const internalConfig = useWidgetConfigMerged(externalConfig);
  const highlightQuery = (text: string): ReactNode => baseHighlightQuery(text, query);
  const isMobile = useIsMobile(1020);

  const [fixarAberto, setFixarAberto] = useState(true);

  const [blockConfigs, setBlockConfigs] = useState<BlockConfig[]>(defaultBlockConfigs);

  useEffect(() => {
    if (typeof window !== "undefined" && window.BUSCAFLEX_PREVIEW) {
      const interval = setInterval(() => {
        const config = window.BUSCAFLEX_CONFIG;
        if (config?.blockConfigs) {
          setBlockConfigs(config.blockConfigs);
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, []);

  
  const structure = blockConfigs.filter(b => b.enabled).map(b => b.id);
  const [caretLeftOffset, setCaretLeftOffset] = useState(0);

  const {
    fetchInitialSuggestions,
    fetchAutocompleteResults,
    debouncedFetchAutocomplete,
  } = useAutocomplete(
    clientId, setTopQueries, setTopCategories, setTopBrands, setResults, setIsLoading
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [, setDropdownLeftOffset] = useState<number>(0);

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
  
    const idealLeft = inputRect.left + inputRef.current.offsetWidth / 2 - dropdownWidth / 2;
    const maxLeft = screenWidth - dropdownWidth - margin;
    const boundedLeft = Math.max(margin, Math.min(idealLeft, maxLeft));
    setDropdownLeftOffset(boundedLeft);
  
    // posicionamento caret
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const relativeCaretLeft = inputRect.left + inputRect.width / 2 - dropdownRect.left;
    
    setCaretLeftOffset(relativeCaretLeft);
    
  }, [query, isOpen]);
  

  useOutsideClickClose("autocomplete-dropdown", () => {
    if (!fixarAberto) setIsOpen(false);
  });

  const updateBlock = (id: BlockConfig["id"], key: keyof BlockConfig, value: any) => {
    setBlockConfigs(prev => prev.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  return (
    <WidgetConfigContext.Provider value={{ ...internalConfig }}>
      <div className="relative w-full max-w-full mx-auto mt-4">
        <div className={isMobile && isOpen ? "hidden" : "block"}>
          {showConfigUI && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm p-2 bg-gray-50 rounded">
              {blockConfigs.map(block => (
                <div key={block.id} className="border p-2 rounded bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold capitalize">{block.id}</label>
                    <input
                      type="checkbox"
                      checked={block.enabled}
                      onChange={() => updateBlock(block.id, "enabled", !block.enabled)}
                      className="accent-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <label className="col-span-1">Position <input type="number" className="border rounded px-1 w-full" value={block.position} onChange={e => updateBlock(block.id, "position", parseInt(e.target.value))} /></label>
                    <label className="col-span-1">Size <input type="number" className="border rounded px-1 w-full" value={block.size} onChange={e => updateBlock(block.id, "size", parseInt(e.target.value))} /></label>
                    <label className="col-span-2">Name <input type="text" className="border rounded px-1 w-full" value={block.name} onChange={e => updateBlock(block.id, "name", e.target.value)} /></label>
                    {block.recommendedName !== undefined && (
                      <>
                        <label className="col-span-1">Recommended Name <input type="text" className="border rounded px-1 w-full" value={block.recommendedName} onChange={e => updateBlock(block.id, "recommendedName", e.target.value)} /></label>
                        <label className="col-span-1">Recommended Size <input type="number" className="border rounded px-1 w-full" value={block.recommendedSize} onChange={e => updateBlock(block.id, "recommendedSize", parseInt(e.target.value))} /></label>
                      </>
                    )}
                    {block.heroName !== undefined && (
                      <label className="col-span-2">Hero Product Name <input type="text" className="border rounded px-1 w-full" value={block.heroName} onChange={e => updateBlock(block.id, "heroName", e.target.value)} /></label>
                    )}
                  </div>
                </div>
              ))}
              <div className="col-span-full text-right mt-2">
                <label className="text-red-600 font-medium">
                  <input
                    type="checkbox"
                    checked={fixarAberto}
                    onChange={() => setFixarAberto(prev => !prev)}
                    className="mr-1"
                  /> manter aberto
                </label>
              </div>
            </div>
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
              //left: isMobile ? undefined : dropdownLeftOffset,
              width: isMobile ? "100%" : "980px",
            }}
          >
            {/* Caret e ribbon (apenas no desktop) */}
            {!isMobile && (
              <>
                {/* Ribbon */}
                <div className="h-1 bg-black rounded-t-md absolute top-0 left-0 w-full" />
                <div
                  className="w-2 h-2 bg-black absolute -top-1.5 -rotate-45 z-50"
                  style={{
                    left: `${caretLeftOffset}px`,
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
            ) : (
              (topQueries.length > 0 ||
                topCategories.length > 0 ||
                topBrands.length > 0 ||
                results.length > 0) ? (
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
                    blockConfigs={blockConfigs}
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
                    blockConfigs={blockConfigs}
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
