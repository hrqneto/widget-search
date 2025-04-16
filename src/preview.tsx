import { createRoot } from "react-dom/client";
import BuscaFlexWidget from "./components/BuscaFlexWidget";
import "./output.css";

// 📌 Captura o clientId via query string (?clientId=loja123)
const params = new URLSearchParams(window.location.search);
const clientId = params.get("clientId") || "loja123";

// 🔒 Armazena no localStorage (caso o widget use isso internamente)
localStorage.setItem("clientId", clientId);

// 🚀 Renderiza o widget normalmente no #root
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<BuscaFlexWidget />);
} else {
  console.error("❌ Elemento #root não encontrado para renderização do widget");
}
