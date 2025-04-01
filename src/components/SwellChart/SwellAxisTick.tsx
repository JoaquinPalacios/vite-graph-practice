import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { getWindColor } from "@/utils/color-utils";

type SwellAxisTickProps = {
  x?: number;
  y?: number;
  payload?: {
    value: string | number;
  };
  windSpeed?: number;
};

const SwellAxisTick = ({
  payload,
  x,
  y,
  windSpeed = 0,
}: SwellAxisTickProps) => {
  const color = getWindColor(windSpeed);

  return (
    <g className="flex flex-col-reverse items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        y={y ?? 0}
        x={(x ?? 0) - 10}
        height={20}
        width={20}
        fill={color || "currentColor"}
      >
        <path
          d="M17.66 11.39h-15l7.5-8.75 7.5 8.75z"
          transform={`rotate(${payload?.value}, 0, 0)`}
          style={{
            transformOrigin: "center",
          }}
        />
        <path
          d="M7.65 10h5v7.5h-5z"
          transform={`rotate(${payload?.value}, 0, 0)`}
          style={{
            transformOrigin: "center",
          }}
        />
      </svg>
      <text
        x={x ?? 0}
        y={(y ?? 0) + 32}
        fill="#666"
        fontSize={10}
        fontWeight={600}
        width={20}
        height={20}
        textAnchor="middle"
      >
        {degreesToCompassDirection(Number(payload?.value))}
      </text>
    </g>
  );
};

export default SwellAxisTick;
