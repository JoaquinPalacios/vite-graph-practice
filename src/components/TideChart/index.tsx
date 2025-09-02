import { METERS_TO_FEET } from "@/constants/meters_to_feet";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import { getLocationMidnightUTC } from "@/lib/time-utils";
import { ChartDataItem, TideDataFromDrupal, UnitPreferences } from "@/types";
import * as d3 from "d3";
import { bisector } from "d3-array";
import { timeFormat } from "d3-time-format";
import { formatInTimeZone } from "date-fns-tz";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TideTooltip } from "./TideTooltip";

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

// Helper function to get tide height
const getTideHeight = (tide: TideDataFromDrupal): number => {
  return tide._source.height;
};

// Helper function to get tide instance/type
const getTideInstance = (tide: TideDataFromDrupal): "high" | "low" => {
  return tide._source.type;
};

/**
 * D3 Chart Tide Component
 * @description It takes the tide data and swell data and renders the chart.
 * @param tideData - Tide data from Drupal
 * @param swellData - Swells data from Drupal
 * @param timezone - The timezone
 * @param unitPreferences - The unit preferences for the chart
 * @returns Tide chart component
 */
export const TideChart = ({
  tideData,
  swellData,
  timezone,
  exactTimestamp,
  unitPreferences,
}: {
  tideData: TideDataFromDrupal[];
  swellData: ChartDataItem[];
  timezone: string;
  exactTimestamp?: number;
  unitPreferences: UnitPreferences;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const yAxisRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const { isMobile, isLandscapeMobile, isTablet } = useScreenDetector();
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: TransformedTidePoint | null;
  }>({ visible: false, x: 0, y: 0, data: null });
  const tooltipDivRef = useRef<HTMLDivElement>(null);

  // Add state for click events on small devices
  const [clickedTimestamp, setClickedTimestamp] = useState<number | null>(null);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);

  // Determine if we should use click events (small devices) or hover events (desktop)
  const useClickEvents = isMobile || isLandscapeMobile || isTablet;

  const isFeet = unitPreferences.units.unitMeasurements === "ft";

  // Function to close tooltip
  const closeTooltip = useCallback(() => {
    setClickedTimestamp(null);
    setHoveredTimestamp(null);
    setTooltipState((prev) => ({ ...prev, visible: false }));
  }, []);

  // Get the active timestamp based on device type
  const activeTimestamp = useClickEvents ? clickedTimestamp : hoveredTimestamp;

  const length = swellData.length === 0 ? 128 : swellData.length;

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
   * @description Since PHP now pre-processes the data, we only need to map all points
   * without filtering by swellTimeRange. The visual range will be controlled by timeDomain.
   */
  const transformedData = useMemo((): TransformedTidePoint[] => {
    if (!tideData || !Array.isArray(tideData) || tideData.length === 0) {
      console.warn("D3 TideChart: No tide data available or invalid format.");
      return [];
    }

    // PHP sends data for the correct 16-day range, starting with midnight.
    // We just need to transform its structure and ensure dates are valid.
    return (
      tideData
        .map((point) => {
          if (!point?._source?.time_local) {
            console.warn(
              "D3 TideChart: Skipping invalid tide data point (no time_local):",
              point
            );
            return null;
          }

          const pointDate = parseDateTime(point._source.time_local);
          if (!pointDate) {
            console.warn(
              "D3 TideChart: Failed to parse date:",
              point._source.time_local
            );
            return null;
          }

          const pointTime = pointDate.getTime();
          return {
            height: isFeet
              ? getTideHeight(point) * METERS_TO_FEET
              : getTideHeight(point),
            timestamp: pointTime,
            localDateTimeISO: point._source.time_local,
            utcDateTimeISO: pointDate.toISOString(),
            instance: getTideInstance(point),
            isBoundary: !!point._source.is_boundary,
          } as TransformedTidePoint;
        })
        .filter((p): p is TransformedTidePoint => p !== null)
        // Keep sort as a safety measure, though PHP should send sorted data
        .sort((a, b) => a.timestamp - b.timestamp)
    );
  }, [tideData, isFeet]); // Only depend on tideData and isFeet

  // Generate Y-axis tick values based on max tide height and unit preference
  const generateYTicks = useMemo(() => {
    const maxTide = d3.max(transformedData, (d) => d.height) ?? 1;
    const minTide = d3.min(transformedData, (d) => d.height) ?? 0;
    const maxHeight = Math.ceil(Math.max(Math.abs(maxTide), Math.abs(minTide)));

    if (isFeet) {
      if (maxHeight <= 4) {
        // Show all ticks up to the actual maximum
        return Array.from({ length: maxHeight + 1 }, (_, i) => i);
      }
      if (maxHeight <= 14) {
        // Round up to the nearest multiple of 2 for better tick spacing
        const roundedToTwo = Math.ceil(maxHeight / 2) * 2;
        return Array.from({ length: roundedToTwo / 2 + 1 }, (_, i) => i * 2);
      }
      if (maxHeight <= 16) {
        return [0, 4, 8, 12, 16];
      }
      // For values greater than 16, show ticks in increments of 5
      const roundedToFive = Math.ceil(maxHeight / 5) * 5;
      return Array.from({ length: roundedToFive / 5 + 1 }, (_, i) => i * 5);
    }

    // For meters, use the existing logic for small ranges
    if (Math.abs(maxTide) <= 1 && Math.abs(minTide) <= 1) {
      return [-1, -0.5, 0, 0.5, 1];
    }

    // For larger ranges in meters, show whole numbers
    return Array.from({ length: maxHeight + 1 }, (_, i) => i);
  }, [transformedData, isFeet]);

  // Data for tide dots (all non-boundary points)
  const dotData = useMemo(
    () => transformedData.filter((d) => !d.isBoundary),
    [transformedData]
  );

  // Data for tide labels, filtered to prevent overlap
  const labelData = useMemo(() => {
    const MIN_LABEL_INTERVAL_MS = 2.5 * 60 * 60 * 1000; // 2.5 hours
    const filtered: TransformedTidePoint[] = [];
    let lastLabelTimestamp = -Infinity;

    for (const d of dotData) {
      if (d.timestamp - lastLabelTimestamp >= MIN_LABEL_INTERVAL_MS) {
        filtered.push(d);
        lastLabelTimestamp = d.timestamp;
      }
    }
    return filtered;
  }, [dotData]);

  /**
   * Second, determine the master time domain based on the data points
   * @description Defines the visual range of the chart's x-axis, using PHP's midnight point
   * for domain start and either swell data or tide data for domain end
   */
  const timeDomain = useMemo((): [Date, Date] => {
    if (!transformedData || transformedData.length === 0) {
      const now = new Date();
      return [now, new Date(now.getTime() + 24 * 60 * 60 * 1000)];
    }

    // PHP ensures first point is midnight of the first day
    const domainStart = new Date(transformedData[0].timestamp);
    let basisForDomainEnd: Date;

    if (swellData && swellData.length > 0) {
      // Calculate max timestamp from swell data
      const swellMaxTimestamp = swellData
        .slice(0, length)
        .reduce((maxTime, curr) => {
          if (!curr?.dateTime) return maxTime;
          const time = new Date(curr.dateTime).getTime();
          return Math.max(maxTime, time);
        }, -Infinity);
      // Add buffer to ensure last tide point is included
      const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
      basisForDomainEnd = new Date(swellMaxTimestamp + THREE_HOURS_MS);
    } else {
      // Use the last tide point if no swell data
      basisForDomainEnd = new Date(
        transformedData[transformedData.length - 1].timestamp
      );
    }

    // Ensure domainEnd is at least one full day after domainStart
    const minEndDate = new Date(
      domainStart.getTime() + 24 * 60 * 60 * 1000 - 1
    ); // Just before next midnight
    if (basisForDomainEnd < minEndDate) {
      basisForDomainEnd = minEndDate;
    }

    // Get midnight of the current day for the basisForDomainEnd
    const domainEnd = getLocationMidnightUTC(basisForDomainEnd, timezone);

    // Only add an extra day if the content actually extends into the next day
    const contentEndHour = parseInt(
      formatInTimeZone(basisForDomainEnd, timezone, "H"),
      10
    );
    if (contentEndHour >= 21) {
      // If content extends past 9 PM, show next day
      domainEnd.setDate(domainEnd.getDate() + 1);
    }

    return [domainStart, new Date(domainEnd.getTime() - 90 * 60 * 1000)];
  }, [transformedData, swellData, timezone, length]);

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

    const margin = { top: 32, right: 0, bottom: 12, left: 76 }; // Margin bottom determines the space between the chart and the bottom edge of its container

    // Calculate the exact width needed for the chart area
    // This ensures each day stripe is exactly 256px wide
    const chartDrawingWidth =
      ((timeDomain[1].getTime() - timeDomain[0].getTime()) /
        (24 * 60 * 60 * 1000)) *
      PIXELS_PER_DAY;

    // Set the SVG width to accommodate the chart area plus margins
    const totalWidth = chartDrawingWidth + margin.left + margin.right;
    svg.attr("width", totalWidth);

    // The height available for drawing
    const chartDrawingHeight =
      svgDimensions.height - margin.top - margin.bottom;

    // Create the chart area with proper translation
    const chartArea = svg
      .append("g")
      .attr(
        "transform",
        `translate(${isMobile || isLandscapeMobile ? 60 : margin.left},${
          margin.top
        })`
      );

    // --- Scales ---
    const maxTide = d3.max(transformedData, (d) => d.height) ?? 1;
    const minTide = d3.min(transformedData, (d) => d.height) ?? 0;

    // Create a linear scale for the Y-axis with modified domain to include negative values
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(0, minTide), Math.ceil(maxTide)])
      .range([chartDrawingHeight, 0])
      .nice();

    // Custom tick format function with correct type definition
    const customTickFormat = (d: d3.NumberValue) => {
      const value = Number(d);
      const unit = isFeet ? "ft" : "m";

      if (value === 0) return `0${unit}`; // Show 0m/0ft instead of hiding it

      // For max tide ≤ 1m and min tide ≥ -1m, show 0.5m intervals
      if (Math.abs(maxTide) <= 1 && Math.abs(minTide) <= 1) {
        if (Math.abs(value) === 0.5 || Math.abs(value) === 1) {
          return `${value}${unit}`;
        }
        return "";
      }

      // For larger ranges, show whole numbers
      return `${Math.round(value)}${unit}`;
    };

    // --- Y Axis ---
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(generateYTicks)
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
      .attr("fill", "oklch(96.7% 0.003 264.542)"); // Tailwind gray-100

    // Add background rectangle to Y-axis
    yAxisSvg
      .append("g")
      .attr("class", "y-axis tide-y-axis-group")
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
      .attr("height", chartDrawingHeight + 32) // Add 8px to account for the hover line and gives bottom padding
      .attr(
        "fill",
        (_, i) =>
          i % 2 === 0
            ? "#eceef1" // Tailwind gray-150
            : "oklch(96.7% 0.003 264.542)" // Tailwind gray-100
      )
      .lower();

    // --- Y Grid Lines (rendered after stripes, before data) ---
    // Draw horizontal grid lines for each Y tick, for visual clarity
    const gridAxis = d3
      .axisLeft(yScale)
      .tickValues(generateYTicks)
      .tickSize(-chartDrawingWidth)
      .tickFormat(() => ""); // Only lines, no labels

    const yGridG = chartArea.append("g").attr("class", "y-grid").call(gridAxis);

    // Remove the domain path to prevent the extra line at the top
    yGridG.select(".domain").remove();

    // Style the zero line differently
    yGridG.selectAll(".tick").each(function (d) {
      const value = Number(d);
      const line = d3.select(this).select("line");
      if (value === 0) {
        line
          .attr("stroke", "oklch(12.9% 0.042 264.695)") // Darker color for zero line
          .attr("stroke-width", 1.5);
      } else {
        line
          .attr("stroke", "oklch(0.929 0.013 255.508)") // Lighter color for other grid lines
          .attr("stroke-width", 1);
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
        const x = dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;
        return x;
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
              ? formatInTimeZone(date, timezone, "h:mm a")
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
          .text((d) => `${d.height.toFixed(2)}${isFeet ? "ft" : "m"}`)
      );

    // --- Tide Dots (Always-visible for real tide points) ---
    chartArea
      .append("g")
      .attr("class", "tide-dots")
      .selectAll("circle")
      .data(dotData)
      .enter()
      .append("circle")
      .attr("cx", (d) => {
        const dayIndex = Math.floor(
          (d.timestamp - timeDomain[0].getTime()) / (24 * 60 * 60 * 1000)
        );
        const dayProgress =
          (d.timestamp - timeDomain[0].getTime()) % (24 * 60 * 60 * 1000);
        const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
        const x = dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;
        return x;
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

    // Update hover line position based on active timestamp
    if (activeTimestamp !== null) {
      const dayIndex = Math.floor(
        (activeTimestamp - timeDomain[0].getTime()) / (24 * 60 * 60 * 1000)
      );
      const dayProgress =
        (activeTimestamp - timeDomain[0].getTime()) % (24 * 60 * 60 * 1000);
      const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
      const x = dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;

      hoverLine
        .attr("x", x - 0.5)
        .attr("y", 0)
        .attr("height", chartDrawingHeight)
        .attr("opacity", 0.2);
    } else {
      hoverLine.attr("opacity", 0);
    }

    chartArea
      .append("rect")
      .attr("class", "overlay")
      .attr("width", chartDrawingWidth)
      .attr("height", chartDrawingHeight)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", (event) => {
        if (useClickEvents) return; // Skip hover events on small devices

        const [pointerX, pointerY] = d3.pointer(event);

        // Early exit if outside chart bounds
        if (
          pointerX < 0 ||
          pointerX > chartDrawingWidth ||
          pointerY < 0 ||
          pointerY > chartDrawingHeight
        ) {
          setHoveredTimestamp(null);
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
              localDateTimeISO: formatInTimeZone(
                new Date(mouseTimestamp),
                timezone,
                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
              ),
              utcDateTimeISO: new Date(mouseTimestamp).toISOString(),
              instance: clampedT < 0.5 ? left.instance : right.instance,
              isInterpolated: true,
            };
          }
        }

        // Update hover timestamp
        if (interpolatedPoint) {
          setHoveredTimestamp(interpolatedPoint.timestamp);
        }

        // Tooltip logic
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
        if (!useClickEvents) {
          setHoveredTimestamp(null);
          setTooltipState((prev) => ({ ...prev, visible: false }));
        }
      })
      .on("click", (event) => {
        if (!useClickEvents) return; // Skip click events on desktop

        const [pointerX, pointerY] = d3.pointer(event);

        // Early exit if outside chart bounds
        if (
          pointerX < 0 ||
          pointerX > chartDrawingWidth ||
          pointerY < 0 ||
          pointerY > chartDrawingHeight
        ) {
          closeTooltip();
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
              localDateTimeISO: formatInTimeZone(
                new Date(mouseTimestamp),
                timezone,
                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
              ),
              utcDateTimeISO: new Date(mouseTimestamp).toISOString(),
              instance: clampedT < 0.5 ? left.instance : right.instance,
              isInterpolated: true,
            };
          }
        }

        const newTimestamp =
          clickedTimestamp === interpolatedPoint?.timestamp
            ? null
            : interpolatedPoint?.timestamp;
        setClickedTimestamp(newTimestamp || null);

        if (newTimestamp && interpolatedPoint) {
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
        } else {
          setTooltipState((prev) => ({ ...prev, visible: false }));
        }
      });

    // Update the container width style to match the SVG width
    if (containerRef.current) {
      containerRef.current.style.width = `${totalWidth}px`;
    }

    // --- "Now" Reference Line ---
    if (
      exactTimestamp &&
      exactTimestamp >= timeDomain[0].getTime() &&
      exactTimestamp <= timeDomain[1].getTime()
    ) {
      const dayIndex = Math.floor(
        (exactTimestamp - timeDomain[0].getTime()) / (24 * 60 * 60 * 1000)
      );
      const dayProgress =
        (exactTimestamp - timeDomain[0].getTime()) % (24 * 60 * 60 * 1000);
      const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
      const x = dayIndex * PIXELS_PER_DAY + dayFraction * PIXELS_PER_DAY;

      // Draw the reference line
      chartArea
        .append("line")
        .attr("class", "now-line")
        .attr("x1", x)
        .attr("y1", -margin.top) // Start from top of chart area
        .attr("x2", x)
        .attr("y2", chartDrawingHeight) // End at bottom of chart area
        .attr("stroke", "#484a4f") // Same color as SwellChart
        .attr("stroke-opacity", 0.26)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 4");

      // Draw the label at the bottom
      chartArea
        .append("text")
        .attr("class", "now-label")
        .attr("x", x)
        .attr("y", chartDrawingHeight + 10) // Position below the chart area
        .attr("text-anchor", "middle")
        .attr("fill", "#b7bcc5")
        .attr("font-size", 12)
        .attr("font-weight", 700)
        .html("&#9650;"); // Upward arrow
    }
  }, [
    svgDimensions,
    transformedData,
    dotData,
    labelData,
    timeDomain,
    length,
    isMobile,
    isLandscapeMobile,
    isTablet,
    timezone,
    bisectTime,
    tooltipDateFormat,
    hoveredTimestamp,
    clickedTimestamp,
    activeTimestamp,
    useClickEvents,
    closeTooltip,
    exactTimestamp,
    isFeet,
    unitPreferences,
    generateYTicks,
  ]);

  /**
   * Fourth, Resize Observer
   * @description It takes the container and sets the SVG dimensions
   */
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setSvgDimensions({ width, height });
      }
    });
    observer.observe(container);
    return () => {
      observer.unobserve(container);
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

  // Hide hover/tooltip when mouse leaves the chart area, even if moving to another chart
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        closeTooltip();
      }
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [containerRef, closeTooltip]);

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
        className="tw:h-28 tw:min-h-28 tw:max-h-28"
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
        className="tw:h-28 tw:min-h-28 tw:max-h-28"
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
              pointerEvents: useClickEvents ? "auto" : "none",
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
              timezone={timezone}
              onClose={closeTooltip}
              useClickEvents={useClickEvents}
              unitPreferences={unitPreferences}
            />
          </div>
        )}
      </div>
      {/* Y-axis container */}
      <div className="tw:w-11 tw:md:w-16 tw:h-fit tw:absolute tw:left-0 tw:md:left-1 tw:bottom-0 tw:z-10 tw:pointer-events-none">
        <svg
          ref={yAxisRef}
          width={isMobile || isLandscapeMobile ? 44 : 64}
          height={svgDimensions.height}
          className="tw:w-11 tw:md:w-16"
        />
      </div>
    </>
  );
};
