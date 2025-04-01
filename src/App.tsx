import { lazy } from "react";
import "./App.css";

const ChartsContainerClient = lazy(
  () => import("./components/ChartsContainerClient")
);

function App() {
  return (
    <main className="flex flex-col items-center justify-center bg-slate-50 p-4 md:px-8 md:py-10">
      <h1 className="text-3xl mb-8">Swellnet</h1>
      <ChartsContainerClient />
    </main>
  );
}

export default App;
