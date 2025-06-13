"use client";

import {
  useMemo,
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import * as d3 from "d3";
import {
  ChartDataItem,
  SwellPoint,
  TooltipState,
  UnitPreferences,
} from "@/types";
import { useScreenDetector } from "@/hooks/useScreenDetector";
import {
  activeColorPalette,
  calculateTooltipPosition,
  colorPalette,
} from "@/utils/chart-utils";
import processSwellData from "./ProcessDataSwell";
import { SwellTooltip } from "./SwellTooltip";

/**
 * Advanced Swell Chart using D3.js
 * @description A line chart that shows different incoming swells and their relative heights
 * @param unitPreferences - The unit preferences for the chart
 * @param chartData - The chart data
 * @param maxSurfHeight - The maximum surf height
 * @returns The Advanced D3 Swell Chart component
 */
export const AdvanceD3Chart = ({
  unitPreferences,
  chartData,
  maxSurfHeight,
}: {
  unitPreferences: UnitPreferences;
  chartData: ChartDataItem[];
  maxSurfHeight: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const yAxisRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipDivRef = useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
    side: "right",
  });
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);
  const { isMobile, isLandscapeMobile, isTablet } = useScreenDetector();

  // Process swell data using the existing processor
  const processedSwellData = useMemo(
    () => processSwellData(chartData),
    [chartData]
  );

  // Memoize eventIds
  const eventIds = useMemo(
    () => Object.keys(processedSwellData),
    [processedSwellData]
  );

  // Memoize yTicks
  const yTicks = useMemo(() => {
    if (maxSurfHeight < 3) {
      return [0.5, 1, 1.5, 2, 2.5];
    } else {
      return Array.from({ length: Math.ceil(maxSurfHeight) }, (_, i) => i + 1);
    }
  }, [maxSurfHeight]);

  // Transform data for D3
  const transformedData = useMemo(() => {
    const allPoints: SwellPoint[] = [];
    Object.entries(processedSwellData).forEach(([eventId, points]) => {
      points.forEach((point) => {
        allPoints.push({
          ...point,
          timestamp: new Date(point.localDateTimeISO).getTime(),
          eventId,
        });
      });
    });
    return allPoints;
  }, [processedSwellData]);

  // Calculate time domain
  const timeDomain = useMemo((): [Date, Date] => {
    if (!transformedData.length) {
      const now = new Date();
      return [now, new Date(now.getTime() + 24 * 60 * 60 * 1000)];
    }

    const timestamps = transformedData.map((d) => d.timestamp);
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    // Add buffer to ensure all points are visible
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
    return [
      new Date(minTime - THREE_HOURS_MS),
      new Date(maxTime + THREE_HOURS_MS),
    ];
  }, [transformedData]);

  /**
   * Calculates the start of each day within the time domain for background stripes.
   * @param timeDomain - The [start, end] date range of the chart
   * @returns Array of Date objects representing day starts
   */
  const dayStarts = useMemo(() => {
    const starts: Date[] = [];
    const currentIterDay = new Date(timeDomain[0].getTime());
    const numDays = Math.ceil(
      (timeDomain[1].getTime() - timeDomain[0].getTime()) /
        (24 * 60 * 60 * 1000)
    );
    for (let i = 0; i < numDays; i++) {
      starts.push(new Date(currentIterDay.getTime()));
      currentIterDay.setDate(currentIterDay.getDate() + 1);
    }
    return starts;
  }, [timeDomain]);

  /**
   * Returns the X position in pixels for a given timestamp, matching background stripes.
   * @param timestamp - The timestamp to convert
   * @returns X position in pixels
   */
  const getX = useCallback(
    (timestamp: number) => {
      const dayIndex = Math.floor(
        (timestamp - timeDomain[0].getTime()) / (24 * 60 * 60 * 1000)
      );
      const dayProgress =
        (timestamp - timeDomain[0].getTime()) % (24 * 60 * 60 * 1000);
      const dayFraction = dayProgress / (24 * 60 * 60 * 1000);
      return dayIndex * 256 + dayFraction * 256;
    },
    [timeDomain]
  );

  // Move margin definition to the top of the component
  const margin = useMemo(
    () => ({ top: 32, right: 0, bottom: 8, left: 42 }),
    []
  );

  // 1. Create the Y scale (before the D3 rendering effect)
  const chartDrawingHeight = 192;
  const yScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, Math.ceil(maxSurfHeight)])
        .range([chartDrawingHeight - 48, 0])
        .nice(),
    [maxSurfHeight, chartDrawingHeight]
  );

  // Calculate chart width to match Recharts getChartWidth logic
  const dataLength = chartData.length; // Use the same data length as Recharts
  const widthPerDay = 256;
  const extraSpace = 18; // With this extra space last background strip won't have 256, but it adds little extra to match the exact width of the other charts.
  const days = Math.ceil(dataLength / 8);
  const chartDrawingWidth = days * widthPerDay + extraSpace;

  // Main D3 rendering effect
  useEffect(() => {
    if (
      !svgRef.current ||
      !yAxisRef.current ||
      svgDimensions.width === 0 ||
      svgDimensions.height === 0 ||
      transformedData.length === 0
    ) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const yAxisSvg = d3.select(yAxisRef.current);
    svg.selectAll("*").remove();
    yAxisSvg.selectAll("*").remove();

    // Create chart area
    const chartArea = svg
      .append("g")
      .attr("height", chartDrawingHeight)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background stripes
    chartArea
      .append("g")
      .attr("class", "day-stripes")
      .selectAll("rect")
      .data(dayStarts)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * 256)
      .attr("y", -32)
      .attr("width", 256)
      .attr("height", chartDrawingHeight)
      .attr("transform", "translate(34,0)")
      .attr(
        "fill",
        (_, i) =>
          i % 2 === 0
            ? "oklch(0.929 0.013 255.508)" // Tailwind Slate 200
            : "oklch(0.968 0.007 247.896)" // Tailwind Slate 300
      )
      .lower();

    // --- HOVER RECT (vertical cursor) ---
    chartArea.selectAll(".hover-rect").remove();
    if (hoveredTimestamp !== null) {
      chartArea
        .insert("rect", ".day-stripes ~ *")
        .attr("class", "hover-rect")
        .attr("x", getX(hoveredTimestamp) - 16)
        .attr("y", -32)
        .attr("width", 32)
        .attr("height", chartDrawingHeight)
        .attr("fill", "oklch(0.129 0.042 264.695)")
        .attr("fill-opacity", 0.1)
        .attr("pointer-events", "none");
    }

    // --- Y Grid Lines (rendered after stripes, before data) ---
    const gridAxis = d3
      .axisLeft(yScale)
      .tickValues(yTicks)
      .tickSize(-chartDrawingWidth)
      .tickFormat(() => ""); // Only lines, no labels

    chartArea
      .append("g")
      .attr("class", "y-grid")
      .attr("height", chartDrawingHeight)
      .call(gridAxis);

    // Remove grid lines for 0
    chartArea
      .select(".y-grid")
      .selectAll(".tick")
      .each(function (d) {
        if (Number(d) === 0) {
          d3.select(this).select("line").remove();
        }
      });

    // --- Y Axis ---
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(yTicks)
      .tickPadding(8)
      .tickFormat((d) => `${d}m`)
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

    // Add lines for each event
    eventIds.forEach((eventId, index) => {
      const eventData = transformedData.filter((d) => d.eventId === eventId);
      const color = colorPalette[index % colorPalette.length];
      const activeColor = activeColorPalette[index % activeColorPalette.length];
      const isHovered =
        !isMobile &&
        !isTablet &&
        !isLandscapeMobile &&
        hoveredEventId === eventId;

      const line = d3
        .line<SwellPoint>()
        .x((d) => getX(d.timestamp))
        .y((d) => yScale(d.height))
        .curve(d3.curveMonotoneX);

      // Add the line
      chartArea
        .append("path")
        .datum(eventData)
        .attr("class", "swell-line")
        .attr("d", line)
        .attr("stroke", isHovered ? activeColor : color)
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("opacity", isHovered ? 1 : 0.25)
        .style("transition", "all 300ms, opacity 250ms ease-in-out")
        .on("mouseenter", () => setHoveredEventId(eventId))
        .on("mouseleave", () => setHoveredEventId(null));

      // Add arrows instead of dots
      const arrowGroup = chartArea
        .append("g")
        .attr("class", "swell-arrows")
        .selectAll("g")
        .data(eventData)
        .enter()
        .append("g")
        .attr("transform", (d) => {
          const x = getX(d.timestamp);
          const y = yScale(d.height);
          return `translate(${x},${y})`;
        })
        .attr("opacity", isHovered ? 1 : 0.4)
        .style("transition", "all 300ms, opacity 250ms ease-in-out")
        .on("mouseenter", function (_, d) {
          setHoveredEventId(eventId);
          // Show tooltip for this point
          const tooltipDiv = tooltipDivRef.current;
          const tooltipRect = tooltipDiv?.getBoundingClientRect();
          const tooltipWidth = tooltipRect?.width ?? 0;
          const tooltipHeight = tooltipRect?.height ?? 0;
          const x = getX(d.timestamp);
          const y = yScale(d.height);
          const tooltipPos = calculateTooltipPosition(
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
            x: tooltipPos.x,
            y: tooltipPos.y,
            data: d,
            side: tooltipPos.side,
          });
        })
        .on("mouseleave", function () {
          setHoveredEventId(null);
          setTooltipState((prev) => ({ ...prev, visible: false }));
        });

      // Arrow center is at (10, 10) for both paths
      // Clamp scale between 0.6 and 0.8 for visual consistency
      const getArrowTransform = (d: SwellPoint) => {
        const scale = Math.max(0.6, Math.min(0.8, d.period / 12));
        const rotation = d.direction;
        return `scale(${scale}) rotate(${rotation}) translate(-10,-10)`;
      };

      // Add arrow head (triangle)
      arrowGroup
        .append("path")
        .attr("d", "M17.66 11.39h-15l7.5-8.75 7.5 8.75z")
        .attr("fill", isHovered ? activeColor : color)
        .attr("transform", getArrowTransform);

      // Add arrow body (rectangle)
      arrowGroup
        .append("path")
        .attr("d", "M7.65 10h5v7.5h-5z")
        .attr("fill", isHovered ? activeColor : color)
        .attr("transform", getArrowTransform);
    });

    // --- OVERLAY for mouse tracking ---
    // Get unique timestamps
    const uniqueTimestamps = Array.from(
      new Set(transformedData.map((d) => d.timestamp))
    ).sort((a, b) => a - b);
    svg.selectAll(".hover-overlay").remove();
    chartArea
      .insert("rect", ".day-stripes ~ *")
      .attr("class", "hover-overlay")
      .attr("x", 0)
      .attr("y", -32)
      .attr("width", chartDrawingWidth)
      .attr("height", chartDrawingHeight)
      .attr("fill", "transparent") // DEBUG: visible overlay
      .attr("pointer-events", "all")
      .on("mousemove", (event) => {
        const [pointerX] = d3.pointer(event);
        if (pointerX < 0 || pointerX > chartDrawingWidth) {
          setHoveredTimestamp(null);
          setTooltipState((prev) => ({ ...prev, visible: false }));
          return;
        }
        // Find the closest timestamp
        const mouseX = pointerX;
        const timestamp = uniqueTimestamps.reduce((prev, curr) => {
          const prevX = getX(prev);
          const currX = getX(curr);
          return Math.abs(currX - mouseX) < Math.abs(prevX - mouseX)
            ? curr
            : prev;
        });
        setHoveredTimestamp(timestamp);
        // Tooltip: get all events for this timestamp
        const events = transformedData.filter((d) => d.timestamp === timestamp);
        // Calculate tooltip position
        const tooltipDiv = tooltipDivRef.current;
        const tooltipRect = tooltipDiv?.getBoundingClientRect();
        const tooltipWidth = tooltipRect?.width ?? 200;
        const tooltipHeight = tooltipRect?.height ?? 60;
        const tooltipPos = calculateTooltipPosition(
          getX(timestamp),
          0,
          tooltipWidth,
          tooltipHeight,
          chartDrawingWidth,
          chartDrawingHeight,
          margin
        );
        setTooltipState({
          visible: true,
          x: tooltipPos.x,
          y: tooltipPos.y,
          data: events,
          side: tooltipPos.side,
        });
      })
      .on("mouseleave", () => {
        setHoveredTimestamp(null);
        setTooltipState((prev) => ({ ...prev, visible: false }));
      });

    // Update container width
    if (containerRef.current) {
      containerRef.current.style.width = `${
        chartDrawingWidth + margin.left + margin.right
      }px`;
    }
  }, [
    svgDimensions,
    transformedData,
    hoveredEventId,
    hoveredTimestamp,
    isMobile,
    isLandscapeMobile,
    isTablet,
    eventIds,
    yTicks,
    margin,
    dayStarts,
    yScale,
    chartDrawingWidth,
    getX,
  ]);

  // Resize observer
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setSvgDimensions({ width, height });
      }
    });
    observer.observe(node);
    return () => {
      observer.unobserve(node);
    };
  }, []);

  // Tooltip boundary detection
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

    if (left + tooltipRect.width > containerRect.width) {
      left = containerRect.width - tooltipRect.width - margin.left;
    }
    if (left < 0) {
      left = margin.left;
    }
    if (top + tooltipRect.height > containerRect.height) {
      top = containerRect.height - tooltipRect.height - margin.top;
    }
    if (top < 0) {
      top = margin.top;
    }

    if (left !== tooltipState.x || top !== tooltipState.y) {
      setTooltipState((prev) => ({ ...prev, x: left, y: top }));
    }
  }, [tooltipState, svgDimensions, margin]);

  // Hide hover/tooltip when mouse leaves the chart area, even if moving to another chart
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setHoveredTimestamp(null);
        setTooltipState((prev) => ({ ...prev, visible: false }));
      }
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [containerRef]);

  // Add a type guard for SwellPoint[]
  function isSwellPointArray(
    data: SwellPoint | SwellPoint[] | null
  ): data is SwellPoint[] {
    return (
      Array.isArray(data) &&
      data.length > 0 &&
      typeof data[0] === "object" &&
      "timestamp" in data[0]
    );
  }

  if (!transformedData.length) {
    return (
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", position: "relative" }}
        className="tw:h-48 tw:min-h-48"
      >
        <div>Loading swell data or no data available...</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: unitPreferences.showAdvancedChart ? 192 : 0,
          minHeight: unitPreferences.showAdvancedChart ? 192 : 0,
          overflow: "hidden",
        }}
        className="tw:transition-[height,min-height] tw:duration-300 tw:ease-out"
        aria-hidden={!unitPreferences.showAdvancedChart}
      >
        <svg
          ref={svgRef}
          width={svgDimensions.width}
          height={chartDrawingHeight}
          className="swellnet-line-chart tw:[&>svg]:focus:outline-none"
          role="img"
          aria-label="Swell height and direction analysis over time"
        >
          {/* D3 renders here */}
        </svg>

        {/* Tooltip */}
        {tooltipState.visible && isSwellPointArray(tooltipState.data) && (
          <SwellTooltip
            visible={tooltipState.visible}
            x={tooltipState.x}
            y={tooltipState.y}
            data={tooltipState.data}
            side={tooltipState.side}
            eventIds={eventIds}
          />
        )}
      </div>

      {/* Y-axis container */}
      <div
        className="tw:w-12 tw:md:w-16 tw:h-fit tw:absolute tw:left-0 tw:md:left-3 tw:top-80 tw:z-10 tw:pointer-events-none"
        aria-hidden={!unitPreferences.showAdvancedChart}
      >
        <svg
          ref={yAxisRef}
          width={isMobile || isLandscapeMobile ? 48 : 64}
          height={svgDimensions.height}
          className="tw:w-12 tw:md:w-16"
          role="img"
          aria-label="Y-axis for Swell height and direction analysis over time"
        />
      </div>
    </>
  );
};
