import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { getAdjustedDirection } from "@/lib/format-direction";
import { memo } from "react";
import { SwellLabel } from "./SwellLabel";

interface SwellTrainRowProps {
  direction: number;
  sigHeight: number;
  peakPeriod: number;
  fill?: string;
}

/**
 * SwellTrainRow component
 * Displays a single row of swell train data in the tooltip
 */
export const SwellTrainRow = memo(
  ({
    direction,
    sigHeight,
    peakPeriod,
    fill = "#3a3a3a",
  }: SwellTrainRowProps) => {
    const adjustedDirection = getAdjustedDirection(direction);

    return (
      <div className="tw:flex tw:items-center tw:gap-1">
        <p className="margin-none semibold tooltip-paragraph-small tw:h-[1.125rem]">
          <SwellLabel value={direction} fill={fill} />
        </p>
        <p className="margin-none semibold tooltip-paragraph-small">
          {Number(sigHeight).toFixed(1)}m @
        </p>
        <p className="margin-none semibold tooltip-paragraph-small">
          {Number(peakPeriod).toFixed(1)}s
        </p>
        <p className="margin-none semibold tooltip-paragraph-small">
          {degreesToCompassDirection(adjustedDirection)}
        </p>
        <p className="margin-none semibold tooltip-paragraph-small">
          ({adjustedDirection}°)
        </p>
      </div>
    );
  }
);
