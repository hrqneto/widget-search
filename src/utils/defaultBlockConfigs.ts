import type { BlockConfig } from "../types";

export const getDefaultBlockConfigs = (): BlockConfig[] => [
  { id: "hero", enabled: true, position: 0, name: "Top product", size: 1, heroName: "Top product" },
  { id: "products", enabled: true, position: 1, name: "Products", size: 7 },
  { id: "queries", enabled: true, position: 2, name: "Queries", size: 4, recommendedName: "Top queries", recommendedSize: 4 },
  { id: "categories", enabled: true, position: 3, name: "Categories", size: 5, recommendedName: "Top categories", recommendedSize: 5 },
  { id: "brands", enabled: true, position: 4, name: "Brands", size: 5, recommendedName: "Top brands", recommendedSize: 5 },
];
