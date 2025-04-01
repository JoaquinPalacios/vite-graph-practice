import { lazy } from "react";
import "./App.css";

const SwellChartContainerLayout = lazy(
  () => import("./components/SwellChartContainerLayout")
);

function App() {
  return (
    <main className="flex flex-col items-center justify-center bg-slate-50 p-4 md:px-8 md:py-10">
      <h1 className="text-3xl mb-8">Swellnet</h1>
      <SwellChartContainerLayout />
    </main>
  );
}

export default App;
