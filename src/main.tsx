import { createRoot } from 'react-dom/client';
import BuscaFlexWidget from './components/BuscaFlexWidget';
import './index.css';

// Função que substitui o campo de busca original pelo da BuscaFlex
function replaceSearchField() {
  const originalSearch = document.querySelector('input[type="search"], input[type="text"][name="q"]');

  if (originalSearch && originalSearch.parentNode) {
    const wrapper = document.createElement('div');
    originalSearch.parentNode.replaceChild(wrapper, originalSearch);
    const root = createRoot(wrapper);
    root.render(<BuscaFlexWidget />);
  }
}

// Inicializa quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', replaceSearchField);
