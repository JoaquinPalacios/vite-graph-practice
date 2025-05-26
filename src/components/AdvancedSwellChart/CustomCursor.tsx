"use client";

import { useState, useEffect } from "react";

interface CustomCursorProps {
  points?: { x: number; y: number }[];
  payloadIndex?: number;
  setTooltipHoveredIndex: (index: number | null) => void;
}

/**
 * CustomCursor component
 * @description This component is used to display the custom cursor for the AdvancedSwellChart component.
 * @param props - The props of the component
 * @returns The CustomCursor component
 */
export const CustomCursor = (props: CustomCursorProps) => {
  const { points, setTooltipHoveredIndex, payloadIndex } = props;
  const [width, setWidth] = useState(32);
  const halfWidth = width / 2;

  useEffect(() => {
    setTooltipHoveredIndex(payloadIndex ?? 0);

    // Get the tooltip cursor element fromm the bar chart
    const tooltipCursor = document.querySelector(
      ".swellnet-bar-chart .recharts-tooltip-cursor"
    );
    if (tooltipCursor) {
      const rect = tooltipCursor.getBoundingClientRect();
      setWidth(rect.width);
    }
  }, [payloadIndex, setTooltipHoveredIndex]);

  const pointsArray = points ?? [];

  return (
    <path
      pointerEvents="none"
      fill="oklch(0.129 0.042 264.695)"
      fillOpacity="0.1"
      d={`M ${pointsArray[0]?.x - halfWidth},${
        pointsArray[0]?.y - 5
      } h ${width} v 192 h -${width} Z`}
    />
  );
};
