import "./App.css";
import SwellChartContainerClient from "./components/SwellChartContainerClient";
function App() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-slate-100 px-4">
      <h1 className="text-3xl mb-10">Swellnet</h1>
      <SwellChartContainerClient />
    </main>
  );
}

export default App;
