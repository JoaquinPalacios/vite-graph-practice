export interface Point {
  x: number;
  y: number;
  value?: number;
  payload: ProcessedSwellDataPoint;
}

export interface ProcessedSwellDataPoint {
  timestamp: number;
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
}

const SwellArrowDot = (props: SwellArrowDotProps) => {
  console.log({ props });
  const { cx, cy, payload, stroke } = props;

  if (!cx || !cy || !payload) {
    return <g />;
  }

  const { direction, period, height } = payload;

  if (!direction || !period || !height || height < 0.1) {
    return <g />;
  }

  // --- Calculate arrow properties ---
  const baseSize = 8;
  const size = baseSize + period * 1.25; // Scale size based on period
  const clampedSize = Math.max(5, Math.min(16, size));
  const rotation = direction - 45;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={stroke}
      strokeWidth={0}
      viewBox="0 0 256 256"
      height={clampedSize}
      width={clampedSize}
      y={cy - clampedSize / 2}
      x={cx - clampedSize / 2}
      overflow="visible"
    >
      <path
        transform={`rotate(${rotation}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
        d="M184,216a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,216Zm45.66-101.66-96-96a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,32,128H72v56a8,8,0,0,0,8,8h96a8,8,0,0,0,8-8V128h40a8,8,0,0,0,5.66-13.66Z"
      ></path>
    </svg>
  );
};

export default SwellArrowDot;
