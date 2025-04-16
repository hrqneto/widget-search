// src/App.tsx
import BuscaFlexWidget from './components/BuscaFlexWidget';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BuscaFlex</h1>
      <BuscaFlexWidget config={{ clientId: "products", placeholder: "Buscar...", colors: { background: "#fff", text: "#000", main: "#770195", highlight: "#EC46D8" } }} />      
    </div>
  );
}

export default App;
