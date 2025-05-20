import { useMemo, useRef, useEffect, useState, useLayoutEffect } from "react";
import * as d3 from "d3";
import { ChartDataItem, TideDataFromDrupal } from "@/types";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import TideTooltip from "./TideTooltip";
import { bisector } from "d3-array";
import { timeFormat } from "d3-time-format";

interface TransformedTidePoint {
  height: number;
  timestamp: number;
  localDateTimeISO: string;
  utcDateTimeISO: string;
  isBoundary?: boolean;
  isInterpolated?: boolean;
  instance: "high" | "low";
}

// --- Helper: Function to parse ISO string robustly ---
const parseDateTime = (isoString: string): Date | null => {
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * D3 Chart Tide Component
 * @description It takes the tide data and swell data and renders the chart.
 * @param tideData - Tide data from Drupal
 * @param swellData - Swells data from Drupal
 * @returns Tide chart component
 */
export const TideChart = ({
  tideData,
  swellData,
}: {
  tideData: TideDataFromDrupal[];
  swellData: ChartDataItem[];
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const yAxisRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const { isMobile, isLandscapeMobile } = useScreenDetector();
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: TransformedTidePoint | null;
  }>({ visible: false, x: 0, y: 0, data: null });
  const tooltipDivRef = useRef<HTMLDivElement>(null);

  const length = swellData.length;

  const PIXELS_PER_DAY = 256; // Exact width per day in pixels

  // Add bisector for efficient point lookup
  const bisectTime = useMemo(
    () => bisector((d: TransformedTidePoint) => d.timestamp).left,
    []
  );

  // Formatter for tooltip date
  const tooltipDateFormat = useMemo(() => timeFormat("%a %d %b, %I:%M %p"), []);

  // Add this helper function at the top level of the component
  const calculateTooltipPosition = (
    x: number,
    y: number,
    tooltipWidth: number,
    tooltipHeight: number,
    chartWidth: number,
    chartHeight: number,
    margin: { left: number; right: number; top: number; bottom: number }
  ) => {
    // Default offset from the point
    const offsetX = 8;
    const offsetY = -8;

    // Calculate available space in each direction
    const spaceRight = chartWidth - (x + margin.left);
    const spaceTop = y + margin.top;

    // Determine horizontal position
    let tooltipX = x + margin.left + offsetX;
    if (spaceRight < tooltipWidth + offsetX) {
      // If not enough space on right, position on left
      tooltipX = x + margin.left - tooltipWidth - offsetX;
    }

    // Determine vertical position
    let tooltipY = y + margin.top + offsetY;
    if (spaceTop < tooltipHeight + Math.abs(offsetY)) {
      // If not enough space on top, position below
      tooltipY = y + margin.top + Math.abs(offsetY);
    }

    // Ensure tooltip stays within chart bounds
    tooltipX = Math.max(
      margin.left,
      Math.min(chartWidth - tooltipWidth - margin.right, tooltipX)
    );
    tooltipY = Math.max(
      margin.top,
      Math.min(chartHeight - tooltipHeight - margin.bottom, tooltipY)
    );

    return { x: tooltipX, y: tooltipY };
  };

  /**
   * First, transform the tide data into a format that can be used by D3
   * @description It takes the tide data and returns an array of objects with the following properties:
   * - height: number - The height of the tide
   * - timestamp: number - The timestamp of the tide
   * - localDateTimeISO: string - The local date and time of the tide
   * - utcDateTimeISO: string - The UTC date and time of the tide
   * - isBoundary: boolean - Whether the tide is a boundary tide
   */
  const transformedData = useMemo((): TransformedTidePoint[] => {
    if (!tideData?.length) return [];
    if (tideData.length < 2 && tideData.length > 0) {
      const point = tideData[0];
      const pointDate = parseDateTime(point._source.time_local);
      if (!pointDate) return [];
      return [
        {
          height: Math.max(0, parseFloat(point._source.value)),
          timestamp: pointDate.getTime(),
          localDateTimeISO: point._source.time_local,
          utcDateTimeISO: pointDate.toISOString(),
          instance: point._source.instance as "high" | "low",
        },
      ];
    }
    if (tideData.length < 2) return [];

    // Get the time range from swell data to ensure we only show tide data within that range
    const swellTimeRange = swellData?.slice(0, length).reduce(
      (acc, curr) => {
        const time = new Date(curr.localDateTimeISO).getTime();
        const TWO_HOURS_59_MINUTES_MS = (2 * 60 + 59) * 60 * 1000; // 2h 59m in milliseconds - so now the limit instead of being 9pm it is 11:59pm to catch the last tide of the day
        return {
          min: Math.min(acc.min, time),
          max: Math.max(acc.max, time) + TWO_HOURS_59_MINUTES_MS,
        };
      },
      { min: Infinity, max: -Infinity }
    );

    // First, process the initial points for interpolation
    const prevTide = tideData[0];
    const nextTide = tideData[1];
    const prevDate = parseDateTime(prevTide._source.time_local);
    const nextDate = parseDateTime(nextTide._source.time_local);
    if (!prevDate || !nextDate) return [];

    const prevTime = prevDate.getTime();
    const nextTime = nextDate.getTime();
    const prevHeight = parseFloat(prevTide._source.value);
    const nextHeight = parseFloat(nextTide._source.value);

    const nextTideLocal = nextTide._source.time_local;
    const localDatePart = nextTideLocal.split("T")[0];
    const offsetMatch = nextTideLocal.match(/[+-]\d{2}:\d{2}|Z$/);
    const localOffset = offsetMatch ? offsetMatch[0] : "";

    const midnightISO = `${localDatePart}T00:00:00${localOffset}`;
    const midnightDate = parseDateTime(midnightISO);
    if (!midnightDate) return [];
    const midnightTime = midnightDate.getTime();

    const totalMinutes = (nextTime - prevTime) / (1000 * 60);
    let midnightHeight = prevHeight;
    if (totalMinutes !== 0) {
      const minutesToMidnight = (midnightTime - prevTime) / (1000 * 60);
      const ratio = minutesToMidnight / totalMinutes;
      midnightHeight = prevHeight + (nextHeight - prevHeight) * ratio;
    }
    midnightHeight = Math.max(0, midnightHeight);

    const newFirst: TransformedTidePoint = {
      height: midnightHeight,
      timestamp: midnightTime,
      localDateTimeISO: midnightISO,
      utcDateTimeISO: midnightDate.toISOString(),
      isBoundary: true,
      instance: prevTide._source.instance as "high" | "low",
    };

    // Now filter the rest of the data points based on the swell time range
    const rest = tideData
      .slice(1)
      .map((point) => {
        const pointDate = parseDateTime(point._source.time_local);
        const pointTime = pointDate?.getTime() ?? 0;
        if (
          pointTime >= (swellTimeRange?.min ?? -Infinity) &&
          pointTime <= (swellTimeRange?.max ?? Infinity)
        ) {
          return {
            height: Math.max(0, parseFloat(point._source.value)),
            timestamp: pointTime,
            localDateTimeISO: point._source.time_local,
            utcDateTimeISO: pointDate?.toISOString() ?? "",
            instance: point._source.instance as "high" | "low",
          } as TransformedTidePoint;
        }
        return null;
      })
      .filter((p): p is TransformedTidePoint => p !== null);

    return [newFirst, ...rest].sort((a, b) => a.timestamp - b.timestamp);
  }, [tideData, swellData, length]);

  // Only show a dot if it's at least 15 minutes from the previous one (for real points)
  const labelData = useMemo(() => {
    const MIN_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
    const filtered: TransformedTidePoint[] = [];
    let lastTimestamp = -Infinity;
    for (const d of transformedData) {
      if (!d.isBoundary && d.timestamp - lastTimestamp >= MIN_INTERVAL_MS) {
        filtered.push(d);
        lastTimestamp = d.timestamp;
      }
    }
    return filtered;
  }, [transformedData]);

  /**
   * Second, determine the master time domain based on the data points
   * @description It takes the swell data and transformed tide data and returns an array of two dates:
   * - the earliest and latest data points
   * - the detected offset
   */
  const timeDomain = useMemo((): [Date, Date] => {
    let earliestDataTimestamp = Infinity;
    let latestDataTimestamp = -Infinity;
    let detectedOffset: string | null = null;

    const updateTimestampsAndOffset = (isoString: string) => {
      const date = parseDateTime(isoString);
      if (date) {
        const timestamp = date.getTime();
        earliestDataTimestamp = Math.min(earliestDataTimestamp, timestamp);
        latestDataTimestamp = Math.max(latestDataTimestamp, timestamp);
        if (!detectedOffset) {
          const match = isoString.match(/[+-]\d{2}:\d{2}|Z$/);
          if (match) detectedOffset = match[0];
        }
      }
    };

    // Only process the first 'length' items from swellData
    swellData
      ?.slice(0, length)
      .forEach((item) => updateTimestampsAndOffset(item.localDateTimeISO));
    transformedData
      ?.slice(0, length)
      .forEach((item) => updateTimestampsAndOffset(item.localDateTimeISO));

    if (
      earliestDataTimestamp === Infinity ||
      latestDataTimestamp === -Infinity
    ) {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to 1 day if no data
      console.warn(
        "D3 TideChart: No data to determine time domain, using default."
      );
      return [now, futureDate];
    }

    if (!detectedOffset) {
      console.warn(
        "D3 TideChart: Could not determine offset, defaulting to UTC for domain calculation."
      );
      detectedOffset = "+00:00";
    }

    // Use the actual timestamps from the data
    return [new Date(earliestDataTimestamp), new Date(latestDataTimestamp)];
  }, [swellData, transformedData, length]);

  /**
   * Third, D3 Rendering Effect
   * @description It takes the SVG, chart area, and data and renders the chart.
   */
  useEffect(() => {
    if (
      !svgRef.current ||
      !yAxisRef.current ||
      svgDimensions.width === 0 ||
      svgDimensions.height === 0 ||
      transformedData.length === 0 ||
      length <= 0
    ) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const yAxisSvg = d3.select(yAxisRef.current);
    svg.selectAll("*").remove();
    yAxisSvg.selectAll("*").remove();

    const margin = { top: 32, right: 0, bottom: 5, left: 76 };

    // Calculate the exact width needed for the chart area
    // This ensures each day stripe is exactly 256px wide
    const chartDrawingWidth =
      Math.ceil(
        (timeDomain[1].getTime() - timeDomain[0].getTime()) /
          (24 * 60 * 60 * 1000)
      ) * PIXELS_PER_DAY;

    // Set the SVG width to accommodate the chart area plus margins
    const totalWidth = chartDrawingWidth + margin.left + margin.right;
    svg.attr("width", totalWidth);

    // The height available for drawing
    const chartDrawingHeight =
      svgDimensions.height - margin.top - margin.bottom - 32;

    // Create the chart area with proper translation
    const chartArea = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- Scales ---
    const maxTide = d3.max(transformedData, (d) => d.height) ?? 1;

    // Create a linear scale for the Y-axis with modified domain
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.ceil(maxTide)])
      .range([chartDrawingHeight, 0])
      .nice();

    // Custom tick format function with correct type definition
    const customTickFormat = (d: d3.NumberValue) => {
      const value = Number(d);
      if (value === 0) return ""; // Keep hiding 0
      if (maxTide > 2.5) {
        // For max tide > 2.5, only show whole numbers
        return Number.isInteger(value) ? `${value}m` : "";
      }
      // For max tide <= 2.5, show all ticks with one decimal
      return `${value}m`;
    };

    // --- Y Axis ---
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(maxTide > 2.5 ? Math.ceil(maxTide) : 5) // Adjust number of ticks based on max tide
      .tickPadding(8)
      .tickFormat(customTickFormat)
      .tickSize(6);

    // Create a group for the Y-axis in its own SVG
    const yAxisG = yAxisSvg
      .append("rect")
      .attr("class", "y-axis-rect-left")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 64)
      .attr("height", svgDimensions.height)
      .attr("fill", "oklch(0.968 0.007 247.896)");

    // Add background rectangle to Y-axis
    yAxisSvg
      .append("g")
      .attr("class", "y-axis")
      .attr(
        "transform",
        `translate(${isMobile || isLandscapeMobile ? 48 : 64}, 32)`
      )
      .call(yAxis);

    // Hide the 0m label but keep its tick line
    yAxisG
      .selectAll(".tick text")
      .filter((d) => d === 0)
      .text("");

    // --- Background Stripes (rendered first, always at the back) ---
    const dayStarts: Date[] = [];
    const currentIterDay = new Date(timeDomain[0].getTime()); // Start from domainStart
    const numDays = Math.ceil(
      (timeDomain[1].getTime() - timeDomain[0].getTime()) /
        (24 * 60 * 60 * 1000)
    );
    for (let i = 0; i < numDays; i++) {
      dayStarts.push(new Date(currentIterDay.getTime()));
      currentIterDay.setDate(currentIterDay.getDate() + 1);
    }
    chartArea
      .append("g")
      .attr("class", "day-stripes")
      .selectAll("rect")
      .data(dayStarts)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * PIXELS_PER_DAY)
      .attr("y", -32)
      .attr("width", PIXELS_PER_DAY)
      .attr("height", chartDrawingHeight + 32 + 8) // Add 8px to account for the hover line and gives bottom padding
      .attr(
        "fill",
        (_, i) =>
          i % 2 === 0
            ? "oklch(0.929 0.013 255.508)" // Tailwind Slate 200
            : "oklch(0.968 0.007 247.896)" // Tailwind Slate 300
      )
      .lower();

    // --- Y Grid Lines (rendered after stripes, before data) ---
    // Draw horizontal grid lines for each Y tick, for visual clarity
    const maxTickValue = Math.ceil(maxTide);
    const yGridG = chartArea
      .append("g")
      .attr("class", "y-grid")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(maxTide > 2.5 ? Math.ceil(maxTide) : 5) // Match Y-axis ticks
          .tickSize(-chartDrawingWidth)
          .tickFormat(() => "") // Only lines, no labels
      );

    // Remove grid lines for 0 and non-integer values when maxTide > 2.5
    yGridG.selectAll(".tick").each(function (d) {
      const value = Number(d);
      if (
        value === 0 ||
        (maxTide > 2.5 && !Number.isInteger(value)) ||
        value === maxTickValue
      ) {
        d3.select(this).select("line").remove();
      }
    });

    // --- Clip Path for Tide Area ---
    const clipPathId = `tide-clip-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    chartArea
      .append("defs")
      .append("clipPath")
      .attr("id", clipPathId)
      .append("rect")
      .attr("width", chartDrawingWidth)
      .attr("height", chartDrawingHeight);

    // --- Tide Area ---
    const areaGenerator = d3
      .area<TransformedTidePoint>()
      .x((d) => {
        // Calculate exact pixel position based on the timestamp's position in the data array
        const dayIndex = Math.floor(
          (d.timestamp - timeDomain[0].getTime()) / (24 * 60 * 60 * 1000)
        );
        const dayProgress =
          (d.timestamp - timeDomain[0].getTime()) % (24 * 60 * 60 * 1000);
        const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
        return dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;
      })
      .y0(chartDrawingHeight)
      .y1((d) => yScale(d.height))
      .curve(d3.curveMonotoneX);

    chartArea
      .append("path")
      .datum(transformedData)
      .attr("class", "tide-area")
      .attr("fill", "#008a93")
      .attr("stroke", "#008a93")
      .attr("stroke-width", 1)
      .attr("fill-opacity", 0.4)
      .attr("d", areaGenerator)
      .attr("clip-path", `url(#${clipPathId})`);

    // Get the DOM node for the area path for curve sampling
    const areaPathNode = chartArea
      .select(".tide-area")
      .node() as SVGPathElement | null;

    // --- Tide Labels (Time, Date, and Height) ---
    const labelGroup = chartArea
      .append("g")
      .attr("class", "tide-labels")
      .attr("font-size", 10)
      .attr("text-anchor", "middle");

    labelGroup
      .selectAll("text.tide-label-item")
      .data(labelData)
      .join("text")
      .attr("class", "tide-label-item")
      .attr("transform", (d) => {
        const dayIndex = Math.floor(
          (d.timestamp - timeDomain[0].getTime()) / (24 * 60 * 60 * 1000)
        );
        const dayProgress =
          (d.timestamp - timeDomain[0].getTime()) % (24 * 60 * 60 * 1000);
        const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
        const x = dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;
        return `translate(${x},${yScale(d.height) - 20})`;
      })
      .attr("dy", "-8px")
      .call((text) =>
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", (d) => (d.instance === "low" ? "-2" : "2"))
          .text((d) => {
            const date = parseDateTime(d.localDateTimeISO);
            return date
              ? date
                  .toLocaleTimeString("en-AU", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .replace(" ", "")
                  .toLowerCase()
              : "";
          })
      )
      .call((text) =>
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .text((d) => `${d.height.toFixed(2)}m`)
      );

    // --- Tide Dots (Always-visible for real tide points) ---
    chartArea
      .append("g")
      .attr("class", "tide-dots")
      .selectAll("circle")
      .data(labelData)
      .enter()
      .append("circle")
      .attr("cx", (d) => {
        const dayIndex = Math.floor(
          (d.timestamp - timeDomain[0].getTime()) / (24 * 60 * 60 * 1000)
        );
        const dayProgress =
          (d.timestamp - timeDomain[0].getTime()) % (24 * 60 * 60 * 1000);
        const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
        return dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;
      })
      .attr("cy", (d) => yScale(d.height))
      .attr("r", 2.5)
      .attr("fill", "#008a93")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5);

    // --- Interactive Layer for Hover Effects ---
    // Remove hoverDot, add hoverLine
    const hoverLine = chartArea
      .append("rect")
      .attr("class", "tide-hover-line")
      .attr("width", 1)
      .attr("height", chartDrawingHeight)
      .attr("y", 0)
      .attr("fill", "oklch(12.9% 0.042 264.695)") // Tailwind Slate 950
      .attr("opacity", 0)
      .attr("pointer-events", "none");

    chartArea
      .append("rect")
      .attr("class", "overlay")
      .attr("width", chartDrawingWidth)
      .attr("height", chartDrawingHeight)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", (event) => {
        const [pointerX, pointerY] = d3.pointer(event);

        // Early exit if outside chart bounds
        if (
          pointerX < 0 ||
          pointerX > chartDrawingWidth ||
          pointerY < 0 ||
          pointerY > chartDrawingHeight
        ) {
          hoverLine.attr("opacity", 0);
          setTooltipState((prev) => ({ ...prev, visible: false }));
          return;
        }

        // --- Find the closest point on the area curve to the mouse X ---
        let x = pointerX;
        let interpolatedPoint: TransformedTidePoint | null = null;
        if (areaPathNode) {
          // Convert mouse X to timestamp
          const dayIndex = Math.floor(pointerX / PIXELS_PER_DAY);
          const dayProgress = pointerX % PIXELS_PER_DAY;
          const dayFraction = dayProgress / PIXELS_PER_DAY;
          const mouseTimestamp =
            timeDomain[0].getTime() +
            dayIndex * 24 * 60 * 60 * 1000 +
            dayFraction * 24 * 60 * 60 * 1000;

          // Find the two points that bracket the mouse timestamp
          const i = bisectTime(transformedData, mouseTimestamp);
          const left = transformedData[i - 1];
          const right = transformedData[i];

          // Handle edge cases
          if (!left || !right) {
            const point = left || right;
            if (point) {
              const px = (() => {
                const dayIndex = Math.floor(
                  (point.timestamp - timeDomain[0].getTime()) /
                    (24 * 60 * 60 * 1000)
                );
                const dayProgress =
                  (point.timestamp - timeDomain[0].getTime()) %
                  (24 * 60 * 60 * 1000);
                const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
                return dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;
              })();
              x = px;
              interpolatedPoint = {
                ...point,
                isInterpolated: false,
              };
            }
          } else {
            // Calculate interpolated position and height
            const t =
              (mouseTimestamp - left.timestamp) /
              (right.timestamp - left.timestamp);
            const clampedT = Math.max(0, Math.min(1, t));
            const interpolatedHeight =
              left.height + clampedT * (right.height - left.height);
            interpolatedPoint = {
              height: interpolatedHeight,
              timestamp: mouseTimestamp,
              localDateTimeISO: tooltipDateFormat(new Date(mouseTimestamp)),
              utcDateTimeISO: new Date(mouseTimestamp).toISOString(),
              instance: clampedT < 0.5 ? left.instance : right.instance,
              isInterpolated: true,
            };
          }
        }

        // The vertical line always spans the full chart height
        hoverLine
          .attr("x", x - 0.5)
          .attr("y", 0)
          .attr("height", chartDrawingHeight)
          .attr("opacity", 0.2);

        // Tooltip logic (unchanged)
        if (interpolatedPoint) {
          // For tooltip Y, use the interpolated Y value on the curve
          const y = yScale(interpolatedPoint.height);
          const tooltipDiv = tooltipDivRef.current;
          const tooltipRect = tooltipDiv?.getBoundingClientRect();
          const tooltipWidth = tooltipRect?.width ?? 0;
          const tooltipHeight = tooltipRect?.height ?? 0;
          const tooltipPosition = calculateTooltipPosition(
            x,
            y,
            tooltipWidth,
            tooltipHeight,
            chartDrawingWidth,
            chartDrawingHeight,
            margin
          );
          setTooltipState({
            visible: true,
            x: tooltipPosition.x,
            y: tooltipPosition.y,
            data: interpolatedPoint,
          });
        }
      })
      .on("mouseout", () => {
        hoverLine.attr("opacity", 0);
        setTooltipState((prev) => ({ ...prev, visible: false }));
      });

    // Update the container width style to match the SVG width
    if (containerRef.current) {
      containerRef.current.style.width = `${totalWidth}px`;
    }
  }, [svgDimensions, transformedData, labelData, timeDomain, length]);

  /**
   * Fourth, Resize Observer
   * @description It takes the container and sets the SVG dimensions
   */
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setSvgDimensions({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Tooltip boundary detection and adjustment (relative to container)
  useLayoutEffect(() => {
    if (
      !tooltipState.visible ||
      !tooltipDivRef.current ||
      !containerRef.current
    )
      return;

    const tooltipRect = tooltipDivRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    let left = tooltipState.x;
    let top = tooltipState.y;
    const margin = 8; // margin from edge

    // Clamp right
    if (left + tooltipRect.width > containerRect.width) {
      left = containerRect.width - tooltipRect.width - margin;
    }
    // Clamp left
    if (left < 0) {
      left = margin;
    }
    // Clamp bottom
    if (top + tooltipRect.height > containerRect.height) {
      top = containerRect.height - tooltipRect.height - margin;
    }
    // Clamp top
    if (top < 0) {
      top = margin;
    }

    // Only update if changed
    if (left !== tooltipState.x || top !== tooltipState.y) {
      setTooltipState((prev) => ({ ...prev, x: left, y: top }));
    }
  }, [tooltipState, svgDimensions]);

  /**
   * Fifth, Render
   * @description It takes the container and renders the chart.
   */
  if (!transformedData.length && length <= 0) {
    // Check length too
    return (
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", position: "relative" }}
        className="tw:h-36 tw:min-h-36"
      >
        <div>Loading tide data or no data available...</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: "100%",
          overflow: "hidden",
        }}
        className="tw:h-36 tw:min-h-36"
      >
        <svg
          ref={svgRef}
          width={svgDimensions.width}
          height={svgDimensions.height}
        >
          {/* D3 renders here */}
        </svg>

        {/* React TideTooltip for hover */}
        {tooltipState.visible && tooltipState.data && (
          <div
            ref={tooltipDivRef}
            style={{
              position: "absolute",
              left: tooltipState.x,
              top: tooltipState.y,
              zIndex: 10,
              pointerEvents: "none",
              transform: "translate(0, 0)", // Remove any transform that might affect positioning
            }}
          >
            <TideTooltip
              active={true}
              payload={[
                {
                  value: tooltipState.data.height,
                  payload: tooltipState.data,
                },
              ]}
            />
          </div>
        )}
      </div>
      {/* Y-axis container */}
      <div className="tw:w-12 tw:md:w-16 tw:h-fit tw:absolute tw:left-0 tw:md:left-3 tw:bottom-0 tw:z-10 tw:pointer-events-none">
        <svg
          ref={yAxisRef}
          width={isMobile || isLandscapeMobile ? 48 : 64}
          height={svgDimensions.height}
          className="tw:w-12 tw:md:w-16"
        />
      </div>
    </>
  );
};
