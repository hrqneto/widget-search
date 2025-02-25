import { createRoot } from 'react-dom/client';
import BuscaFlexWidget from './components/BuscaFlexWidget';
import './index.css';

function renderBuscaFlexWidget() {
  const container = document.querySelector('#buscaflex-widget');

  if (container) {
    const root = createRoot(container);
    root.render(<BuscaFlexWidget />);
  }
}

document.addEventListener('DOMContentLoaded', renderBuscaFlexWidget);
