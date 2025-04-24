// 📁 src/components/columnLayout/ColumnLayout.tsx
import React from "react";
import ColumnTopItems from "../dropDownContainer/ColumnTopItems";
import ColumnHeroProduct from "../dropDownContainer/ColumnHeroProduct";
import ColumnProductList from "../dropDownContainer/ColumnProductList";
import type { LayoutOption, Produto, Colors } from "../../types";
import type { ReactNode } from "react";

interface ColumnLayoutProps {
  layout: LayoutOption;
  isMobile: boolean;
  results: Produto[];
  topQueries: string[];
  topCategories: string[];
  topBrands: string[];
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  showBorders?: boolean;
  structure?: ("hero" | "brands" | "categories" | "products" | "queries")[];
}

const shouldRenderBlock = (
  structure: ColumnLayoutProps["structure"],
  block: "hero" | "brands" | "categories" | "products" | "queries"
): boolean => {
  return structure?.includes(block) ?? false;
};

const ColumnLayout: React.FC<ColumnLayoutProps> = ({
  results,
  topQueries,
  topCategories,
  topBrands,
  highlightQuery,
  colors,
  showBorders,
  structure,
}) => {
  return (
    <div className="grid grid-cols-[210px_210px_1fr] min-h-[540px] gap-4">
      {shouldRenderBlock(structure, "categories") && (
        <ColumnTopItems
          topCategories={topCategories}
          topBrands={topBrands}
          topQueries={topQueries}
          highlightQuery={highlightQuery}
          colors={colors}
          showBorders={showBorders}
        />
      )}

      {shouldRenderBlock(structure, "hero") && (
        <ColumnHeroProduct
          product={results[0]}
          highlightQuery={highlightQuery}
          colors={colors}
          showBorders={showBorders}
        />
      )}

      {shouldRenderBlock(structure, "products") && (
        <ColumnProductList
          products={results}
          highlightQuery={highlightQuery}
          colors={colors}
          showBorders={showBorders}
        />
      )}
    </div>
  );
};

export default ColumnLayout;
