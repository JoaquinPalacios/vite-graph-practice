import React from "react";

interface EventStatusTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

export const EventStatusTick: React.FC<EventStatusTickProps> = ({
  x = 0,
  y = 0,
  payload,
}) => {
  if (!payload || !payload.value) return null;

  const { value } = payload;

  // Determine background color based on event status
  let backgroundColor: string;
  let textColor = "#000";

  switch (value) {
    case "Should be on":
      backgroundColor = "oklch(72.3% 0.219 149.579)"; // Green (Tailwind green-500)
      textColor = "#fff";
      break;
    case "Could be on":
      backgroundColor = "oklch(85.2% 0.199 91.936)"; // Yellow (Tailwind yellow-400)
      textColor = "#000";
      break;
    case "Won't be on":
      backgroundColor = "oklch(63.7% 0.237 25.331)"; // Red (Tailwind red-500)
      textColor = "#fff";
      break;
    case "No event":
    default:
      backgroundColor = "oklch(87.2% 0.01 258.338)"; // Gray (Tailwind gray-300)
      textColor = "#00000000"; // Transparent text
      break;
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={-256 / 2}
        y={-12}
        width={256}
        height={20}
        fill={backgroundColor}
      />
      <text
        x={0}
        y={0}
        dy={3}
        textAnchor="middle"
        fill={textColor}
        fontSize={11}
        fontWeight={600}
      >
        {value}
      </text>
    </g>
  );
};
