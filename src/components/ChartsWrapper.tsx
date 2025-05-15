"use client";

import { useScreenDetector } from "@/hooks/useScreenDetector";
import GraphButtons from "./GraphButtons";
import { useState, useRef, useEffect, useCallback } from "react";
import type { ReactElement } from "react";

interface ChartsWrapperProps {
  children: React.ReactNode;
}

interface ContainerDimensions {
  scrollWidth: number;
  scrollLeft: number;
  clientWidth: number;
}

const ChartsWrapper = ({ children }: ChartsWrapperProps): ReactElement => {
  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevScrollWidth = useRef<number>(0);
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  // Memoize the container selector to avoid repeated DOM queries
  const getContainer = useCallback((): HTMLElement | null => {
    return document.querySelector(".chart-scroll-container") as HTMLElement;
  }, []);

  // Memoize the check scroll limits function
  const checkScrollLimits = useCallback(
    (e?: React.UIEvent<HTMLDivElement>): void => {
      const container = (e?.target as HTMLElement) || getContainer();
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10); // -10 for some buffer
    },
    [getContainer]
  );

  // Memoize the get axis width function
  const getAxisWidth = useCallback(
    (isAdvanced: boolean): string => {
      if (isLandscapeMobile || isMobile) {
        return isAdvanced ? "60" : "48";
      }
      return isAdvanced ? "60" : "64";
    },
    [isMobile, isLandscapeMobile]
  );

  // Memoize the create rect function
  const createRect = useCallback(
    (axis: HTMLElement, isAdvanced: boolean): SVGRectElement => {
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rect.setAttribute("x", "0");
      rect.setAttribute("y", "0");
      rect.setAttribute("width", getAxisWidth(isAdvanced));
      rect.setAttribute("height", "320");
      rect.setAttribute("fill", "oklch(0.968 0.007 247.896)");
      rect.setAttribute("class", "y-axis-rect-left");
      axis.insertBefore(rect, axis.firstChild);
      return rect;
    },
    [getAxisWidth]
  );

  // Memoize the update Y-axis position function
  const updateYAxisPosition = useCallback(
    (scrollLeft: number): void => {
      const axes = document.querySelectorAll(
        ".recharts-yAxis"
      ) as NodeListOf<HTMLElement>;

      axes.forEach((axis) => {
        if (!axis) return;

        const isAdvanced = axis.classList.contains("advance-y-axis");

        // For advanced axis, check if it's actually visible
        if (isAdvanced) {
          const computedStyle = window.getComputedStyle(axis);
          const height = computedStyle.height;
          const opacity = computedStyle.opacity;

          // Only create rect if the axis is actually visible
          if (height === "0px" || opacity === "0") {
            return;
          }
        }

        let rect = axis.querySelector(".y-axis-rect-left") as SVGRectElement;
        if (!rect) {
          rect = createRect(axis, isAdvanced);
        }

        rect.setAttribute("fill-opacity", scrollLeft > 0 ? "1" : "0");
      });

      // Handle weather-rect
      const weatherRect = document.querySelector(
        ".weather-rect"
      ) as HTMLElement;
      if (weatherRect) {
        let rect = weatherRect.querySelector(
          ".y-axis-rect-left"
        ) as SVGRectElement;
        if (!rect) {
          rect = createRect(weatherRect, false);
          rect.setAttribute("height", "80");
        }
        rect.setAttribute("fill-opacity", scrollLeft > 0 ? "1" : "0");
      }
    },
    [createRect]
  );

  // Memoize the handle scroll function
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>): void => {
      const scrollLeft = (e.target as HTMLElement).scrollLeft;
      checkScrollLimits(e);

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      updateYAxisPosition(scrollLeft);
    },
    [checkScrollLimits, updateYAxisPosition]
  );

  // Effect to handle children changes and scroll adjustments
  useEffect(() => {
    const container = getContainer();
    if (!container) return;

    const timeoutId = setTimeout(() => {
      const dimensions: ContainerDimensions = {
        scrollWidth: container.scrollWidth,
        scrollLeft: container.scrollLeft,
        clientWidth: container.clientWidth,
      };

      // If we're switching to a model with less data
      if (prevScrollWidth.current > dimensions.scrollWidth) {
        const distanceFromEnd =
          prevScrollWidth.current -
          (dimensions.scrollLeft + dimensions.clientWidth);
        const widthDifference =
          prevScrollWidth.current - dimensions.scrollWidth;
        const buffer = 256; // One day width

        if (distanceFromEnd <= widthDifference + buffer) {
          const scrollAdjustment = Math.min(
            widthDifference + buffer,
            dimensions.scrollLeft
          );

          container.scrollTo({
            left: dimensions.scrollLeft - scrollAdjustment,
            behavior: "smooth",
          });
        }
      }

      prevScrollWidth.current = dimensions.scrollWidth;
      checkScrollLimits();

      // Wait for transitions to complete
      setTimeout(() => {
        updateYAxisPosition(dimensions.scrollLeft);
      }, 20);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [children, checkScrollLimits, getContainer, updateYAxisPosition]);

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
