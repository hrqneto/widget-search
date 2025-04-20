// 📁 src/components/columnLayout/ColumnLayout.tsx
import React from "react";
import ColumnTopItems from "../dropDownContainer/ColumnTopItems";
import ColumnHeroProduct from "../dropDownContainer/ColumnHeroProduct";
import ColumnProductList from "../dropDownContainer/ColumnProductList";

import type { Produto, Colors } from "../../types";

type Props = {
  results: Produto[];
  topQueries: string[];
  topCategories: string[];
  topBrands: string[];
  highlightQuery: (text: string) => React.ReactNode;
  colors: Colors;
  showBorders?: boolean;
};

const ColumnLayout: React.FC<Props> = ({
  results,
  topQueries,
  topCategories,
  topBrands,
  highlightQuery,
  colors,
  showBorders,
}) => {
  return (
    <div className="grid grid-cols-[210px_210px_1fr] min-h-[540px] gap-4">
      <ColumnTopItems
        topQueries={topQueries}
        topCategories={topCategories}
        topBrands={topBrands}
        highlightQuery={highlightQuery}
        colors={colors}
        showBorders={showBorders}
      />
      <ColumnHeroProduct
        product={results[0]}
        highlightQuery={highlightQuery}
        colors={colors}
      />
      <ColumnProductList
        products={results}
        highlightQuery={highlightQuery}
        colors={colors}
        showBorders={showBorders}
      />
    </div>
  );
};

export default ColumnLayout;
