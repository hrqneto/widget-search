import { ReactNode } from "react";

export interface Produto {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  image?: string;
  url?: string;
  priceText?: string;
}

export interface Colors {
  main: string;
  highlight: string;
  background: string;
  text: string;
  mutedText: string;
  headerText: string;
  border: string;
  noResultsText: string;
  hoverItem: string;
}

export type LayoutOption = "destaqueMobile" | "linha" | "grid";

export type BlockId = "hero" | "products" | "categories" | "brands" | "queries";

export interface BlockConfig {
  id: "products" | "queries" | "categories" | "brands" | "hero";
  enabled: boolean;
  position: number;

  // usados no widget para exibir os títulos
  title?: string;
  recommendedName?: string;
  heroName?: string;

  // usados para tamanho das listas
  size?: number;
  recommendedSize?: number;
  limit?: number;
  limitRecommend?: number;

  // (antigo, mas ainda pode estar em uso em algum lugar)
  name?: string;
}


export interface WidgetConfig {
  clientId: string;
  placeholder: string;
  layout: LayoutOption;
  alignment: "left" | "center" | "right";
  blockPosition: "left" | "right";
  showHeroProduct: boolean;
  showSuggestions: boolean;
  showBorders: boolean;
  apiBaseUrl?: string;
  selector?: string;
  colors: Colors;
  blockConfigs: BlockConfig[];
}

export interface BuscaflexPreviewConfig extends Partial<WidgetConfig> {
  fixarAberto?: boolean;
}

export interface AutocompleteWidgetProps {
  config: WidgetConfig;
  showConfigUI?: boolean;
}

export interface SearchInputProps {
  query: string;
  setQuery: (q: string) => void;
  setIsOpen: (open: boolean) => void;
  placeholder?: string;
  fetchAutocompleteResults: (value: string) => void;
  fetchSuggestions: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export interface ColumnProductListProps {
  products: Produto[];
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  showBorders?: boolean;
  blockConfigs: BlockConfig[];
  isSuggestion?: boolean;
}

export interface ColumnTopItemsProps {
  topQueries: string[] | { query: string }[];
  topCategories: string[];
  topBrands: string[];
  highlightQuery: (text: string) => React.ReactNode;
  colors: Pick<Colors, "text" | "mutedText" | "headerText" | "highlight" | "border">;
  showBorders: boolean;
  isSuggestion?: boolean;
}

export interface ColumnHeroProductProps {
  product?: Produto;
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  showBorders?: boolean;
}

export interface LayoutProps {
  layout?: LayoutOption;
  isMobile: boolean;
  results: Produto[];
  topQueries: string[];
  topCategories: string[];
  topBrands: string[];
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  showBorders?: boolean;
  query: string;
  setQuery: (value: string) => void;
  setIsOpen: (value: boolean) => void;
  placeholder: string;
  structure?: BlockId[];
}

export interface MobileLayoutProps extends LayoutProps {
  blockConfigs: BlockConfig[];
}

export interface SuggestionResponse {
  topQueries: { query: string }[];
  topCategories: { name: string }[];
  topBrands: { name: string }[];
  topProducts: Produto[];
  queries?: { query: string }[];
  catalogues?: { name: string }[];
  brands?: { name: string }[];
  products?: Produto[];
}

export interface SearchResults {
  resultados: Produto[];
}
