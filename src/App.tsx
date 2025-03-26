import "./App.css";
import SwellChartContainerClient from "./components/SwellChartContainerClient";
function App() {
  return (
    <main className="flex flex-col items-center justify-center bg-slate-100 p-4 md:px-8 md:py-10">
      <h1 className="text-3xl mb-8">Swellnet</h1>
      <SwellChartContainerClient />
    </main>
  );
}

export default App;
