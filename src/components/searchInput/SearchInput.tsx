// 📁 src/components/searchInput/SearchInput.tsx
import { useEffect } from "react";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";
import type { SearchInputProps } from "../../types";

const SearchInput = ({
  inputRef,
  query,
  setQuery,
  setIsOpen,
  fetchAutocompleteResults,
  fetchSuggestions,
  placeholder = "O que você procura?",
}: SearchInputProps & { inputRef?: React.RefObject<HTMLInputElement | null> }) => {
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
    <div className="relative " style={{ width: "200px" }}>
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        name="q"
        className="w-full border rounded-lg p-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-400"
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
      <FaSearch
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={16}
      />
    </div>
  );
};

export default SearchInput;
