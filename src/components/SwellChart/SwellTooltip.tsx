import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { GiBigWave, GiHighTide, GiLowTide } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import RenderCustomizedLabel from "./SwellLabel";
import { PiWavesFill } from "react-icons/pi";
import { UnitPreferences } from "@/types";
import { formatWaveHeight } from "@/utils/chart-utils";

/**
 * SwellTooltip component
 * This component is used to display the tooltip of the SwellChart.
 * @param {TooltipProps<ValueType, NameType> & { unitPreferences: UnitPreferences }} props - The props for the SwellTooltip component
 * @returns {React.ReactElement} The SwellTooltip component
 */
export const SwellTooltip = ({
  active,
  payload,
  label,
  unitPreferences,
}: TooltipProps<ValueType, NameType> & {
  unitPreferences: UnitPreferences;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-400 rounded-md overflow-hidden">
        <h5 className="mb-2 px-2 pt-2 text-center text-white font-medium text-xs">
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
        <div className="flex flex-col bg-white p-2">
          <div className="flex gap-1">
            <GiBigWave className="w-3.5 h-3.5" color="#008a93" />
            <p className="ml-px text-xs">
              {payload &&
                formatWaveHeight(
                  payload[0].value as number,
                  String(payload[0].unit || "m")
                )}
            </p>
            <p className="text-xs">
              {payload[0] &&
                degreesToCompassDirection(payload[0].payload.swellDirection)}
            </p>
          </div>
          {payload && payload[1] && (
            <div className="flex gap-1">
              <GiBigWave className="w-3.5 h-3.5" color={"#ffa800"} />
              <p className="ml-px text-xs">
                {formatWaveHeight(
                  (payload[1].value as number) +
                    (payload[0].payload.waveHeight_ft as number),
                  String(payload[1].unit || "ft")
                )}
              </p>
              <p className="text-xs">South Facing Beaches</p>
            </div>
          )}
          {payload[0] && (
            <div className="flex gap-1">
              <LuWind className="w-3.5 h-3.5" color="#008a93" />
              <p className="ml-px text-xs">
                {unitPreferences.windSpeed === "knots"
                  ? payload[0].payload.windSpeed_knots
                  : payload[0].payload.windSpeed_kmh}
                {unitPreferences.windSpeed === "knots" ? "kts" : "km/h"}
              </p>
              <p className="text-xs">
                {degreesToCompassDirection(payload[0].payload.windDirection)}
              </p>
            </div>
          )}
          {payload[0] && !unitPreferences.showAdvancedChart && (
            <div className="flex gap-1">
              <PiWavesFill className="w-3.5 h-3.5" color="#008a93" />
              <p className="ml-px text-xs">
                {payload[0].payload.primarySwellHeight}m @
              </p>
              <p className="text-xs">
                {payload[0].payload.primarySwellPeriod}s
              </p>
              <p className="text-xs">
                <RenderCustomizedLabel
                  value={payload[0].payload.primarySwellDirection}
                />
              </p>
            </div>
          )}
          {!unitPreferences.showAdvancedChart &&
            payload[0].payload.secondarySwellHeight && (
              <div className="flex gap-1">
                <PiWavesFill className="w-3.5 h-3.5" color="#008a93a6" />
                <p className="ml-px text-xs">
                  {payload[0].payload.secondarySwellHeight}m @
                </p>
                <p className="text-xs">
                  {payload[0].payload.secondarySwellPeriod}s
                </p>
                <p className="text-xs">
                  <RenderCustomizedLabel
                    value={payload[0].payload.secondarySwellDirection}
                  />
                </p>
              </div>
            )}
          {!unitPreferences.showAdvancedChart &&
            payload[0].payload.tertiarySwellHeight && (
              <div className="flex gap-1">
                <PiWavesFill className="w-3.5 h-3.5" color="#008a9366" />
                <p className="ml-px text-xs">
                  {payload[0].payload.tertiarySwellHeight}m @
                </p>
                <p className="text-xs">
                  {payload[0].payload.tertiarySwellPeriod}s
                </p>
                <p className="text-xs">
                  <RenderCustomizedLabel
                    value={payload[0].payload.tertiarySwellDirection}
                  />
                </p>
              </div>
            )}
          {payload[0] && (
            <>
              {payload[0].payload.isRising ? (
                <>
                  {payload[0].payload.nextHighTideHeight && (
                    <div className="flex gap-1">
                      <GiHighTide className="w-3.5 h-3.5" color="#008a93" />
                      <p className="ml-px text-xs">
                        {payload[0].payload.nextHighTideHeight}m @
                      </p>
                      <p className="text-xs">
                        {payload[0].payload.nextHighTide}
                      </p>
                    </div>
                  )}
                  {payload[0].payload.nextLowTideHeight && (
                    <div className="flex gap-1">
                      <GiLowTide className="w-3.5 h-3.5" color="#008a93" />
                      <p className="ml-px text-xs">
                        {payload[0].payload.nextLowTideHeight}m @
                      </p>
                      <p className="text-xs">
                        {payload[0].payload.nextLowTide}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {payload[0].payload.nextLowTideHeight && (
                    <div className="flex gap-1">
                      <GiLowTide className="w-3.5 h-3.5" color="#008a93" />
                      <p className="ml-px text-xs">
                        {payload[0].payload.nextLowTideHeight}m @
                      </p>
                      <p className="text-xs">
                        {payload[0].payload.nextLowTide}
                      </p>
                    </div>
                  )}
                  {payload[0].payload.nextHighTideHeight && (
                    <div className="flex gap-1">
                      <GiHighTide className="w-3.5 h-3.5" color="#008a93" />
                      <p className="ml-px text-xs">
                        {payload[0].payload.nextHighTideHeight}m @
                      </p>
                      <p className="text-xs ">
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
};
