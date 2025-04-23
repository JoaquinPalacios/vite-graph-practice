interface CustomCursorProps {
  points?: { x: number; y: number }[];
  payloadIndex?: number;
  setTooltipHoveredIndex: (index: number | null) => void;
}

const CustomCursor = (props: CustomCursorProps) => {
  const { points, setTooltipHoveredIndex, payloadIndex } = props;
  setTooltipHoveredIndex(payloadIndex ?? 0);
  const pointsArray = points ?? [];
  const width = 37.40625;
  const halfWidth = width / 2;

  return (
    <path
      pointerEvents="none"
      fill="oklch(0.129 0.042 264.695)"
      fillOpacity="0.1"
      d={`M ${pointsArray[0]?.x - halfWidth},${
        pointsArray[0]?.y - 5
      } h ${width} v 192 h -${width} Z`}
    />
  );
};

export default CustomCursor;
