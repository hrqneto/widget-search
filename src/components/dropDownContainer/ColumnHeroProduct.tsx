import React from "react";
import type { ColumnHeroProductProps, BlockConfig } from "../../types";

const ColumnHeroProduct: React.FC<ColumnHeroProductProps & { blockConfigs: BlockConfig[] }> = ({
  product,
  highlightQuery,
  colors,
  blockConfigs,
}) => {
  if (!product) {
    return (
      <p className="text-sm" style={{ color: colors.noResultsText }}>
        Nenhum produto em destaque
      </p>
    );
  }

  const heroTitle = blockConfigs.find(b => b.id === "hero")?.heroName || "Produto em destaque";

  return (
    <div className="p-4 pr-11 w-[240px] flex flex-col items-center justify-start text-center">
      <h3 className="font-bold mb-4" style={{ color: colors.headerText }}>
        {heroTitle}
      </h3>

      <div className="flex flex-col items-center justify-start w-full">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto"
        >
          <img
            src={
              product.image?.startsWith("http")
                ? product.image
                : "https://via.placeholder.com/150?text=Ver"
            }
            alt={product.title}
            className="w-[260px] h-[260px] object-cover rounded-md mx-auto"
          />
        </a>

        <div className="w-full mt-4 px-2 overflow-hidden">
          <p
            className="text-base font-semibold leading-snug line-clamp-3 break-words"
            style={{ color: colors.text }}
          >
            {highlightQuery(product.title)}
          </p>
        </div>

        <p className="text-2xl font-bold mt-2" style={{ color: colors.highlight }}>
          {product.priceText
            ? `R$ ${product.priceText.replace(/[^\d.,]/g, "")}`
            : "Preço indisponível"}
        </p>
      </div>
    </div>
  );
};

export default ColumnHeroProduct;
