import React from "react";
import type { Produto, Colors, BlockConfig } from "../../types";

export type ColumnProductListProps = {
  products: Produto[];
  highlightQuery: (text: string) => React.ReactNode;
  colors: Colors;
  showBorders?: boolean;
  blockConfigs: BlockConfig[];
  isSuggestion?: boolean;
};

const ColumnProductList: React.FC<ColumnProductListProps> = ({
  products,
  highlightQuery,
  colors,
  showBorders,
  blockConfigs,
  isSuggestion,
}) => {
  const productList = products.slice(1, 7);
  const title = blockConfigs.find(b => b.id === "products")?.name || "Top Products";

  if (productList.length === 0) {
    return (
      <p className="text-sm" style={{ color: colors.noResultsText }}>
        Nenhum produto encontrado
      </p>
    );
  }

  return (
    <div
      className="p-4 col-span-1 flex-1 flex flex-col justify-between"
      style={{
        borderLeft: showBorders ? `1px solid ${colors.border}` : undefined,
      }}
    >
      <div>
        <h3 className="font-bold mb-4" style={{ color: colors.headerText }}>
          {title}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {productList.map((product, index) => {
            const safeKey = product.id || `fallback-${index}`;
            return (
              <div
                key={safeKey}
                className="flex gap-3 p-3 rounded-lg transition-transform transform hover:scale-105"
                style={{ cursor: "pointer" }}
              >
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[80px] max-w-[80px] min-h-[80px] max-h-[80px] flex-shrink-0"
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

                <div className="max-w-full flex-1">
                  <p className="text-base font-semibold leading-tight line-clamp-2 overflow-hidden break-words" style={{ color: colors.text }}>
                    {highlightQuery(product.title)}
                  </p>
                  <p className="text-sm line-clamp-2 overflow-hidden break-words mt-1" style={{ color: colors.mutedText }}>
                    {highlightQuery(product.category)}
                  </p>
                  {typeof product.price === "number" ? (
                    <p className="font-bold text-sm mt-1" style={{ color: colors.highlight }}>
                      R$ {product.price.toFixed(1)}
                    </p>
                  ) : (
                    <p className="text-sm mt-1" style={{ color: colors.mutedText }}>
                      Preço indisponível
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {productList.length > 0 && !isSuggestion && (
        <div className="mt-6 flex justify-center">
          <button
            className="bg-transparent border border-black text-black py-3 px-6 text-sm w-full font-semibold rounded-md hover:bg-black hover:text-white transition"
          >
            VER TODOS OS PRODUTOS
          </button>
        </div>
      )}
    </div>
  );
};

export default ColumnProductList;
