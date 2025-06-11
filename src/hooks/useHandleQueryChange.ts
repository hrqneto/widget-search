// ✅ useHandleQueryChange.ts
import { useEffect, useRef } from "react";

export const useHandleQueryChange = (
  query: string,
  fetchInitialSuggestions: () => void,
  debouncedFetchAutocomplete: (q: string) => void,
  setIsOpen: (open: boolean) => void
) => {
  const previousQueryRef = useRef("");

  useEffect(() => {
    if (previousQueryRef.current === query) return;
    previousQueryRef.current = query;

    if (query.trim().length === 0) {
      fetchInitialSuggestions();
      setIsOpen(true);
    } else {
      debouncedFetchAutocomplete(query);
    }
  }, [query, fetchInitialSuggestions, debouncedFetchAutocomplete, setIsOpen]);
};
