// 📁 src/components/searchInput/SearchInput.tsx
import { FaSearch } from "react-icons/fa";
import type { SearchInputProps } from "../../types";

const SearchInput = ({
  inputRef,
  query,
  setQuery,
  setIsOpen,
  fetchSuggestions,
  placeholder = "O que você procura?",
}: SearchInputProps & { inputRef?: React.RefObject<HTMLInputElement | null> }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    if (value.trim().length === 0) {
      fetchSuggestions();
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (query.trim().length === 0) {
      fetchSuggestions();
    }
  };

  return (
    <div className="relative " style={{ width: "200px" }}>      
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        name="q"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        className="w-full border rounded-lg p-2 pr-10 shadow-sm focus:ring-2 focus:ring-blue-400"
      />
      <FaSearch
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={16}
      />
    </div>
  );
};

export default SearchInput;
