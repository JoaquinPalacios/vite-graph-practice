"use client";

import { useScreenDetector } from "@/hooks/useScreenDetector";
import GraphButtons from "./GraphButtons";
import { useState, useRef } from "react";

const ChartsWrapper = ({ children }: { children: React.ReactNode }) => {
  // Add state to track scroll position and limits
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollPos = useRef(0);
  const lastScrollTime = useRef(Date.now());

  const { isMobile, isLandscapeMobile } = useScreenDetector();

  // Add function to check scroll limits
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
        axis.style.transform = `translateX(${scrollLeft}px)`;
        let rect = axis.querySelector(".y-axis-rect-left") as SVGRectElement;
        if (!rect) {
          // Create background rectangle
          rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

          // Set rectangle attributes
          rect.setAttribute("x", "0");
          rect.setAttribute("y", "0");
          rect.setAttribute(
            "width",
            isLandscapeMobile || isMobile ? "48" : "64"
          );
          rect.setAttribute("height", "320");
          rect.setAttribute("fill", "oklch(0.968 0.007 247.896)");
          rect.setAttribute("class", "y-axis-rect-left");

          // Insert rectangle as first child of the axis
          axis.insertBefore(rect, axis.firstChild);
        }

        // Set fill-opacity based on scroll position
        rect.setAttribute("fill-opacity", scrollLeft > 0 ? "1" : "0");
      }
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentTime = Date.now();
    const currentPos = (e.target as HTMLElement).scrollLeft;
    const timeDiff = currentTime - lastScrollTime.current;
    const scrollDiff = Math.abs(currentPos - lastScrollPos.current);

    checkScrollLimits(e);

    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // For non-mobile or slow scrolling, update immediately
    if (
      (!isMobile && !isLandscapeMobile) ||
      (timeDiff > 50 && scrollDiff < 5)
    ) {
      updateYAxisPosition(currentPos);
    } else {
      // For mobile with momentum scrolling, wait longer
      scrollTimeout.current = setTimeout(() => {
        updateYAxisPosition(currentPos);
      }, 300);
    }

    lastScrollPos.current = currentPos;
    lastScrollTime.current = currentTime;
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
