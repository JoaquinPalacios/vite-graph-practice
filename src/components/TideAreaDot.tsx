type TideAreaDotProps = {
  cx?: number;
  cy?: number;
  payload?: {
    time: string;
    height: number;
  };
};

export const TideAreaDot = ({ cx, cy, payload }: TideAreaDotProps) => {
  if (!cx || !cy || !payload) return null;
  return (
    <g width={20} height={20} transform={`translate(${cx}, ${cy})`}>
      <text
        fill="#666"
        fontSize={10}
        fontWeight={600}
        textAnchor="middle"
        dy={-20}
        opacity="0"
      >
        <animate
          attributeName="opacity"
          from="0"
          to="1"
          dur="0.3s"
          begin="0.1s"
          fill="freeze"
        />
        <animate
          attributeName="dy"
          from="-10"
          to="-20"
          dur="0.3s"
          begin="0.1s"
          fill="freeze"
        />
        {payload.time}
      </text>
      <text
        fill="#666"
        fontSize={10}
        fontWeight={400}
        textAnchor="middle"
        dy={-8}
        opacity="0"
      >
        <animate
          attributeName="opacity"
          from="0"
          to="1"
          dur="0.3s"
          begin="0.1s"
          fill="freeze"
        />
        <animate
          attributeName="dy"
          from="2"
          to="-8"
          dur="0.3s"
          begin="0.1s"
          fill="freeze"
        />
        {payload.height}m
      </text>
    </g>
  );
};
