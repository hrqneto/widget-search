import React from "react";
import type { Produto, Colors } from "../../types";

export type ColumnProductListProps = {
  products: Produto[];
  highlightQuery: (text: string) => React.ReactNode;
  colors: Colors;
  showBorders?: boolean;
};

const ColumnProductList: React.FC<ColumnProductListProps> = ({
  products,
  highlightQuery,
  colors,
  showBorders,
}) => {
  const productList = products.slice(1, 7); // ignora o primeiro (herói)

  if (productList.length === 0) {
    return (
      <p className="text-sm" style={{ color: colors.noResultsText }}>
        Nenhum produto encontrado
      </p>
    );
  }

  return (
    <div
      className="p-4 col-span-1 flex-1"
      style={{
        borderLeft: showBorders ? `1px solid ${colors.border}` : undefined,
      }}
    >
      <div>
        <h3 className="font-bold mb-4" style={{ color: colors.headerText }}>
          Top Products
        </h3>

        <div className="grid grid-cols-2 transition-opacity duration-300 ease-in-out">
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
                    <p className="font-bold text-sm mt-1" style={{ color: colors.highlight }}>
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColumnProductList;
