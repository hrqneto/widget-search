import React from "react";
import type { ColumnTopItemsProps } from "../../types";

const ColumnTopItems: React.FC<ColumnTopItemsProps> = ({
  topQueries,
  topCategories,
  topBrands,
  highlightQuery,
  colors,
  showBorders
}) => {
  return (
    <div
      className="relative w-full min-w-[200px] max-w-[300px]"
      style={{
        borderLeft: showBorders ? `1px solid ${colors.border}` : undefined,
      }}
    >
      {/* Fundo colorido com opacidade */}
      <div
        className="absolute inset-0 z-0 h-full w-full rounded-l-lg"
        style={{
          backgroundColor: colors.highlight ? `${colors.highlight}12` : "rgba(0,0,0,0.1)",
        }}
      />

      {/* Conteúdo visível acima do fundo */}
      <div className="relative z-10 px-4 py-4 w-full">
        {/* Top Queries */}
        <h3 className="font-bold mb-2" style={{ color: colors.headerText }}>
          Top Queries
        </h3>
        <div className="flex gap-2 flex-wrap mb-4">
          {topQueries.length > 0 ? (
            topQueries.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="px-3 py-1 rounded-md text-sm font-medium cursor-pointer transition"
                style={{ backgroundColor: colors.highlight, color: colors.text }}
              >
                {highlightQuery(item)}
              </span>
            ))
          ) : (
            <p className="text-sm" style={{ color: colors.mutedText }}>
              Nenhuma pesquisa encontrada
            </p>
          )}
        </div>

        {/* Top Categories */}
        <h3 className="font-bold mb-2" style={{ color: colors.headerText }}>
          Top Categories
        </h3>
        <ul className="space-y-1 mb-4">
          {topCategories.length > 0 ? (
            topCategories.map((category, index) => (
              <li
                key={index}
                className="text-sm truncate cursor-pointer hover:underline transition"
                style={{ color: colors.text }}
              >
                {highlightQuery(category)}
              </li>
            ))
          ) : (
            <p className="text-sm" style={{ color: colors.mutedText }}>
              Nenhuma categoria encontrada
            </p>
          )}
        </ul>

        {/* Top Brands */}
        <h3 className="font-bold mb-2" style={{ color: colors.headerText }}>
          Top Brands
        </h3>
        <ul className="space-y-1">
          {topBrands.length > 0 ? (
            topBrands.map((brand, index) => (
              <li
                key={index}
                className="text-sm truncate cursor-pointer hover:underline transition"
                style={{ color: colors.text }}
              >
                {highlightQuery(brand)}
              </li>
            ))
          ) : (
            <p className="text-sm" style={{ color: colors.mutedText }}>
              Nenhuma marca disponível
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ColumnTopItems;