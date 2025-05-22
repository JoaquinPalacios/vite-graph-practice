import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { formatTooltipDate } from "@/lib/format-tooltip-date";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { UnitPreferences } from "@/types";
import { memo } from "react";
import { SwellTrainRow } from "./SwellTrainRow";
import { getWindColor } from "@/utils/chart-utils";
import { getAdjustedDirection } from "@/lib/format-direction";

interface TrainData {
  direction: number;
  sigHeight: number;
  peakPeriod: number;
}

/**
 * SwellTooltip component
 * This component is used to display the tooltip of the SwellChart.
 * @param {TooltipProps<ValueType, NameType> & { unitPreferences: UnitPreferences }} props - The props for the SwellTooltip component
 * @returns {React.ReactElement} The SwellTooltip component
 */
export const SwellTooltip = memo(
  ({
    active,
    payload,
    label,
    unitPreferences,
  }: TooltipProps<ValueType, NameType> & {
    unitPreferences: UnitPreferences;
  }) => {
    if (active && payload && payload.length) {
      const color = getWindColor(payload[0].payload.wind.speedKnots);

      return (
        <div className="tooltip-container tw:bg-white/96 tw:relative tw:shadow-md">
          <div className="tw:absolute tw:top-[0.4375rem] tw:-left-3 tw:z-0 tw:w-6 tw:h-5 tw:rotate-45 tw:bg-white/96" />
          <h5 className="margin-none tw:px-2.5 tw:py-1.5 tw:border-b tw:border-slate-400/20 tw:relative z-10">
            {formatTooltipDate(label)}
          </h5>

          {/* Surf Height and Wind */}
          <div className="tw:flex tw:flex-col tw:px-2 tw:pt-2 tw:border-b tw:border-slate-400/20">
            <div className="tw:flex tw:flex-col">
              <div className="tw:flex tw:gap-1 surf-height-label">
                <p className="margin-none tw:leading-[1.2]">
                  {unitPreferences.units.surfHeight === "ft"
                    ? payload[0].payload.primary.fullSurfHeightFeetLabelBin
                    : payload[0].payload.primary.fullSurfHeightMetresLabelBin}
                </p>
                <p className="margin-none tw:leading-[1.2]">
                  {payload[0] &&
                    degreesToCompassDirection(
                      getAdjustedDirection(payload[0].payload.primary.direction)
                    )}
                </p>
              </div>
              <p className="margin-bottom-2 tooltip-paragraph-small">
                ({payload[0].payload.primary.fullSurfHeightFeetLabelDescriptive}
                )
              </p>
            </div>
            {payload && payload[1] && (
              <div className="tw:flex tw:flex-col">
                <div className="tw:flex tw:gap-1 surf-height-label">
                  <p className="margin-none tw:leading-[1.2]">
                    {unitPreferences.units.surfHeight === "ft"
                      ? payload[0].payload.secondary.fullSurfHeightFeetLabelBin
                      : payload[0].payload.secondary
                          .fullSurfHeightMetresLabelBin}
                  </p>
                  <p className="margin-none tw:leading-[1.2]">
                    {payload[0] &&
                      degreesToCompassDirection(
                        getAdjustedDirection(
                          payload[0].payload.secondary.direction
                        )
                      )}
                  </p>
                </div>
                <p className="margin-none semibold tooltip-paragraph tw:leading-[1.2]">
                  South Facing
                </p>
                <p className="margin-bottom-2 tooltip-paragraph-small">
                  (
                  {
                    payload[0].payload.secondary
                      .fullSurfHeightFeetLabelDescriptive
                  }
                  )
                </p>
              </div>
            )}
            {payload[0] && (
              <div className="margin-bottom-2 tw:flex tw:gap-1 tw:items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  height={18}
                  width={18}
                  fill={color || "currentColor"}
                  className="tw:transition-colors tw:duration-200 tw:ease"
                >
                  <path
                    d="M17.66 11.39h-15l7.5-8.75 7.5 8.75z"
                    transform={`rotate(${getAdjustedDirection(
                      payload[0].payload.wind.direction
                    )}, 0, 0)`}
                    style={{
                      transformOrigin: "center",
                    }}
                    className="tw:transition-transform tw:duration-150 tw:ease"
                  />
                  <path
                    d="M7.65 10h5v7.5h-5z"
                    transform={`rotate(${getAdjustedDirection(
                      payload[0].payload.wind.direction
                    )}, 0, 0)`}
                    style={{
                      transformOrigin: "center",
                    }}
                  />
                </svg>
                <p className="margin-none tooltip-paragraph">
                  {unitPreferences.units.wind === "knots"
                    ? Math.round(payload[0].payload.wind.speedKnots)
                    : Math.round(payload[0].payload.wind.speedKmh)}
                  {unitPreferences.units.wind === "knots" ? "kts" : "km/h"}
                </p>
                <p className="margin-none tooltip-paragraph">
                  {degreesToCompassDirection(payload[0].payload.wind.direction)}
                </p>
              </div>
            )}
          </div>

          {/* Swell Trains */}
          {!unitPreferences.showAdvancedChart && (
            <div className="tw:flex tw:flex-col tw:p-2">
              {payload[0]?.payload.trainData.map(
                (train: TrainData, index: number) => (
                  <SwellTrainRow
                    key={`train-${index}`}
                    direction={train.direction}
                    sigHeight={train.sigHeight}
                    peakPeriod={train.peakPeriod}
                  />
                )
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  }
);
