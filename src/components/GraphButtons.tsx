import { useScreenDetector } from "@/hooks/useScreenDetector";
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
  const { isDesktop, isLargeDesktop, isExtraLargeDesktop } =
    useScreenDetector();

  /**
   * Get the scroll multiplier based on screen size
   */
  const getScrollMultiplier = () => {
    switch (true) {
      case isExtraLargeDesktop:
        return 4;
      case isLargeDesktop:
        return 3;
      case isDesktop:
        return 2;
      default:
        return 3;
    }
  };

  /**
   * Scroll the graph by a given number of days
   */
  const scrollByDay = (direction: "left" | "right", multiplier = 1) => {
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
      <div
        className={cn(
          "hidden md:flex flex-col items-center divide-y-2 divide-slate-200"
        )}
      >
        <button
          onClick={() => scrollByDay("left", 1)}
          className={cn(
            "bg-slate-600 p-1.5 sm:p-2 cursor-pointer absolute left-0 top-0 h-1/2 z-30 transition-[opacity,colors,transform,shadow] duration-300 disabled:opacity-0 disabled:cursor-auto",
            "active:bg-slate-700 focus:bg-slate-700 focus:outline-none"
          )}
          disabled={isAtStart}
          aria-label="Scroll left one day"
        >
          <AiOutlineLeft color="white" size={18} />
        </button>
        <button
          onClick={() => scrollByDay("left", getScrollMultiplier())}
          className={cn(
            "bg-slate-600 p-1.5 sm:p-2 cursor-pointer absolute left-0 bottom-0 h-1/2 z-30 transition-[opacity,colors,transform,shadow] duration-300 disabled:opacity-0 disabled:cursor-auto",
            "active:bg-slate-700 focus:bg-slate-700 focus:outline-none"
          )}
          disabled={isAtStart}
          aria-label="Scroll left multiple days"
        >
          <AiOutlineDoubleLeft color="white" size={18} />
        </button>
      </div>
      <div className="hidden md:flex flex-col items-center divide-y-2 divide-slate-200">
        <button
          onClick={() => scrollByDay("right", 1)}
          className={cn(
            "bg-slate-600 p-1.5 sm:p-2 cursor-pointer absolute right-0 top-0 h-1/2 z-30 transition-[opacity,colors,transform,shadow] duration-300 disabled:opacity-0 disabled:cursor-auto",
            "active:bg-slate-700 focus:bg-slate-700 focus:outline-none"
          )}
          disabled={isAtEnd}
          aria-label="Scroll right one day"
        >
          <AiOutlineRight color="white" size={18} />
        </button>
        <button
          onClick={() => scrollByDay("right", getScrollMultiplier())}
          className={cn(
            "bg-slate-600 p-1.5 sm:p-2 cursor-pointer absolute right-0 bottom-0 h-1/2 z-30 transition-[opacity,colors,transform,shadow] duration-300 disabled:opacity-0 disabled:cursor-auto",
            "active:bg-slate-700 focus:bg-slate-700 focus:outline-none"
          )}
          disabled={isAtEnd}
          aria-label="Scroll right multiple days"
        >
          <AiOutlineDoubleRight color="white" size={18} />
        </button>
      </div>
    </>
  );
};

export default GraphButtons;
