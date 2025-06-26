// 📁 src/components/columnLayout/MobileLayout.tsx
import React, { useEffect, useState } from "react";
import ColumnTopItems from "../dropDownContainer/ColumnTopItems";
import type { MobileLayoutProps } from "../../types";
import type { Produto } from "../../types";

const MobileLayout: React.FC<MobileLayoutProps> = ({
  results,
  topCategories,
  topBrands,
  highlightQuery,
  colors,
  showBorders = false,
  query,
  setQuery,
  setIsOpen,
  placeholder,
  blockConfigs
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'brands'>('products');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen]);

  const renderProduct = (product: Produto, index: number) => {
    return (
      <div
        key={product.id || `p-${index}`}
        className={`flex items-center gap-4 p-4 ${showBorders ? "border-b border-gray-200" : ""}`}
      >
        <div className="min-w-[80px] max-w-[80px] h-[80px] flex-shrink-0">
          <img
            src={product.image || "https://cdn.buscaflex.com/fallback.jpg"}
            alt={product.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold line-clamp-2 mb-1">
            {highlightQuery(product.title)}
          </p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {highlightQuery(product.category)}
          </p>
          <p className="text-pink-500 font-semibold mt-1">
            {typeof product.price === "number"
              ? `R$ ${product.price.toFixed(2)}`
              : "Preço indisponível"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pt-8 bg-white sticky top-0 z-10">
        <button
          onClick={() => setIsOpen(false)}
          className="text-lg font-bold text-gray-700"
        >
          ←
        </button>
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-b pb-2 px-4 py-2.5 bg-neutral-50 sticky top-[72px] z-10">
        {(['products', 'categories', 'brands'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-1 border-b-2 transition-all duration-150 ${
              activeTab === tab
                ? 'border-black border-b-2 text-black'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'products' && (
        <>
          <div className="divide-y">
            {results.map(renderProduct)}
          </div>
          <div className="mt-6 text-center p-4">
            <button className="bg-blue-600 text-white w-full py-3 rounded text-sm font-medium">
              Ver todos os produtos
            </button>
          </div>
        </>
      )}

      {activeTab === 'categories' && (
        <div className="p-4">
          <ColumnTopItems
            topQueries={[]}
            topCategories={topCategories}
            topBrands={[]}
            highlightQuery={highlightQuery}
            colors={{
              text: colors.text ?? "#000000",
              mutedText: colors.mutedText ?? "#999999",
              headerText: colors.headerText ?? "#333333",
              highlight: colors.highlight ?? "#EC46D8",
              border: colors.border ?? "#dddddd"
            }}
            showBorders={showBorders}
            blockConfigs={blockConfigs}
          />
        </div>
      )}

      {activeTab === 'brands' && (
        <div className="p-4">
          <ColumnTopItems
            topQueries={[]}
            topCategories={[]}
            topBrands={topBrands}
            highlightQuery={highlightQuery}
            colors={{
              text: colors.text ?? "#000000",
              mutedText: colors.mutedText ?? "#999999",
              headerText: colors.headerText ?? "#333333",
              highlight: colors.highlight ?? "#EC46D8",
              border: colors.border ?? "#dddddd"
            }}
            showBorders={showBorders}
            blockConfigs={blockConfigs}
          />
        </div>
      )}
    </div>
  );
};

export default MobileLayout;