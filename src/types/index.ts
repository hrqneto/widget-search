import { ReactNode } from "react";

/**
 * Representa um produto retornado na busca
 */
export interface Produto {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  image?: string;
  url?: string;
}

/**
 * Cores customizáveis no widget
 */
export interface Colors {
  highlight?: string;
  background?: string;
  text?: string;
  mutedText?: string;
  headerText?: string;
  border?: string;
  noResultsText?: string;
  hoverItem?: string;
}

/**
 * Props comuns para o layout mobile do widget
 */
export interface MobileLayoutProps {
  results: Produto[];
  topCategories: string[];
  topBrands: string[];
  highlightQuery: (text: string) => ReactNode[];
  colors: {
    main?: string;
    background?: string;
    text?: string;
    highlightText?: string;
    noResultsText?: string;
    border?: string;
    hoverItem?: string;
    activeTab?: string;
    inactiveTab?: string;
  };
  showBorders?: boolean;
  query: string;
  setQuery: (value: string) => void;
  setIsOpen: (value: boolean) => void;
  placeholder?: string;
}

/**
 * Props para o componente do produto em destaque (hero)
 */
export interface ColumnHeroProductProps {
  product?: Produto;
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  /**
   * Mostra ou não a borda lateral direita (se for usado ao lado de outro bloco)
   */
  showBorders?: boolean;
}

/**
 * Props para o componente da lista de produtos (abaixo do hero)
 */
export interface ColumnProductListProps {
  products: Produto[];
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  showBorders?: boolean;
}

/**
 * Props para os blocos de sugestões superiores
 */
export interface ColumnTopItemsProps {
  topQueries: string[];
  topCategories: string[];
  topBrands: string[];
  highlightQuery: (text: string) => ReactNode;
  colors: Colors;
  showBorders?: boolean;
}

/**
 * Resposta esperada do backend (API de sugestões)
 */
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

/**
 * Configuração geral do widget vinda da janela global ou CMS
 */
export interface WidgetConfig {
  clientId?: string;
  placeholder?: string;
  layout?: "heromobile" | "line" | "grid";
  alignment?: "left" | "center" | "right";
  blockPosition?: "left" | "right";
  showHeroProduct?: boolean;
  showSuggestions?: boolean;
  showBorders?: boolean;
  apiBaseUrl?: string;
  selector?: string;
  colors?: Colors;
}

/**
 * Props do componente de input de busca
 */
export interface SearchInputProps {
  query: string;
  setQuery: (q: string) => void;
  setIsOpen: (open: boolean) => void;
  placeholder?: string;
  fetchAutocompleteResults: (value: string) => void;
  fetchSuggestions: () => void;
}
