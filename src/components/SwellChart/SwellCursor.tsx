import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface SwellCursorProps extends TooltipProps<ValueType, NameType> {
  points?: { x: number; y: number }[];
}

/**
 * SwellCursor component
 * @description Custom cursor component for the SwellChart that shows a vertical hover rect
 * @param props - The props for the SwellCursor component
 * @returns The SwellCursor component
 */
export const SwellCursor = (props: SwellCursorProps) => {
  const { points } = props;
  const pointsArray = points ?? [];
  const width = 32;
  const halfWidth = width / 2;

  if (!pointsArray.length) return null;

  return (
    <path
      pointerEvents="none"
      fill="oklch(0.129 0.042 264.695)"
      fillOpacity="0.1"
      d={`M ${pointsArray[0]?.x - halfWidth},${
        pointsArray[0]?.y - 5
      } h ${width} v 280 h -${width} Z`}
    />
  );
};
