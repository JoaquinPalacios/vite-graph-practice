type CustomTideAreaDotProps = {
  cx?: number;
  cy?: number;
  payload?: {
    time: string;
    height: number;
  };
  key: string;
};

export const CustomTideAreaDot = ({
  cx,
  cy,
  payload,
}: CustomTideAreaDotProps) => {
  if (!cx || !cy || !payload) return null;
  return (
    <g width={20} height={20} transform={`translate(${cx}, ${cy})`}>
      <text
        fill="#666"
        fontSize={10}
        fontWeight={600}
        textAnchor="middle"
        dy={-20}
      >
        {payload.time}
      </text>
      <text
        fill="#666"
        fontSize={10}
        fontWeight={400}
        textAnchor="middle"
        dy={-8}
      >
        {payload.height}
      </text>
    </g>
  );
};
