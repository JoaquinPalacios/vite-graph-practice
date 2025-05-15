"use client";

import { useScreenDetector } from "@/hooks/useScreenDetector";
import GraphButtons from "./GraphButtons";
import { useState, useRef, useEffect } from "react";

interface ChartsWrapperProps {
  children: React.ReactNode;
}

const ChartsWrapper = ({ children }: ChartsWrapperProps) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevScrollWidth = useRef<number>(0);
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  const checkScrollLimits = (e?: React.UIEvent<HTMLDivElement>) => {
    const container =
      (e?.target as HTMLElement) ||
      (document.querySelector(".chart-scroll-container") as HTMLElement);
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setIsAtStart(scrollLeft === 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10); // -10 for some buffer
  };

  // Check scroll limits and adjust scroll position when children (data) changes
  useEffect(() => {
    const container = document.querySelector(
      ".chart-scroll-container"
    ) as HTMLElement;
    if (!container) return;

    // Small delay to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      const currentScrollWidth = container.scrollWidth;
      const currentScrollLeft = container.scrollLeft;
      const clientWidth = container.clientWidth;

      // If we're switching to a model with less data
      if (prevScrollWidth.current > currentScrollWidth) {
        // Calculate the distance from the end in the previous model
        const distanceFromEnd =
          prevScrollWidth.current - (currentScrollLeft + clientWidth);
        // Calculate the width difference between models
        const widthDifference = prevScrollWidth.current - currentScrollWidth;

        // Add a small buffer (256px = one day width) to handle edge cases
        const buffer = 256;

        // If we're close to the end (within buffer + width difference)
        if (distanceFromEnd <= widthDifference + buffer) {
          // Calculate how much we need to scroll back
          const scrollAdjustment = Math.min(
            widthDifference + buffer, // Add buffer to ensure we don't see blank space
            currentScrollLeft // Don't scroll back more than the current scroll position
          );

          // Smoothly scroll to the new position
          container.scrollTo({
            left: currentScrollLeft - scrollAdjustment,
            behavior: "smooth",
          });
        }
      }

      // Update the previous scroll width for next comparison
      prevScrollWidth.current = currentScrollWidth;

      // Check scroll limits after adjusting position
      checkScrollLimits();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [children]);

  /**
   * Update the Y-axis position based on the scroll position
   * @param scrollLeft - The scroll position of the container
   */
  const updateYAxisPosition = (scrollLeft: number) => {
    // Handle Y-axis rects
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
          const isAdvanced = axis.classList.contains("advance-y-axis"); // The advanced Y axis needs to be 60px wide
          rect.setAttribute(
            "width",
            isLandscapeMobile || isMobile
              ? isAdvanced
                ? "60"
                : "48"
              : isAdvanced
              ? "60"
              : "64"
          );
          rect.setAttribute("height", "320");
          rect.setAttribute("fill", "oklch(0.968 0.007 247.896)");
          rect.setAttribute("class", "y-axis-rect-left");
          axis.insertBefore(rect, axis.firstChild);
        }

        rect.setAttribute("fill-opacity", scrollLeft > 0 ? "1" : "0");
      }
    });

    // Handle weather-rect
    const weatherRect = document.querySelector(".weather-rect") as HTMLElement;
    if (weatherRect) {
      let rect = weatherRect.querySelector(
        ".y-axis-rect-left"
      ) as SVGRectElement;
      if (!rect) {
        rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", "0");
        rect.setAttribute("y", "0");
        rect.setAttribute("width", isLandscapeMobile || isMobile ? "48" : "64");
        rect.setAttribute("height", "80");
        rect.setAttribute("fill", "oklch(0.968 0.007 247.896)");
        rect.setAttribute("class", "y-axis-rect-left");
        weatherRect.appendChild(rect);
      }

      rect.setAttribute("fill-opacity", scrollLeft > 0 ? "1" : "0");
    }
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
        className="chart-scroll-container tw:p-0 tw:w-full tw:overflow-y-auto tw:no-scrollbar tw:[-ms-overflow-style:none] tw:[scrollbar-width:none] tw:[&::-webkit-scrollbar-thumb]:bg-transparent tw:[&::-webkit-scrollbar-track]:bg-transparent"
        onScroll={handleScroll}
      >
        {children}
      </div>
    </>
  );
};

export default ChartsWrapper;
