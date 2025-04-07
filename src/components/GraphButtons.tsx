import { cn } from "@/utils/utils";
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
} from "react-icons/ai";

/**
 * GraphButtons component
 * @description This component is used to scroll the graph left and right
 * @param {boolean} isAtStart - Whether the graph is at the start
 * @param {boolean} isAtEnd - Whether the graph is at the end
 * @returns {JSX.Element} The GraphButtons component
 */
const GraphButtons = ({
  isAtStart,
  isAtEnd,
}: {
  isAtStart: boolean;
  isAtEnd: boolean;
}) => {
  const scrollByDay = (direction: "left" | "right", multiplier = 1) => {
    /**
     * Get the container element of the graph. This is the element that will be scrolled.
     */
    const container = document.querySelector(
      ".chart-scroll-container"
    ) as HTMLElement;
    if (container) {
      // Each day has 8 data points (every 3 hours) and each bar is 298px wide.
      const dayWidth = 1 * 298; // 298px per day
      const scrollAmount = direction === "left" ? -dayWidth : dayWidth;

      container.scrollBy({
        left: scrollAmount * multiplier,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center divide-y-2 divide-slate-200">
        <button
          onClick={() => scrollByDay("left", 1)}
          className={cn(
            "bg-slate-600 rounded-tl-lg p-2 cursor-pointer absolute left-0 top-0 h-1/2 z-10 transition-[opacity,colors,transform,shadow] duration-300 disabled:opacity-0 disabled:cursor-auto",
            "active:bg-slate-700 focus:bg-slate-700 focus:outline-none"
          )}
          disabled={isAtStart}
          aria-label="Scroll left one day"
        >
          <AiOutlineLeft color="white" size={18} />
        </button>
        <button
          onClick={() => scrollByDay("left", 4)}
          className={cn(
            "bg-slate-600 rounded-bl-lg p-2 cursor-pointer absolute left-0 bottom-0 h-1/2 z-10 transition-[opacity,colors,transform,shadow] duration-300 disabled:opacity-0 disabled:cursor-auto",
            "active:bg-slate-700 focus:bg-slate-700 focus:outline-none"
          )}
          disabled={isAtStart}
          aria-label="Scroll left four days"
        >
          <AiOutlineDoubleLeft color="white" size={18} />
        </button>
      </div>
      <div className="flex flex-col items-center divide-y-2 divide-slate-200">
        <button
          onClick={() => scrollByDay("right", 1)}
          className={cn(
            "bg-slate-600 rounded-tr-lg p-2 cursor-pointer absolute right-0 top-0 h-1/2 z-10 transition-[opacity,colors,transform,shadow] duration-300 disabled:opacity-0 disabled:cursor-auto",
            "active:bg-slate-700 focus:bg-slate-700 focus:outline-none"
          )}
          disabled={isAtEnd}
          aria-label="Scroll right one day"
        >
          <AiOutlineRight color="white" size={18} />
        </button>
        <button
          onClick={() => scrollByDay("right", 4)}
          className={cn(
            "bg-slate-600 rounded-br-lg p-2 cursor-pointer absolute right-0 bottom-0 h-1/2 z-10 transition-[opacity,colors,transform,shadow] duration-300 disabled:opacity-0 disabled:cursor-auto",
            "active:bg-slate-700 focus:bg-slate-700 focus:outline-none"
          )}
          disabled={isAtEnd}
          aria-label="Scroll right four days"
        >
          <AiOutlineDoubleRight color="white" size={18} />
        </button>
      </div>
    </>
  );
};

export default GraphButtons;
