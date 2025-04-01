import { LabelProps } from "recharts";

interface CustomLabelProps extends LabelProps {
  hasFaceWaveHeight?: boolean;
  primarySwellDirection?: number | null;
}

const CustomSwellLabel = (props: CustomLabelProps) => {
  const { x, y, value, fill, hasFaceWaveHeight, primarySwellDirection } = props;

  const yPosition = typeof y === "number" && !isNaN(y) ? y - 20 : 0;
  const xPosition = typeof x === "number" && !isNaN(x) ? x : 0;

  if (!hasFaceWaveHeight) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        y={yPosition}
        x={xPosition + 8}
        height={16}
        width={16}
        fill={fill}
      >
        <g opacity="0">
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.2s"
            begin="0s"
            fill="freeze"
          />
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
        </g>
      </svg>
    );
  } else if (primarySwellDirection && hasFaceWaveHeight) {
    return (
      <g>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          y={yPosition - 16}
          x={xPosition + 8}
          height={16}
          width={16}
          fill="#ffa800"
        >
          <g opacity="0">
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.2s"
              begin="0s"
              fill="freeze"
            />
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
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          y={yPosition}
          x={xPosition + 8}
          height={16}
          width={16}
          fill="#008a93"
        >
          <g opacity="0">
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.2s"
              begin="0s"
              fill="freeze"
            />
            <path
              d="M14.13 9.11h-12l6-7 6 7z"
              transform={
                primarySwellDirection
                  ? `rotate(${primarySwellDirection}, 0, 0)`
                  : `rotate(${value}, 0, 0)`
              }
              style={{
                transformOrigin: "center",
              }}
            />
            <path
              d="M6.12 8h4v6h-4z"
              transform={
                primarySwellDirection
                  ? `rotate(${primarySwellDirection}, 0, 0)`
                  : `rotate(${value}, 0, 0)`
              }
              style={{
                transformOrigin: "center",
              }}
            />
          </g>
        </svg>
      </g>
    );
  }
};

export default CustomSwellLabel;
