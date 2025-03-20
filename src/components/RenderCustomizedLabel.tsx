import { LabelProps } from "recharts";

interface CustomLabelProps extends LabelProps {
  faceWaveHeight?: number;
  secondarySwellDirection?: number;
}

const RenderCustomizedLabel = (props: CustomLabelProps) => {
  const { x, y, value, fill, faceWaveHeight, secondarySwellDirection } = props;

  // Ensure y is a valid number before subtracting
  const yPosition = typeof y === "number" && !isNaN(y) ? y - 20 : 0;
  const xPosition = typeof x === "number" && !isNaN(x) ? x : 0;

  if (secondarySwellDirection) {
    return (
      <g>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          y={yPosition - 20}
          x={xPosition}
          height={16}
          width={16}
          fill="#ffa800"
        >
          <path
            d="M14.13 9.11h-12l6-7 6 7z"
            transform={`rotate(${secondarySwellDirection}, 0, 0)`}
            style={{
              transformOrigin: "center",
            }}
          />
          <path
            d="M6.12 8h4v6h-4z"
            transform={`rotate(${secondarySwellDirection}, 0, 0)`}
            style={{
              transformOrigin: "center",
            }}
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          y={yPosition}
          x={xPosition}
          height={16}
          width={16}
          fill={fill}
        >
          <path
            d="M14.13 9.11h-12l6-7 6 7z"
            transform={`rotate(${value}, 0, 0)`}
            style={{
              transformOrigin: "center",
            }}
          />
          <path
            d="M6.12 8h4v6h-4z"
            transform={`rotate(${value}, 0, 0)`}
            style={{
              transformOrigin: "center",
            }}
          />
        </svg>
      </g>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      y={yPosition}
      x={xPosition}
      height={16}
      width={16}
      fill={fill}
    >
      <path
        d="M14.13 9.11h-12l6-7 6 7z"
        transform={`rotate(${value}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
      />
      <path
        d="M6.12 8h4v6h-4z"
        transform={`rotate(${value}, 0, 0)`}
        style={{
          transformOrigin: "center",
        }}
      />
    </svg>
  );
};

export default RenderCustomizedLabel;
