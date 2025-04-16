// src/App.tsx
import BuscaFlexWidget from './components/BuscaFlexWidget';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BuscaFlex</h1>
      <BuscaFlexWidget
        config={{
          clientId: "products",
          placeholder: "Buscar...",
          layout: "grid",
          alignment: "left",
          blockPosition: "right",
          showHeroProduct: true,
          showSuggestions: true,
          showBorders: true,
          colors: {
            main: "#770195",
            background: "#f9f9f9",
            highlight: "#EC46D8",
            text: "#000000",
            border: "#dddddd",
            headerText: "#333",
            mutedText: "#999999",
            noResultsText: "#222222",
            hoverItem: "#eeeeee"
          }
        }}
      />
    </div>
  );
}

export default App;
