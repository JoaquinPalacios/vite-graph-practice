interface CustomAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string | number;
  };
}

const RenderCustomAxisTick = ({ x, y, payload }: CustomAxisTickProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      y={y ?? 0}
      x={(x ?? 0) - 10}
      height={20}
      width={20}
      // fill={fill}
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
  );
};

export default RenderCustomAxisTick;
