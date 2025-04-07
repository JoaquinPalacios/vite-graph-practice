import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const GraphButtons = ({
  isAtStart,
  isAtEnd,
}: {
  isAtStart: boolean;
  isAtEnd: boolean;
}) => {
  const scrollByDay = (direction: "left" | "right") => {
    const container = document.querySelector(
      ".chart-scroll-container"
    ) as HTMLElement;
    if (container) {
      // Each day has 8 data points (every 3 hours) and each bar is 246px wide. We show 5 days in the chart
      const dayWidth = 1 * 298; // 894px per day
      const scrollAmount = direction === "left" ? -dayWidth : dayWidth;

      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <button
        onClick={() => scrollByDay("left")}
        className="bg-slate-600 rounded-l-lg p-2 cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 h-[calc(100%+0.25rem)] z-10 transition-opacity duration-300 disabled:opacity-0 disabled:cursor-auto"
        disabled={isAtStart}
      >
        <AiOutlineLeft color="white" />
      </button>
      <button
        onClick={() => scrollByDay("right")}
        className="bg-slate-600 rounded-r-lg p-2 cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 h-[calc(100%+0.25rem)] z-10 transition-opacity duration-300 disabled:opacity-0 disabled:cursor-auto"
        disabled={isAtEnd}
      >
        <AiOutlineRight color="white" />
      </button>
    </>
  );
};

export default GraphButtons;
