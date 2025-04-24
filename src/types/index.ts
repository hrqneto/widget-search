import { ReactNode } from "react";

export interface Produto {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  image?: string;
  url?: string;
}

export interface Colors {
  main?: string;
  highlight?: string;
  background?: string;
  text?: string;
  mutedText?: string;
  headerText?: string;
  border?: string;
  noResultsText?: string;
  hoverItem?: string;
}

export type LayoutOption = "destaqueMobile" | "linha" | "grid";

export interface WidgetConfig {
  clientId?: string;
  placeholder?: string;
  structure?: ("hero" | "brands" | "categories" | "products" | "queries")[];
  layout?: LayoutOption;
  alignment?: "left" | "center" | "right";
  blockPosition?: "left" | "right";
  showHeroProduct?: boolean;
  showSuggestions?: boolean;
  showBorders?: boolean;
  apiBaseUrl?: string;
  selector?: string;
  colors?: Colors;
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
}

export interface ColumnTopItemsProps {
  topQueries: string[];
  topCategories: string[];
  topBrands: string[];
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  showBorders?: boolean;
}

export interface ColumnHeroProductProps {
  product?: Produto;
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  showBorders?: boolean;
}

export interface MobileLayoutProps {
  layout: LayoutOption;
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
  structure?: ("hero" | "brands" | "categories" | "products" | "queries")[];
}

export interface LayoutProps {
  layout: LayoutOption;
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
  structure?: ("hero" | "brands" | "categories" | "products" | "queries")[];
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