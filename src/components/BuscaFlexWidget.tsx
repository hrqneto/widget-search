import { useState } from 'react';

const BuscaFlexWidget = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    window.open(`https://buscaflex.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="relative w-full">
      <input
        className="w-full rounded-lg border px-4 py-2 shadow-sm"
        placeholder="O que você procura?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
    </div>
  );
};

export default BuscaFlexWidget;
