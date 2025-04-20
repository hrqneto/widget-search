import { useEffect } from "react";
import debounce from "lodash.debounce";
import type { SearchInputProps } from "../../types";

const SearchInput = ({
  query,
  setQuery,
  setIsOpen,
  fetchAutocompleteResults,
  fetchSuggestions,
  placeholder = "O que você procura?",
}: SearchInputProps) => {
  useEffect(() => {
    if (query.length >= 1) {
      const debounced = debounce(() => {
        fetchAutocompleteResults(query);
      }, 300);

      debounced();

      return () => debounced.cancel();
    }
  }, [query, fetchAutocompleteResults]);

  return (
    <input
      type="text"
      autoComplete="off"
      name="q"
      className="w-full border rounded-lg p-2.5 mb-2.5 shadow-sm focus:ring-2 focus:ring-blue-400"
      placeholder={placeholder}
      value={query}
      onChange={(e) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(true);
        if (value.length < 1) {
          fetchSuggestions();
        }
      }}
      onFocus={() => {
        setIsOpen(true);
        if (query.length < 1) {
          fetchSuggestions();
        }
      }}
    />
  );
};

export default SearchInput;
