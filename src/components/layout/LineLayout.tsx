
// 📁 src/components/layout/LineLayout.tsx
import React from "react";
import type { Produto, Colors } from "../../types";
import { ReactNode } from "react";

interface LineLayoutProps {
  results: Produto[];
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
}

const LineLayout: React.FC<LineLayoutProps> = ({ results, highlightQuery, colors }) => {
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-bold mb-4 text-lg" style={{ color: colors.headerText }}>
        Resultados
      </h3>
      {results.map((product, index) => (
        <div
          key={product.id || index}
          className="flex items-center gap-4 p-3 border-b border-gray-200 last:border-b-0"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-16 h-16 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "https://cdn.buscaflex.com/fallback.jpg";
            }}
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-base font-medium line-clamp-2 break-words" style={{ color: colors.text }}>
              {highlightQuery(product.title)}
            </span>
            <span className="text-sm mt-1" style={{ color: colors.highlight }}>
              R$ {product.price.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LineLayout;
