import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

// ✅ Definição das interfaces
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
  backgroundColor: string;
  placeholder: string;
}

// ✅ Definição de constantes para evitar "hardcoded strings"
const API_BASE_URL = "http://localhost:8085/api";
const DEFAULT_CONFIG: WidgetConfig = {
  backgroundColor: "#ffffff",
  placeholder: "O que você procura?",
};

// 🔪 Função para truncar texto muito longo
const truncate = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? text.slice(0, maxLength - 3).trim() + "..." : text;
};

const BuscaFlexWidget = () => {
  const [query, setQuery] = useState("");
  const [lastSentQuery, setLastSentQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<WidgetConfig>(DEFAULT_CONFIG);

  // TODO - organizar modulo - Busca configurações da loja no Firestore
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/configs/loja123?t=${Date.now()}`
        );
        if (!response.ok) throw new Error("Erro ao carregar configurações");

        const data: WidgetConfig = await response.json();
        setConfig(data);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    fetchConfig();
  }, []);

  // TODO - chamada do microservico(python) - autocomplete search
  const fetchAutocompleteResults = async (value: string) => {
    setIsLoading(true);
  
    const getTopItems = (
      produtos: Produto[],
      key: "category" | "brand",
      limit: number
    ): string[] => {
      const countMap = produtos.reduce<Record<string, number>>((acc, produto) => {
        const val = produto[key];
        if (val) {
          acc[val] = (acc[val] || 0) + 1;
        }
        return acc;
      }, {});
  
      return Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([item]) => item);
    };
  
    try {
      const response = await fetch(
        `${API_BASE_URL}/autocomplete/search?q=${encodeURIComponent(value)}`
      );
  
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("📦 Dados autocomplete:", data);
      const produtos: Produto[] = data.products || [];
  
      setTopQueries(data.queries?.map((q: any) => q.query) || []);
      setTopCategories(
        data.catalogues?.map((c: any) => c.name) || getTopItems(produtos, "category", 5)
      );
      setTopBrands(
        data.brands?.map((b: any) => b.name) || getTopItems(produtos, "brand", 5)
      );
      setResults({
        resultados: produtos,
      });
    } catch (err) {
      console.error("Erro ao buscar autocomplete:", err);
      setResults({ resultados: [] });
    } finally {
      setIsLoading(false);
    }
  };
  
  //TODO organizar modulos - chamada do servico de sugestoes iniciais
  useEffect(() => {
    if (query.trim().length < 1) {
      setIsOpen(true);
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
  }, [query]);  
  
  const debouncedFetchAutocomplete = useMemo(
    () => debounce(fetchAutocompleteResults, 300),
    []
  );

  const [topQueries, setTopQueries] = useState<string[]>([]);
  const [topCategories, setTopCategories] = useState<string[]>([]);
  const [topBrands, setTopBrands] = useState<string[]>([]);

  // ✅ Função para destacar o termo buscado dinamicamente
  const highlightQuery = (text: string) => {
    if (!query) return text;
    
    const escapedQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'); // Escape Regex
    const parts = escapedQuery.split(/\s+/).filter(Boolean); // Divide por espaços
  
    const regex = new RegExp(`(${parts.join("|")})`, "gi");
  
    const splitParts = text.split(regex);
  
    return splitParts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="bg-yellow-200 rounded px-1">{part}</mark>
        : <span key={i}>{part}</span>
    );
  };  

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-4">
      <input
        type="text"
        autoComplete="off"
        className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
        placeholder={config.placeholder}
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
        onBlur={() => {
          setTimeout(() => {
            if (!document.activeElement?.closest(".autocomplete-dropdown")) {
              setIsOpen(false);
            }
          }, 100);
        }}
        style={{ backgroundColor: config.backgroundColor }}
      />


      {isOpen &&
        (topQueries.length > 0 ||
          topCategories.length > 0 ||
          topBrands.length > 0 ||
          results) && (
            //abertura do dropdown de busca
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-[1080px] min-h-[400px] border shadow-lg mt-2 rounded-lg p-4 z-50 h-auto overflow-y-auto bg-white autocomplete-dropdown"
            style={{ backgroundColor: config.backgroundColor }}
          >
            
            {/* Ribbon vermelha */}
            <div className="h-1 bg-red-500 rounded-t-md absolute top-0 left-0 w-full" />
            {/* Caret apontando para o input */}
            <div className="w-2 h-2 bg-red-500 absolute -top-1.5 left-1/2 transform -translate-x-1/2 -rotate-45 z-50" />
                      
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
              <div className="grid grid-cols-[1.2fr_1.5fr_4fr] gap-4 h-full">
                {/* Coluna 1 - buscas - categorias - marcas */}
                <div className="p-4 rounded-lg">
                    {/* Top Queries */}
                    <h3 className="font-bold text-gray-700 mb-2">Top Queries</h3>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {topQueries.length > 0 ? (
                        topQueries.map((item, index) => (
                          <span
                            key={`${item}-${index}`}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium"
                          >
                            {highlightQuery(item)}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">
                          Nenhuma pesquisa encontrada
                        </p>
                      )}
                    </div>

                  {/* Top Categories */}
                  <h3 className="font-bold text-gray-700 mb-2">Top Categories</h3>
                  <ul className="space-y-1 mb-4">
                    {topCategories.length > 0 ? (
                      topCategories.map((category, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {highlightQuery(category)}
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        Nenhuma categoria encontrada
                      </p>
                    )}
                  </ul>

                  {/* Top Brands */}
                  <h3 className="font-bold text-gray-700 mb-2">Top Brands</h3>
                  <ul className="space-y-1">
                    {topBrands.length > 0 ? (
                      topBrands.map((brand, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {highlightQuery(brand)}
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        Nenhuma marca disponível
                      </p>
                    )}
                  </ul>
                </div>

                {/* Coluna 2 - Produto em Destaque */}
                <div className="p-4 border-l">
                  {results?.resultados?.length > 0 ? (
                    <div className="text-center flex flex-col items-center justify-center">
                      <h3 className="font-bold text-gray-700 mb-2">Top Product</h3>

                      <a
                        href={results.resultados[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={
                            results.resultados[0].image &&
                            results.resultados[0].image.startsWith("http")
                              ? results.resultados[0].image
                              : "https://via.placeholder.com/150?text=Ver"
                          }
                          alt={results.resultados[0].title}
                          className="w-[215px] h-[215px] md:w-[150px] md:h-[150px] object-cover "
                        />
                      </a>

                      <p className="text-sm font-semibold text-gray-900 mt-2 text-center">
                        {highlightQuery(truncate(results.resultados[0].title))}
                      </p>

                      <p className="text-green-500 font-bold text-lg mt-1">
                        R$ {results.resultados[0].price.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="font-bold text-gray-700 mb-2">Top Product</h3>
                      <p className="text-sm text-gray-400">Nenhum produto em destaque</p>
                    </div>
                  )}
                </div>

                {/* 🔥 Coluna 3 - Lista de Produtos  */}
                <div className="p-4 border-l w-full relative flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-700 mb-2">Top Products</h3>
                    <div className="grid grid-cols-2 gap-4 transition-opacity duration-300 ease-in-out">
                      {results?.resultados?.length > 1 ? (
                        results.resultados.slice(1, 7).map((product) => (
                          <div
                            key={product.id}
                            className="flex gap-3 p-3 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
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

                            <div className="flex flex-col justify-center text-left space-y-1 overflow-hidden">
                              <p className="text-sm font-semibold text-gray-900 leading-5 truncate">
                                {highlightQuery(truncate(product.title, 55))}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {highlightQuery(truncate(product.category, 40))}
                              </p>
                              <p className="text-green-500 font-bold text-sm">
                                R$ {product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">Nenhum produto encontrado</p>
                      )}
                    </div>
                  </div>

                  {/* Botão fixado no canto inferior direito */}
                  {results?.resultados?.length > 0 && (
                    <div className="w-full flex justify-end mt-4">
                      <button
                        className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
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
