/**
 * WindSpeedTick component
 * This component is used to display the tick of the WindSpeedChart.
 * @param {WindSpeedTickProps} props - The props for the WindSpeedTick component
 * @returns {React.ReactElement} The WindSpeedTick component
 */
export const WindSpeedTick = ({
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
