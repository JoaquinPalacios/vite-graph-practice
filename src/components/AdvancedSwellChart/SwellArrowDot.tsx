export interface Point {
  x: number;
  y: number;
  value?: number;
  payload: ProcessedSwellDataPoint;
}

export interface ProcessedSwellDataPoint {
  direction: number;
  height: number;
  period: number;
}

export interface SwellArrowDotProps {
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
  payload?: ProcessedSwellDataPoint;
  isHover?: boolean;
}

const SwellArrowDot = (props: SwellArrowDotProps) => {
  const { cx, cy, payload, stroke, isHover } = props;

  if (!cx || !cy || !payload) {
    return <g />;
  }

  const { direction, period, height } = payload;

  if (!direction || !period || !height || height < 0.05) {
    return <g />;
  }

  /**
   * Calculate the size of the arrow dot based on the period
   * The size is clamped between 5 and 18
   */
  const baseSize = 8;
  const size = baseSize + period * 1; // Scale size based on period
  const clampedSize = Math.max(5, Math.min(18, size));

  const activeDot = isHover ? 1 : 0.4;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={stroke}
      strokeWidth={0}
      viewBox="0 0 20 20"
      height={clampedSize}
      width={clampedSize}
      y={cy - clampedSize / 2}
      x={cx - clampedSize / 2}
      overflow="visible"
      stroke="#f9f9f9"
      opacity={activeDot}
    >
      <path
        transform={`rotate(${direction}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
        d="M17.66 11.39h-15l7.5-8.75 7.5 8.75z"
      ></path>
      <path
        transform={`rotate(${direction}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
        d="M7.65 10h5v7.5h-5z"
      ></path>
    </svg>
  );
};

export default SwellArrowDot;
