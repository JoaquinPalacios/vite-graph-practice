import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { GiBigWave, GiHighTide, GiLowTide } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
// import RenderCustomizedLabel from "./SwellLabel";
import { PiWavesFill } from "react-icons/pi";
import { UnitPreferences } from "@/types";
import { memo } from "react";
import { SwellLabel } from "./SwellLabel";

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
      return (
        <div className="tw:bg-slate-400 tw:rounded-md tw:overflow-hidden">
          <h5 className="text-color-white margin-none tw:p-2 tw:text-center tw:font-medium tw:text-xs">
            {new Date(label)
              .toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              })
              .toLowerCase()
              .replace(" ", "")}
            &nbsp;-&nbsp;
            {new Date(label).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </h5>
          <div className="tw:flex tw:flex-col tw:bg-white tw:p-2">
            <div className="tw:flex tw:gap-1">
              <GiBigWave className="tw:w-3.5 tw:h-3.5" color="#008a93" />
              <p className="tw:ml-px tw:text-xs">
                {unitPreferences.units.surfHeight === "ft"
                  ? payload[0].payload.primary.fullSurfHeightFeetLabelBin
                  : payload[0].payload.primary.fullSurfHeightMetresLabelBin}
              </p>
              <p className="tw:text-xs">
                {payload[0] &&
                  degreesToCompassDirection(
                    payload[0].payload.primary.direction > 180
                      ? payload[0].payload.primary.direction - 180
                      : payload[0].payload.primary.direction + 180
                  )}
              </p>
              <p className="tw:text-xs">
                ({payload[0].payload.primary.fullSurfHeightFeetLabelDescriptive}
                )
              </p>
            </div>
            {payload && payload[1] && (
              <div className="tw:flex tw:gap-1">
                <GiBigWave className="tw:w-3.5 tw:h-3.5" color={"#ffa800"} />
                <p className="tw:ml-px tw:text-xs">
                  {unitPreferences.units.surfHeight === "ft"
                    ? payload[0].payload.secondary.fullSurfHeightFeetLabelBin
                    : payload[0].payload.secondary.fullSurfHeightMetresLabelBin}
                </p>
                <p className="tw:text-xs">
                  {payload[0] &&
                    degreesToCompassDirection(
                      payload[0].payload.secondary.direction > 180
                        ? payload[0].payload.secondary.direction - 180
                        : payload[0].payload.secondary.direction + 180
                    )}
                </p>
                <p className="tw:text-xs">
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
              <div className="tw:flex tw:gap-1">
                <LuWind className="tw:w-3.5 tw:h-3.5" color="#008a93" />
                <p className="tw:ml-px tw:text-xs">
                  {unitPreferences.units.wind === "knots"
                    ? Math.round(payload[0].payload.wind.speedKnots)
                    : Math.round(payload[0].payload.wind.speedKmh)}
                  {unitPreferences.units.wind === "knots" ? "kts" : "km/h"}
                </p>
                <p className="tw:text-xs">
                  {degreesToCompassDirection(payload[0].payload.wind.direction)}
                </p>
              </div>
            )}
            {payload[0] && !unitPreferences.showAdvancedChart && (
              <div className="tw:flex tw:gap-1">
                <PiWavesFill className="tw:w-3.5 tw:h-3.5" color="#008a93" />
                <p className="tw:ml-px tw:text-xs">
                  {Number(payload[0].payload.trainData[0].sigHeight).toFixed(1)}
                  m @
                </p>
                <p className="tw:text-xs">
                  {payload[0].payload.trainData[0].peakPeriod}s
                </p>
                <p className="tw:text-xs">
                  <SwellLabel
                    value={payload[0].payload.trainData[0].direction}
                  />
                </p>
              </div>
            )}
            {!unitPreferences.showAdvancedChart &&
              payload[0].payload.trainData[1] && (
                <div className="tw:flex tw:gap-1">
                  <PiWavesFill
                    className="tw:w-3.5 tw:h-3.5"
                    color="#008a93a6"
                  />
                  <p className="tw:ml-px tw:text-xs">
                    {Number(payload[0].payload.trainData[1].sigHeight).toFixed(
                      1
                    )}
                    m @
                  </p>
                  <p className="tw:text-xs">
                    {payload[0].payload.trainData[1].peakPeriod}s
                  </p>
                  <p className="tw:text-xs">
                    <SwellLabel
                      value={payload[0].payload.trainData[1].direction}
                    />
                  </p>
                </div>
              )}
            {!unitPreferences.showAdvancedChart &&
              payload[0].payload.trainData[2] && (
                <div className="tw:flex tw:gap-1">
                  <PiWavesFill
                    className="tw:w-3.5 tw:h-3.5"
                    color="#008a9366"
                  />
                  <p className="tw:ml-px tw:text-xs">
                    {Number(payload[0].payload.trainData[2].sigHeight).toFixed(
                      1
                    )}
                    m @
                  </p>
                  <p className="tw:text-xs">
                    {payload[0].payload.trainData[2].peakPeriod}s
                  </p>
                  <p className="tw:text-xs">
                    <SwellLabel
                      value={payload[0].payload.trainData[2].direction}
                    />
                  </p>
                </div>
              )}
            {payload[0] && (
              <>
                {payload[0].payload.isRising ? (
                  <>
                    {payload[0].payload.nextHighTideHeight && (
                      <div className="tw:flex tw:gap-1">
                        <GiHighTide
                          className="tw:w-3.5 tw:h-3.5"
                          color="#008a93"
                        />
                        <p className="tw:ml-px tw:text-xs">
                          {payload[0].payload.nextHighTideHeight}m @
                        </p>
                        <p className="tw:text-xs">
                          {payload[0].payload.nextHighTide}
                        </p>
                      </div>
                    )}
                    {payload[0].payload.nextLowTideHeight && (
                      <div className="tw:flex tw:gap-1">
                        <GiLowTide
                          className="tw:w-3.5 tw:h-3.5"
                          color="#008a93"
                        />
                        <p className="tw:ml-px tw:text-xs">
                          {payload[0].payload.nextLowTideHeight}m @
                        </p>
                        <p className="tw:text-xs">
                          {payload[0].payload.nextLowTide}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {payload[0].payload.nextLowTideHeight && (
                      <div className="tw:flex tw:gap-1">
                        <GiLowTide
                          className="tw:w-3.5 tw:h-3.5"
                          color="#008a93"
                        />
                        <p className="tw:ml-px tw:text-xs">
                          {payload[0].payload.nextLowTideHeight}m @
                        </p>
                        <p className="tw:text-xs">
                          {payload[0].payload.nextLowTide}
                        </p>
                      </div>
                    )}
                    {payload[0].payload.nextHighTideHeight && (
                      <div className="tw:flex tw:gap-1">
                        <GiHighTide
                          className="tw:w-3.5 tw:h-3.5"
                          color="#008a93"
                        />
                        <p className="tw:ml-px tw:text-xs">
                          {payload[0].payload.nextHighTideHeight}m @
                        </p>
                        <p className="tw:text-xs">
                          {payload[0].payload.nextHighTide}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    return null;
  }
);
