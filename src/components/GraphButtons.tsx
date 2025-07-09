import { useScreenDetector } from "@/hooks/useScreenDetector";
import { cn } from "@/utils/utils";
import {
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
  AiOutlineLeft,
  AiOutlineRight,
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
      const dayWidth = 1 * 256; // 256px per day
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
          "tw:hidden tw:md:flex tw:flex-col tw:items-center tw:divide-y-2 tw:divide-gray-200"
        )}
      >
        <button
          onClick={() => scrollByDay("left", 1)}
          className={cn(
            "tw:bg-gray-300 tw:p-1 tw:cursor-pointer tw:absolute tw:left-0 tw:top-0 tw:h-1/2 tw:z-30 tw:transition-[opacity,colors,transform,shadow] tw:disabled:opacity-0 tw:disabled:cursor-auto",
            "tw:active:bg-[#c4c9d0] tw:focus:outline-none"
          )}
          disabled={isAtStart}
          aria-label="Scroll left one day"
        >
          <AiOutlineLeft color="oklch(21% 0.034 264.665)" size={18} />
        </button>
        <button
          onClick={() => scrollByDay("left", getScrollMultiplier())}
          className={cn(
            "tw:bg-gray-300 tw:p-1 tw:cursor-pointer tw:absolute tw:left-0 tw:bottom-0 tw:h-1/2 tw:z-30 tw:transition-[opacity,colors,transform,shadow] tw:disabled:opacity-0 tw:disabled:cursor-auto",
            "tw:active:bg-[#c4c9d0]  tw:focus:outline-none"
          )}
          disabled={isAtStart}
          aria-label="Scroll left multiple days"
        >
          <AiOutlineDoubleLeft color="oklch(21% 0.034 264.665)" size={18} />
        </button>
      </div>
      <div className="tw:hidden tw:md:flex tw:flex-col tw:items-center tw:divide-y-2 tw:divide-gray-200">
        <button
          onClick={() => scrollByDay("right", 1)}
          className={cn(
            "tw:bg-gray-300 tw:p-1 tw:cursor-pointer tw:absolute tw:right-0 tw:top-0 tw:h-1/2 tw:z-30 tw:transition-[opacity,colors,transform,shadow] tw:disabled:opacity-0 tw:disabled:cursor-auto",
            "tw:active:bg-[#c4c9d0]  tw:focus:outline-none"
          )}
          disabled={isAtEnd}
          aria-label="Scroll right one day"
        >
          <AiOutlineRight color="oklch(21% 0.034 264.665)" size={18} />
        </button>
        <button
          onClick={() => scrollByDay("right", getScrollMultiplier())}
          className={cn(
            "tw:bg-gray-300 tw:p-1 tw:cursor-pointer tw:absolute tw:right-0 tw:bottom-0 tw:h-1/2 tw:z-30 tw:transition-[opacity,colors,transform,shadow] tw:disabled:opacity-0 tw:disabled:cursor-auto",
            "tw:active:bg-[#c4c9d0]  tw:focus:outline-none"
          )}
          disabled={isAtEnd}
          aria-label="Scroll right multiple days"
        >
          <AiOutlineDoubleRight color="oklch(21% 0.034 264.665)" size={18} />
        </button>
      </div>
    </>
  );
};

export default GraphButtons;
