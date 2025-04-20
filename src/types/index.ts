export interface Produto {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  image?: string;
  url?: string;
}

export interface SearchResults {
  resultados: Produto[];
}

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
  colors?: {
    main?: string;
    background?: string;
    highlight?: string;
    text?: string;
    border?: string;
    headerText?: string;
    mutedText?: string;
    noResultsText?: string;
    hoverItem?: string;
  };
}


export interface SearchInputProps {
  query: string;
  setQuery: (q: string) => void;
  setIsOpen: (open: boolean) => void;
  placeholder?: string;
  fetchAutocompleteResults: (value: string) => void;
  fetchSuggestions: () => void;
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

export interface Colors {
  highlight?: string;
  text?: string;
  mutedText?: string;
  headerText?: string;
  border?: string;
  noResultsText?: string;
};

export interface ColumnTopItemsProps {
  topQueries: string[];
  topCategories: string[];
  topBrands: string[];
  highlightQuery: (text: string) => React.ReactNode;
  colors: Colors;
  showBorders?: boolean;
};

export interface ColumnHeroProductProps {
  product?: Produto;
  highlightQuery: (text: string) => React.ReactNode;
  colors: Colors;
};
