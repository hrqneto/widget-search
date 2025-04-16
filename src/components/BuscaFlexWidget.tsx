import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
declare global {
  interface Window {
    BUSCAFLEX_PREVIEW?: boolean;
  }
}

interface Produto {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  image?: string;
  url?: string;
}

interface SearchResults {
  resultados: Produto[];
}

interface WidgetConfig {
  clientId?: string;
  placeholder?: string;
  layout?: "heromobile" | "line" | "grid";
  alignment?: "left" | "center" | "right";
  blockPosition?: "left" | "right";
  showHeroProduct?: boolean;
  showSuggestions?: boolean;
  showBorders?: boolean;
  apiBaseUrl?: string;
  colors?: {
    main?: string;
    background?: string;
    highlight?: string;
    text?: string;
    border?: string;
    headerText?: string;
    mutedText?: string;
    noResultsText?: string;
    hoverItem?: string;
  };
}

const API_BASE_URL = "http://localhost:8085/api";
const DEFAULT_CONFIG: WidgetConfig = {
  placeholder: "O que você procura?",
  colors: {
    background: "#ffffff",
    text: "#000000",
    main: "#770195",
    highlight: "#EC46D8",
    border: "#E5E7EB",
    headerText: "#770195",
    mutedText: "#484848",
    noResultsText: "#000000",
    hoverItem: "#EC46D8"
  }
};

const truncate = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? text.slice(0, maxLength - 3).trim() + "..." : text;
};

