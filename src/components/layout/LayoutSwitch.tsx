import React from "react";
import MobileLayout from "../columnLayout/MobileLayout";
import LineLayout from "./LineLayout";
import ColumnLayout from "../columnLayout/ColumnLayout";
import type { LayoutProps, BlockConfig } from "../../types";

const LayoutSwitch: React.FC<LayoutProps & { blockConfigs: BlockConfig[] }> = ({
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
  structure,
  blockConfigs,
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
        blockConfigs={blockConfigs}
        isSuggestion={!query || query.length === 0}
      />
    );
  }  

  return (
    <MobileLayout
      layout={layout || "destaqueMobile"}
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
      placeholder={placeholder}
      structure={structure}
      blockConfigs={blockConfigs}
    />
  );
};

export default LayoutSwitch;
