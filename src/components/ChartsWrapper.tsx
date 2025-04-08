"use client";

import { useScreenDetector } from "@/hooks/useScreenDetector";
import GraphButtons from "./GraphButtons";
import { useState, useRef } from "react";

interface ChartsWrapperProps {
  children: React.ReactNode;
}

const ChartsWrapper = ({ children }: ChartsWrapperProps) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  const checkScrollLimits = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setIsAtStart(scrollLeft === 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10); // -10 for some buffer
  };

  const updateYAxisPosition = (scrollLeft: number) => {
    const axes = document.querySelectorAll(
      ".recharts-yAxis"
    ) as NodeListOf<HTMLElement>;

    axes.forEach((axis) => {
      if (axis) {
        let rect = axis.querySelector(".y-axis-rect-left") as SVGRectElement;
        if (!rect) {
          rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", "0");
          rect.setAttribute("y", "0");
          rect.setAttribute(
            "width",
            isLandscapeMobile || isMobile ? "48" : "64"
          );
          rect.setAttribute("height", "320");
          rect.setAttribute("fill", "oklch(0.968 0.007 247.896)");
          rect.setAttribute("class", "y-axis-rect-left");
          axis.insertBefore(rect, axis.firstChild);
        }

        rect.setAttribute("fill-opacity", scrollLeft > 0 ? "1" : "0");
      }
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = (e.target as HTMLElement).scrollLeft;
    checkScrollLimits(e);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    updateYAxisPosition(scrollLeft);
  };

  return (
    <>
      <GraphButtons isAtStart={isAtStart} isAtEnd={isAtEnd} />

      <div
        className="p-0 w-full overflow-y-auto no-scrollbar chart-scroll-container [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent"
        onScroll={handleScroll}
      >
        {children}
      </div>
    </>
  );
};

export default ChartsWrapper;