const BuscaFlexWidget = ({ config: externalConfig }: { config: WidgetConfig }) => {
  const clientId = externalConfig.clientId || "products";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ resultados: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [internalConfig, setInternalConfig] = useState<WidgetConfig>(DEFAULT_CONFIG);
  const [topQueries, setTopQueries] = useState<string[]>([]);
  const [topCategories, setTopCategories] = useState<string[]>([]);
  const [topBrands, setTopBrands] = useState<string[]>([]);

  useEffect(() => {
    setInternalConfig({
      ...DEFAULT_CONFIG,
      ...externalConfig,
      colors: {
        ...DEFAULT_CONFIG.colors,
        ...externalConfig.colors,
      },
    });
  }, [externalConfig]);

  const fetchAutocompleteResults = async (value: string) => {
    setIsLoading(true);
    const getTopItems = (produtos: Produto[], key: "category" | "brand", limit: number): string[] => {
      const countMap = produtos.reduce<Record<string, number>>((acc, produto) => {
        const val = produto[key];
        if (val) acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([item]) => item);
    };

    try {
      const response = await fetch(`${API_BASE_URL}/autocomplete/search?q=${encodeURIComponent(value)}&client_id=${clientId}`);
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
      const data = await response.json();
      const produtos: Produto[] = data.products || [];
      setTopQueries(data.queries?.map((q: any) => q.query) || []);
      setTopCategories(data.catalogues?.map((c: any) => c.name) || getTopItems(produtos, "category", 5));
      setTopBrands(data.brands?.map((b: any) => b.name) || getTopItems(produtos, "brand", 5));
      setResults({ resultados: produtos });
    } catch (err) {
      console.error("Erro ao buscar autocomplete:", err);
      setResults({ resultados: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim().length < 1) {
      setIsOpen(true);
      fetch(`${API_BASE_URL}/autocomplete/suggestions?client_id=${clientId}`)
        .then((res) => res.json())
        .then((data) => {
          setTopQueries(data.topQueries.map((q: any) => q.query));
          setTopCategories(data.topCategories.map((c: any) => c.name));
          setTopBrands(data.topBrands.map((b: any) => b.name));
          setResults({ resultados: data.topProducts || [] });
        })
        .catch((err) => console.error("Erro ao buscar sugestões iniciais:", err));
    }
  }, [query, clientId]);

  const debouncedFetchAutocomplete = useMemo(() => debounce(fetchAutocompleteResults, 300), []);

  const highlightQuery = (text: string) => {
    if (!query) return text;
    const escapedQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    const parts = escapedQuery.split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${parts.join("|")})`, "gi");
    const splitParts = text.split(regex);
    return splitParts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="bg-yellow-200 rounded px-1">{part}</mark>
        : <span key={i}>{part}</span>
    );
  };

  useEffect(() => {
    // Esse efeito só roda no modo preview do admin
    if (!window.BUSCAFLEX_PREVIEW) return;
  
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
  
      const insideDropdown = target.closest(".autocomplete-dropdown");
      const insideInput = target.closest("input[name='q']");
  
      if (!insideDropdown && !insideInput) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("pointerdown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);  

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-4">
      <input
        type="text"
        autoComplete="off"
        className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
        placeholder={internalConfig.placeholder}
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setIsOpen(true);

          if (value.length >= 1) {
            debouncedFetchAutocomplete(value);
          } else {
            // 👇 Se limpar o campo, volta para sugestões iniciais
            fetch(`${API_BASE_URL}/autocomplete/suggestions`)
              .then((res) => res.json())
              .then((data) => {
                setTopQueries(data.topQueries.map((q: any) => q.query));
                setTopCategories(data.topCategories.map((c: any) => c.name));
                setTopBrands(data.topBrands.map((b: any) => b.name));
                setResults({
                  resultados: data.topProducts || [],
                });
              })
              .catch((err) => {
                console.error("Erro ao buscar sugestões iniciais:", err);
                setResults({ resultados: [] });
              });
          }
        }}
        onFocus={() => {
          setIsOpen(true);

          if (query.length >= 1) {
            if (!results) {
              fetchAutocompleteResults(query);
            }
          } else {
            fetch(`${API_BASE_URL}/autocomplete/suggestions`)
              .then((res) => res.json())
              .then((data) => {
                setTopQueries(data.topQueries.map((q: any) => q.query));
                setTopCategories(data.topCategories.map((c: any) => c.name));
                setTopBrands(data.topBrands.map((b: any) => b.name));
                setResults({
                  resultados: data.topProducts || [],
                });
              })
              .catch((err) =>
                console.error("Erro ao buscar sugestões iniciais:", err)
              );
          }
        }}
      />

    {isOpen &&
      (topQueries.length > 0 ||
        topCategories.length > 0 ||
        topBrands.length > 0 ||
        results) && (
          //abertura do dropdown de busca
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-[980px] min-h-[500px] border shadow-lg mt-2 rounded-lg z-50 h-auto overflow-y-auto bg-white autocomplete-dropdown"
            style={{ backgroundColor: internalConfig.colors?.background }}
          >

          {/* Ribbon vermelha */}
          <div className="h-1 bg-black rounded-t-md absolute top-0 left-0 w-full" />
          {/* Caret apontando para o input */}
          <div className="w-2 h-2 bg-black absolute -top-1.5 left-1/2 transform -translate-x-1/2 -rotate-45 z-50" />
                    
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          {isLoading ? (
            <p className="text-center text-gray-500 py-6">Carregando resultados...</p>
          ) : results?.resultados?.length > 0 ? (
            // ✅ BLOCO PRINCIPAL COM OS 3 PAINÉIS
            <div className="grid grid-cols-[200px_200px_1fr] min-h-[500px] gap-4">

              {/* 🔷 Coluna 1 - buscas - categorias - marcas */}
              <div
                className="relative w-full min-w-[200px] max-w-[300px]"
                style={{
                  borderLeft: internalConfig.showBorders
                    ? `1px solid ${internalConfig.colors?.border}`
                    : undefined,
                }}
              >
                {/* Fundo colorido com opacidade */}
                <div
                  className="absolute inset-0 z-0 h-full w-full rounded-l-lg"
                  style={{
                    backgroundColor: internalConfig.colors?.highlight
                      ? `${internalConfig.colors.highlight}22`
                      : "rgba(0,0,0,0.05)",
                  }}
                />

                {/* Conteúdo visível acima do fundo */}
                <div className="relative z-10 px-4 py-4 w-full">
                  {/* Top Queries */}
                  <h3
                    className="font-bold mb-2"
                    style={{ color: internalConfig.colors?.headerText }}
                  >
                    Top Queries
                  </h3>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {topQueries.length > 0 ? (
                      topQueries.map((item, index) => (
                        <span
                          key={`${item}-${index}`}
                          className="px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition"
                          style={{
                            backgroundColor: internalConfig.colors?.highlight,
                            color: internalConfig.colors?.text,
                          }}
                        >
                          {highlightQuery(item)}
                        </span>
                      ))
                    ) : (
                      <p
                        className="text-sm"
                        style={{ color: internalConfig.colors?.mutedText }}
                      >
                        Nenhuma pesquisa encontrada
                      </p>
                    )}
                  </div>

                  {/* Top Categories */}
                  <h3
                    className="font-bold mb-2"
                    style={{ color: internalConfig.colors?.headerText }}
                  >
                    Top Categories
                  </h3>
                  <ul className="space-y-1 mb-4">
                    {topCategories.length > 0 ? (
                      topCategories.map((category, index) => (
                        <li
                          key={index}
                          className="text-sm truncate cursor-pointer hover:underline transition"
                          style={{
                            color: internalConfig.colors?.text,
                          }}
                        >
                          {highlightQuery(category)}
                        </li>
                      ))
                    ) : (
                      <p
                        className="text-sm"
                        style={{ color: internalConfig.colors?.mutedText }}
                      >
                        Nenhuma categoria encontrada
                      </p>
                    )}
                  </ul>

                  {/* Top Brands */}
                  <h3
                    className="font-bold mb-2"
                    style={{ color: internalConfig.colors?.headerText }}
                  >
                    Top Brands
                  </h3>
                  <ul className="space-y-1">
                    {topBrands.length > 0 ? (
                      topBrands.map((brand, index) => (
                        <li
                          key={index}
                          className="text-sm truncate cursor-pointer hover:underline transition"
                          style={{
                            color: internalConfig.colors?.text,
                          }}
                        >
                          {highlightQuery(brand)}
                        </li>
                      ))
                    ) : (
                      <p
                        className="text-sm"
                        style={{ color: internalConfig.colors?.mutedText }}
                      >
                        Nenhuma marca disponível
                      </p>
                    )}
                  </ul>
                </div>
              </div>
              {/* 🟣 Coluna 2 - Produto em Destaque */}
              <div className="p-4 w-[200px] flex flex-col items-center justify-start">
                {results?.resultados?.length > 0 ? (
                  <div className="text-center flex flex-col items-center justify-center w-full">
                    <h3
                      className="font-bold mb-2"
                      style={{ color: internalConfig.colors?.headerText }}
                    >
                      Top Product
                    </h3>

                    <a
                      href={results.resultados[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={
                          results.resultados[0].image?.startsWith("http")
                            ? results.resultados[0].image
                            : "https://via.placeholder.com/150?text=Ver"
                        }
                        alt={results.resultados[0].title}
                        className="w-[215px] h-[215px] md:w-[150px] md:h-[150px] object-cover rounded-md"
                      />
                    </a>

                    {/* Wrapper seguro para truncar conteúdo com destaque */}
                    <div className="w-full px-2 mt-2 overflow-hidden text-center">
                      <p
                        className="text-sm font-semibold leading-snug text-center"
                        style={{ color: internalConfig.colors?.text }}
                      >
                        <span className="truncate inline-block max-w-full align-middle overflow-hidden whitespace-nowrap">
                          {highlightQuery(truncate(results.resultados[0].title))}
                        </span>
                      </p>
                    </div>

                    <p
                      className="font-bold text-lg mt-1"
                      style={{ color: internalConfig.colors?.highlight }}
                    >
                      R$ {results.resultados[0].price.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center justify-center">
                    <h3
                      className="font-bold mb-2"
                      style={{ color: internalConfig.colors?.headerText }}
                    >
                      Top Product
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: internalConfig.colors?.noResultsText }}
                    >
                      Nenhum produto em destaque
                    </p>
                  </div>
                )}
              </div>

              {/* 🔥 Coluna 3 - Lista de Produtos  */}
              <div
                className="p-4 col-span-1 flex-1"
                style={{
                  borderLeft: internalConfig.showBorders ? `1px solid ${internalConfig.colors?.border}` : undefined
                }}
              >
                <div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: internalConfig.colors?.headerText }}
                  >
                    Top Products
                  </h3>

                  <div className="grid grid-cols-2 gap-4 transition-opacity duration-300 ease-in-out">
                    {results?.resultados?.length > 1 ? (
                      results.resultados.slice(1, 7).map((product) => (
                        <div
                          key={product.id}
                          className="flex gap-3 p-3 rounded-lg transition-transform transform hover:scale-105"
                          style={{
                            backgroundColor: internalConfig.colors?.hoverItem,
                            cursor: "pointer"
                          }}
                        >
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-[64px] max-w-[64px] min-h-[64px] max-h-[64px] flex-shrink-0"
                          >
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                e.currentTarget.src = "https://cdn.buscaflex.com/fallback.jpg";
                              }}
                            />
                          </a>

                          <div className="max-w-full px-2 text-centerZ overflow-hidden">
                            <p
                              className="text-sm font-semibold leading-snug truncate"
                              style={{ color: internalConfig.colors?.text }}
                            >
                              {highlightQuery(truncate(product.title, 55))}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{ color: internalConfig.colors?.mutedText }}
                            >
                              {highlightQuery(truncate(product.category, 40))}
                            </p>
                            <p
                              className="font-bold text-sm"
                              style={{ color: internalConfig.colors?.highlight }}
                            >
                              R$ {product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p
                        className="text-sm"
                        style={{ color: internalConfig.colors?.noResultsText }}
                      >
                        Nenhum produto encontrado
                      </p>
                    )}
                  </div>
                </div>

                {/* Botão fixado no canto inferior direito */}
                {results?.resultados?.length > 0 && (
                  <div className="w-full flex justify-end mt-4">
                    <button
                      className="px-4 py-2 rounded transition"
                      style={{
                        border: `1px solid ${internalConfig.colors?.border}`,
                        color: internalConfig.colors?.text,
                        backgroundColor: internalConfig.colors?.background
                      }}
                      onClick={() => {
                        window.location.href = `/busca?q=${encodeURIComponent(query)}`;
                      }}
                    >
                      Ver todos os resultados
                    </button>
                  </div>
                )}
              </div>


            </div>
          ) : (
            <div className="py-6 text-center text-gray-500 text-base mt-2">
              Nenhum resultado encontrado para <strong>{query}</strong>
            </div>
          )}

        </div>
      )}
  </div>
  );
};

export default BuscaFlexWidget;
