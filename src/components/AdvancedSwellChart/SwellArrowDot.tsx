interface Point {
  x: number;
  y: number;
  value?: number;
  payload: SwellArrowDotProps["payload"];
}

interface SwellArrowDotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
  dataKey?: string;
  className?: string;
  fill?: string;
  height?: number;
  index?: number;
  points?: Point[];
  r?: number;
  strokeWidth?: number;
  width?: number;
  value?: number;
  payload?: {
    date: string;
    time: string;
    dateTime: string;
    timestamp: number;
    swellDirection: number;
    windDirection: number;
    windSpeed_kmh: number;
    windSpeed_knots: number;
    waveHeight_m: number;
    waveHeight_ft: number;
    isRising: boolean;
    nextHighTide?: string;
    nextHighTideHeight?: number;
    nextLowTide?: string;
    nextLowTideHeight?: number;
    primarySwellDirection?: number;
    primarySwellHeight?: number;
    primarySwellPeriod?: number;
    secondarySwellDirection?: number;
    secondarySwellHeight?: number;
    secondarySwellPeriod?: number;
    tertiarySwellDirection?: number;
    tertiarySwellHeight?: number;
    tertiarySwellPeriod?: number;
    fourthSwellDirection?: number;
    fourthSwellHeight?: number;
    fourthSwellPeriod?: number;
    fifthSwellDirection?: number;
    fifthSwellHeight?: number;
    fifthSwellPeriod?: number;
  };
}

const SwellArrowDot = (props: SwellArrowDotProps) => {
  const { cx, cy, payload, stroke, dataKey } = props;

  if (!cx || !cy || !dataKey || !payload) {
    return null;
  }

  // Extract the rank prefix (primary, secondary, etc.)
  const rankPrefix = dataKey.replace("SwellHeight", "");
  const direction = payload[
    `${rankPrefix}SwellDirection` as keyof typeof payload
  ] as number | undefined;
  const period = payload[`${rankPrefix}SwellPeriod` as keyof typeof payload] as
    | number
    | undefined;
  const height = payload[`${rankPrefix}SwellHeight` as keyof typeof payload] as
    | number
    | undefined;

  if (!direction || !period || !height || height < 0.1) {
    return null;
  }

  // --- Calculate arrow properties ---
  const baseSize = 8;
  const size = baseSize + period * 0.5;
  const clampedSize = Math.max(5, Math.min(16, size));
  const rotation = direction;

  return (
    <text
      x={cx}
      y={cy}
      transform={`rotate(${rotation}, ${cx}, ${cy})`}
      fontSize={clampedSize}
      fill={stroke || "#888"}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ pointerEvents: "none" }}
      opacity={0.85}
    >
      ↑
    </text>
  );
};

export default SwellArrowDot;
