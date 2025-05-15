import { useMemo, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { ChartDataItem, TideDataFromDrupal } from "@/types";
import { useScreenDetector } from "@/hooks/useScreenDetector";

interface TransformedTidePoint {
  height: number;
  timestamp: number; // UTC epoch milliseconds
  localDateTimeISO: string; // Local ISO string, e.g., "YYYY-MM-DDTHH:MM:SS+HH:MM"
  utcDateTimeISO: string; // Corresponding UTC ISO string
  isBoundary?: boolean; // Flag for interpolated/boundary points
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
export const DthreeChart = ({
  tideData,
  swellData,
}: {
  tideData: TideDataFromDrupal[];
  swellData: ChartDataItem[];
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const yAxisRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const { isMobile, isLandscapeMobile } = useScreenDetector();

  const length = swellData.length;

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
    };

    // Now filter the rest of the data points based on the swell time range
    const rest = tideData
      .slice(1) // Start from index 1 since we've already processed the first point
      .map((point) => {
        const pointDate = parseDateTime(point._source.time_local);
        const pointTime = pointDate?.getTime() ?? 0;
        // Only include points within the swell time range
        if (
          pointTime >= (swellTimeRange?.min ?? -Infinity) &&
          pointTime <= (swellTimeRange?.max ?? Infinity)
        ) {
          return {
            height: Math.max(0, parseFloat(point._source.value)),
            timestamp: pointTime,
            localDateTimeISO: point._source.time_local,
            utcDateTimeISO: pointDate?.toISOString() ?? "",
          };
        }
        return null;
      })
      .filter(
        (p): p is TransformedTidePoint => p !== null && p.timestamp !== 0
      );

    return [newFirst, ...rest].sort((a, b) => a.timestamp - b.timestamp);
  }, [tideData, swellData, length]);

  const labelData = useMemo(() => {
    return transformedData.filter((d) => !d.isBoundary);
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

    const PIXELS_PER_DAY = 256; // Exact width per day in pixels
    const margin = { top: 20, right: 0, bottom: 5, left: 76 };

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
      svgDimensions.height - margin.top - margin.bottom - 20;

    // Create the chart area with proper translation
    const chartArea = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- Scales ---
    const maxTide = d3.max(transformedData, (d) => d.height) ?? 1;
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.ceil(maxTide)])
      .range([chartDrawingHeight, 0])
      .nice();

    // --- Y Axis ---
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickPadding(8)
      .tickFormat((d) => (d === 0 ? "" : d + "m"))
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
        `translate(${isMobile || isLandscapeMobile ? 48 : 64}, 20)`
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
      .attr("y", -20)
      .attr("width", PIXELS_PER_DAY)
      .attr("height", chartDrawingHeight + 20)
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
          .ticks(5)
          .tickSize(-chartDrawingWidth)
          .tickFormat(() => "") // Only lines, no labels
      );
    // Remove grid lines for 0 and the top tick
    yGridG.selectAll(".tick").each(function (d) {
      if (d === 0 || d === maxTickValue) {
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
          .attr("dy", 0)
          .text((d) => {
            const date = parseDateTime(d.localDateTimeISO);
            return date
              ? date
                  .toLocaleTimeString("en-AU", {
                    // day: "2-digit",
                    // month: "2-digit",
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

    // --- Interactive Layer for Hover Effects ---
    const hoverDot = chartArea
      .append("circle")
      .attr("class", "tide-hover-dot")
      .attr("r", 4)
      .attr("fill", "#008a93")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0)
      .attr("pointer-events", "none");

    // Update Delaunay to use exact pixel positions
    const delaunay = d3.Delaunay.from(
      labelData,
      (d) => {
        const dayIndex = Math.floor(
          (d.timestamp - timeDomain[0].getTime()) / (24 * 60 * 60 * 1000)
        );
        const dayProgress =
          (d.timestamp - timeDomain[0].getTime()) % (24 * 60 * 60 * 1000);
        const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
        return dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;
      },
      (d) => yScale(d.height)
    );

    chartArea
      .append("rect")
      .attr("class", "overlay")
      .attr("width", chartDrawingWidth)
      .attr("height", chartDrawingHeight)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", (event) => {
        const [pointerX, pointerY] = d3.pointer(event);
        if (
          pointerX < 0 ||
          pointerX > chartDrawingWidth ||
          pointerY < 0 ||
          pointerY > chartDrawingHeight
        ) {
          hoverDot.attr("opacity", 0);
          if (tooltipRef.current)
            d3.select(tooltipRef.current).style("display", "none");
          return;
        }
        const nearestIndex = delaunay.find(pointerX, pointerY);
        const nearestDataPoint = labelData[nearestIndex];

        if (nearestDataPoint) {
          const dayIndex = Math.floor(
            (nearestDataPoint.timestamp - timeDomain[0].getTime()) /
              (24 * 60 * 60 * 1000)
          );
          const dayProgress =
            (nearestDataPoint.timestamp - timeDomain[0].getTime()) %
            (24 * 60 * 60 * 1000);
          const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
          const x = dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;

          hoverDot
            .attr("cx", x)
            .attr("cy", yScale(nearestDataPoint.height))
            .attr("opacity", 1);
          if (tooltipRef.current) {
            const tooltipDiv = d3.select(tooltipRef.current);
            tooltipDiv
              .style("display", "block")
              .style("left", `${event.pageX + 15}px`)
              .style("top", `${event.pageY - 15}px`);
            const timeStr = parseDateTime(nearestDataPoint.localDateTimeISO)
              ?.toLocaleTimeString("en-AU", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              .toLowerCase();
            tooltipDiv.html(
              `<div>${nearestDataPoint.height.toFixed(
                2
              )}m</div><div>${timeStr}</div>`
            );
          }
        }
      })
      .on("mouseout", () => {
        hoverDot.attr("opacity", 0);
        if (tooltipRef.current)
          d3.select(tooltipRef.current).style("display", "none");
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
        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            display: "none",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 8px",
            fontSize: "10px",
            borderRadius: "3px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        ></div>
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

        <div
          ref={tooltipRef}
          style={{
            position: "absolute",
            display: "none",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "4px 8px",
            fontSize: "10px",
            borderRadius: "3px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        ></div>
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
