export interface Point {
  x: number;
  y: number;
  value?: number;
  payload: SwellArrowDotProps["payload"];
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
  console.log({ props });
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

  //   return (
  //     <svg
  //       x={cx - 10}
  //       y={cy - 10}
  //       width={20}
  //       height={20}
  //       fill="red"
  //       viewBox="0 0 1024 1024"
  //     >
  //       <path d="M512 1009.984c-274.912 0-497.76-222.848-497.76-497.76s222.848-497.76 497.76-497.76c274.912 0 497.76 222.848 497.76 497.76s-222.848 497.76-497.76 497.76zM340.768 295.936c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM686.176 296.704c-39.488 0-71.52 32.8-71.52 73.248s32.032 73.248 71.52 73.248c39.488 0 71.52-32.8 71.52-73.248s-32.032-73.248-71.52-73.248zM772.928 555.392c-18.752-8.864-40.928-0.576-49.632 18.528-40.224 88.576-120.256 143.552-208.832 143.552-85.952 0-164.864-52.64-205.952-137.376-9.184-18.912-31.648-26.592-50.08-17.28-18.464 9.408-21.216 21.472-15.936 32.64 52.8 111.424 155.232 186.784 269.76 186.784 117.984 0 217.12-70.944 269.76-186.784 8.672-19.136 9.568-31.2-9.12-40.096z" />
  //     </svg>
  //   );

  return (
    <text
      //   x={cx}
      //   y={cy}
      transform={`rotate(${rotation}, ${cx}, ${cy})`}
      fontSize={clampedSize || 40}
      fill={stroke || "#888"}
      textAnchor="middle"
      //   dominantBaseline="central"
      //   style={{ pointerEvents: "none" }}
      //   opacity={0.85}
    >
      ↑
    </text>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   viewBox="0 0 16 16"
    //   y={cy}
    //   x={cx}
    //   height={clampedSize}
    //   width={clampedSize}
    //   fill={stroke}
    // >
    //   <g opacity="0">
    //     <animate
    //       attributeName="opacity"
    //       from="0"
    //       to="1"
    //       dur="0.2s"
    //       begin="0s"
    //       fill="freeze"
    //     />
    //     <path
    //       d="M14.13 9.11h-12l6-7 6 7z"
    //       transform={`rotate(${rotation}, 0, 0)`}
    //       style={{
    //         transformOrigin: "center",
    //       }}
    //     />
    //     <path
    //       d="M6.12 8h4v6h-4z"
    //       transform={`rotate(${rotation}, 0, 0)`}
    //       style={{
    //         transformOrigin: "center",
    //       }}
    //     />
    //   </g>
    // </svg>
  );
};

export default SwellArrowDot;
