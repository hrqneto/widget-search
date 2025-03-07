import { createRoot } from 'react-dom/client';
import BuscaFlexWidget from './components/BuscaFlexWidget';
// widget.tsx
import './output.css';

// Função mais robusta para substituir o campo de busca original
function replaceSearchField() {
  const interval = setInterval(() => {
    const originalSearch = document.querySelector('input[type="search"], input[type="text"][name="q"]');

    if (originalSearch && originalSearch.parentNode) {
      clearInterval(interval); // Para o intervalo quando encontrar o elemento
      const wrapper = document.createElement('div');
      originalSearch.parentNode.replaceChild(wrapper, originalSearch);
      const root = createRoot(wrapper);
      root.render(<BuscaFlexWidget />);
    }
  }, 100); // Tenta a cada 100ms até encontrar o campo
}

// Inicializa quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', replaceSearchField);
