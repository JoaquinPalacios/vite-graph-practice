const WindSpeedTick = ({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: number };
}) => {
  return (
    <text x={x} y={y} dy={1} textAnchor="middle" fontSize={11} fill="#666">
      {payload?.value}
    </text>
  );
};

export default WindSpeedTick;
