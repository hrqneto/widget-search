import type { SuggestionResponse } from "../types";

export function normalizeAutocomplete(data: SuggestionResponse) {
  return {
    queries: Array.isArray(data?.queries)
      ? data.queries.map(q => q?.query || "").filter(Boolean)
      : [],
    categories: Array.isArray(data?.catalogues)
      ? data.catalogues.map(c => c?.name || "").filter(Boolean)
      : [],
    brands: Array.isArray(data?.brands)
      ? data.brands.map(b => b?.name || "").filter(Boolean)
      : [],
    products: Array.isArray(data?.products) ? data.products : [],
  };
}
