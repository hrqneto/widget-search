import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

// Definição do tipo para os resultados
interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  marca: string;
  estoque: number;
  imagem: string;
  relevancia: number;
}

interface SearchResults {
  resultados?: Produto[];
  recomendados?: Produto[];
}

const API_BASE_URL = `http://localhost:8085/api`;

const BuscaFlexWidget = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Função para buscar produtos na API com debounce para evitar múltiplas chamadas
  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data: SearchResults = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchResults = useCallback(debounce(fetchResults, 500), []);

  useEffect(() => {
    if (query.length > 1) {
      debouncedFetchResults(query);
      setIsOpen(true);
    } else {
      setResults(null);
      setIsOpen(false);
    }
  }, [query, debouncedFetchResults]);

  // 🏷️ Função para encontrar as 3 categorias mais buscadas
  const getTopCategories = () => {
    if (!results?.resultados) return [];

    // Contador de categorias
    const categoryCount: Record<string, number> = {};
    results.resultados.forEach((produto) => {
      categoryCount[produto.categoria] = (categoryCount[produto.categoria] || 0) + 1;
    });

    // Ordena as categorias por número de ocorrências e pega as 6 mais populares
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1]) // Ordena da mais frequente para a menos frequente
      .slice(0, 6) // Pega só as 6 primeiras
      .map(([categoria]) => categoria);
  };

  const getTopBrands = () => {
    if (!results?.resultados) return [];
  
    const brandCount: Record<string, number> = {};
    results.resultados.forEach((produto) => {
      if (produto.marca) {
        brandCount[produto.marca] = (brandCount[produto.marca] || 0) + 1;
      }
    });
  
    return Object.entries(brandCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([marca]) => marca);
  };
  

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-4">
      <input
        type="text"
        className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
        placeholder="O que você procura queride?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
  
      {isOpen && results && (
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[1080px] min-h-[400px] border shadow-lg mt-2 rounded-lg p-4 z-50 h-auto overflow-y-auto bg-white">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
  
          {isLoading ? (
            <p className="text-center text-gray-500">Carregando resultados...</p>
          ) : (
            <div className="grid grid-cols-[1.8fr_1.5fr_3fr] gap-4 h-full">
              
              {/* Coluna 1 - Categorias */}
              <div className="p-4 rounded-lg">

              <h3 className="font-bold text-gray-700 mb-2">Top Queries</h3>
              <div className="flex gap-2 flex-wrap mb-4">
                {results?.resultados && results.resultados.length > 0 ? (
                  // Aqui você pode ajustar com as queries reais da API quando tiver
                  ["Kalimba", "Guitar", "Ukulele"].map((query, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {query}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Nenhuma pesquisa encontrada</p>
                )}
              </div>

              <h3 className="font-bold text-gray-700 mb-2">Top Categories</h3>
              <ul className="space-y-1 mb-4">
                {getTopCategories().length > 0 ? (
                  getTopCategories().map((categoria, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {categoria}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Nenhuma categoria encontrada</p>
                )}
              </ul>

              <h3 className="font-bold text-gray-700 mb-2">Top Brands</h3>
              <ul className="space-y-1">
                {getTopBrands().length > 0 ? (
                  getTopBrands().map((brand, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {brand}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">Nenhuma marca disponível</p>
                )}
              </ul>
              </div>
  
              {/* Coluna 2 - Produto em Destaque */}
              <div className="p-4 border-l">
                {results.resultados && results.resultados.length > 0 ? (
                    <div className="text-center flex flex-col items-center justify-center">
                      <h3 className="font-bold text-gray-700 mb-2">Top Product</h3>
                      <img
                        src={results.resultados[0].imagem}
                        alt={results.resultados[0].nome}
                        className="w-32 h-32 mx-auto rounded-lg object-cover"
                      />
                      <h4 className="font-semibold text-lg mt-2 text-gray-900">
                        {results.resultados[0].nome}
                      </h4>
                      <p className="text-green-500 font-bold text-lg">
                        R$ {results.resultados[0].preco.toFixed(2)}
                      </p>
                    </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-bold text-gray-700 mb-2">Top Product</h3>
                    <p className="text-sm text-gray-400">Nenhum produto em destaque</p>
                  </div>
                )}
              </div>
  
              {/* Coluna 3 - Lista de Produtos */}
              <div className="p-4 border-l w-full">
                  <h3 className="font-bold text-gray-700 mb-2">Top Products</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {results.resultados?.slice(0, 6).map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100"
                      >
                        <img
                          src={product.imagem}
                          alt={product.nome}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) =>
                            (e.currentTarget.src = "https://via.placeholder.com/150")
                          }
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">
                            {product.nome}
                          </p>
                          <p className="text-xs text-gray-500">{product.categoria}</p>
                          <p className="text-green-500 font-bold text-sm">
                            R$ {product.preco.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!results.resultados || results.resultados.length === 0) && (
                      <p className="text-sm text-gray-400">
                        Nenhum produto encontrado
                      </p>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );  
};

export default BuscaFlexWidget;
