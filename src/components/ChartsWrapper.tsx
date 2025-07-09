"use client";

import { useScreenDetector } from "@/hooks/useScreenDetector";
import { cn } from "@/utils/utils";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import GraphButtons from "./GraphButtons";

interface ChartsWrapperProps {
  children: React.ReactNode;
  hasSubscription: boolean;
}

interface ContainerDimensions {
  scrollWidth: number;
  scrollLeft: number;
  clientWidth: number;
}

/**
 * ChartsWrapper component
 * @description This component is used to wrap the charts in the graph.
 * This component is used to handle the scroll events and the scroll limits.
 * Also, the buttons for scrolling the graph are displayed here.
 * @param children - The children of the component
 * @returns The ChartsWrapper component
 */
const ChartsWrapper = ({
  children,
  hasSubscription,
}: ChartsWrapperProps): ReactElement => {
  const [isAtStart, setIsAtStart] = useState<boolean>(true);
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevScrollWidth = useRef<number>(0);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const { isMobile, isLandscapeMobile, isTablet } = useScreenDetector();
  const scrollContainerRef = useRef<HTMLDivElement>(
    null
  ) as React.MutableRefObject<HTMLInputElement>;
  const isDesktop = !isMobile && !isLandscapeMobile && !isTablet;

  const { events } = useDraggable(scrollContainerRef, {
    applyRubberBandEffect: false,
    decayRate: 0.95,
    safeDisplacement: 11,
    activeMouseButton: "Left",
    isMounted: isDesktop,
  });

  // Memoize the check scroll limits function
  const checkScrollLimits = useCallback(
    (e?: React.UIEvent<HTMLDivElement>): void => {
      const container =
        (e?.target as HTMLElement) || scrollContainerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10); // -10 for some buffer
    },
    []
  );

  useEffect(() => {
    // Cleanup the timeout when the component unmounts
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Memoize the get axis width function
  const getAxisWidth = useCallback(
    (isAdvanced: boolean): string => {
      if (isLandscapeMobile || isMobile) {
        return "48";
      }
      return isAdvanced ? "48" : "48";
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
      rect.setAttribute("fill", "oklch(96.7% 0.003 264.542)");
      rect.setAttribute("class", "y-axis-rect-left");
      axis.insertBefore(rect, axis.firstChild);
      return rect;
    },
    [getAxisWidth]
  );

  // Memoize the update rect widths function to avoid recreating it on every render
  const updateRectWidths = useCallback(() => {
    const axes = document.querySelectorAll(
      ".recharts-yAxis"
    ) as NodeListOf<HTMLElement>;
    axes.forEach((axis) => {
      if (!axis) return;
      const isAdvanced = axis.classList.contains("advance-y-axis");
      const rect = axis.querySelector(".y-axis-rect-left") as SVGRectElement;
      if (rect) {
        rect.setAttribute("width", getAxisWidth(isAdvanced));
      }
    });

    // Update weather rect width
    const weatherRect = document.querySelector(".weather-rect") as HTMLElement;
    if (weatherRect) {
      const rect = weatherRect.querySelector(
        ".y-axis-rect-left"
      ) as SVGRectElement;
      if (rect) {
        rect.setAttribute("width", getAxisWidth(false));
      }
    }
  }, [getAxisWidth]);

  // Effect to update rect widths when screen size changes
  useEffect(() => {
    updateRectWidths();
  }, [isMobile, isLandscapeMobile, updateRectWidths]);

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
        // Update width when updating position
        rect.setAttribute("width", getAxisWidth(isAdvanced));
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
        // Update width when updating position
        rect.setAttribute("width", getAxisWidth(false));
      }
    },
    [createRect, getAxisWidth]
  );

  // Memoize the handle scroll function
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>): void => {
      const scrollLeft = (e.target as HTMLElement).scrollLeft;
      checkScrollLimits(e);

      if (contentWrapperRef.current) {
        contentWrapperRef.current.style.pointerEvents = "none";
      }

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        if (contentWrapperRef.current) {
          contentWrapperRef.current.style.pointerEvents = "auto";
        }
      }, 75); // Re-enable pointer events after 75ms of no scrolling

      updateYAxisPosition(scrollLeft);
    },
    [checkScrollLimits, updateYAxisPosition]
  );

  // Effect to handle children changes and scroll adjustments
  useEffect(() => {
    const container = scrollContainerRef.current;
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
  }, [children, checkScrollLimits, updateYAxisPosition]);

  return (
    <>
      <GraphButtons isAtStart={isAtStart} isAtEnd={isAtEnd} />
      <div
        ref={scrollContainerRef}
        {...(isDesktop ? events : {})}
        className={cn(
          "chart-scroll-container tw:p-0 tw:w-full tw:overflow-y-auto tw:no-scrollbar tw:[-ms-overflow-style:none] tw:[scrollbar-width:none] tw:[&::-webkit-scrollbar-thumb]:bg-transparent tw:[&::-webkit-scrollbar-track]:bg-transparent",
          !hasSubscription &&
            "tw:md:w-[calc(100%-18rem)] tw:lg:w-[calc(100%-24rem)] tw:xl:w-[calc(100%-28rem)]",
          isDesktop && "no-user-select"
        )}
        onScroll={handleScroll}
      >
        <div ref={contentWrapperRef}>{children}</div>
      </div>
    </>
  );
};

export default ChartsWrapper;
