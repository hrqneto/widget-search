import React from "react";
import { createRoot } from "react-dom/client";
import WidgetAutocomplete from "./components/BuscaFlexWidget";
import "./output.css";

// Pega o clientId da URL para simular o preview da loja ex: ?clientId=loja123
const params = new URLSearchParams(window.location.search);
const clientId = params.get("clientId") || "loja123";

// Deixa disponível globalmente se quiser acessar via localStorage, window, etc.
localStorage.setItem("clientId", clientId);

// Renderiza o widget
const root = createRoot(document.getElementById("root")!);
root.render(<WidgetAutocomplete />);
