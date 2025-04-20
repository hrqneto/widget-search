// 📁 src/hooks/useWidgetState.ts
import { useState } from "react";
import type { Produto } from "../types";

export const useWidgetState = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [topQueries, setTopQueries] = useState<string[]>([]);
  const [topCategories, setTopCategories] = useState<string[]>([]);
  const [topBrands, setTopBrands] = useState<string[]>([]);

  return {
    query, setQuery,
    results, setResults,
    isLoading, setIsLoading,
    isOpen, setIsOpen,
    topQueries, setTopQueries,
    topCategories, setTopCategories,
    topBrands, setTopBrands
  };
}