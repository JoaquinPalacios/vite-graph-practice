type CursorProps = {
  x?: number;
  y?: number;
  height?: number;
};

const HIGHLIGHT_WIDTH = 32;

export const WeatherChartCursor = (props: CursorProps) => {
  if (
    typeof props.x !== "number" ||
    typeof props.y !== "number" ||
    typeof props.height !== "number"
  ) {
    return null;
  }
  // Center the highlight on the x position
  const x = props.x - HIGHLIGHT_WIDTH / 2;
  const y = props.y;
  const width = HIGHLIGHT_WIDTH;

  const d = `M ${x},${y} h ${width} v 128 h -${width} Z`;

  return (
    <path
      x={x}
      y={y}
      width={width}
      height={128}
      radius={0}
      stroke="none"
      pointerEvents="none"
      fill="oklch(0.129 0.042 264.695)"
      fillOpacity={0.1}
      className="recharts-rectangle recharts-tooltip-cursor"
      transform="translate(0, -48)"
      d={d}
    />
  );
};
