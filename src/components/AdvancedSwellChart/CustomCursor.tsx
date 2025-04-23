type CursorProps = {
  points?: { x: number; y: number }[];
};

const CustomCursor = (props: CursorProps) => {
  const points = props.points ?? [];
  const width = 37.40625;
  const halfWidth = width / 2;

  return (
    <path
      pointerEvents="none"
      fill="oklch(0.129 0.042 264.695)"
      fillOpacity="0.1"
      d={`M ${points[0].x - halfWidth},${
        points[0].y - 5
      } h ${width} v 192 h -${width} Z`}
    />
  );
};

export default CustomCursor;
