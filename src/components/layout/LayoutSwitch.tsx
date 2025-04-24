import React from "react";
import MobileLayout from "../columnLayout/MobileLayout";
import LineLayout from "./LineLayout";
import ColumnLayout from "../columnLayout/ColumnLayout";
import type { LayoutProps } from "../../types";

const LayoutSwitch: React.FC<LayoutProps> = ({
  layout,
  isMobile,
  results,
  topQueries,
  topCategories,
  topBrands,
  highlightQuery,
  colors,
  showBorders,
  query,
  setQuery,
  setIsOpen,
  placeholder,
  structure
}) => {
  if (layout === "linha") {
    return (
      <LineLayout
        results={results}
        highlightQuery={highlightQuery}
        colors={colors}
      />
    );
  }

  if (layout === "grid") {
    return (
      <ColumnLayout
        layout={layout}
        isMobile={isMobile}
        results={results}
        topQueries={topQueries}
        topCategories={topCategories}
        topBrands={topBrands}
        highlightQuery={highlightQuery}
        colors={colors}
        showBorders={showBorders}
        structure={structure}
      />

    );
  }

  return (
  <MobileLayout
    layout={layout}
    isMobile={isMobile}
    results={results}
    topQueries={topQueries}
    topCategories={topCategories}
    topBrands={topBrands}
    highlightQuery={highlightQuery}
    colors={colors}
    showBorders={showBorders}
    query={query}
    setQuery={setQuery}
    setIsOpen={setIsOpen}
    placeholder={placeholder} // ✅ Adicionado aqui
    structure={structure}
  />

  );
};

export default LayoutSwitch;