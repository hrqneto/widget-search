// src/utils/normalizeAutocomplete.ts
import type { SuggestionResponse } from "../types";

export function normalizeAutocomplete(data: SuggestionResponse) {
  return {
    queries: data.queries?.map(q => q.query) || [],
    categories: data.catalogues?.map(c => c.name) || [],
    brands: data.brands?.map(b => b.name) || [],
    products: data.products || [],
  };
}
