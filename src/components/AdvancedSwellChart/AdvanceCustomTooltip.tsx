import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { GiBigWave, GiHighTide, GiLowTide } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { PiWavesFill } from "react-icons/pi";
import { UnitPreferences } from "@/types";
import { formatWaveHeight } from "@/utils/chart-utils";

/**
 * SwellTooltip component
 * This component is used to display the tooltip of the SwellChart.
 * @param {TooltipProps<ValueType, NameType> & { unitPreferences: UnitPreferences }} props - The props for the SwellTooltip component
 * @returns {React.ReactElement} The SwellTooltip component
 */
export const AdvanceCustomTooltip = ({
  active,
  payload,
  label,
  unitPreferences,
  hoverEventId,
}: TooltipProps<ValueType, NameType> & {
  unitPreferences: UnitPreferences;
  hoverEventId: string | null;
}) => {
  if (active && payload && payload.length) {
    const activeDataKey = payload[0]?.name;

    const filteredPayload = payload.filter(
      (item) => item.name === activeDataKey
    );

    console.log({ filteredPayload });
    console.log({ hoverEventId });

    return (
      <div className="bg-slate-400 rounded-md overflow-hidden">
        <h5 className="mb-2 px-2 pt-2 text-center text-white font-medium text-xs">
          {payload[0].payload.time}&nbsp;-&nbsp;
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </h5>
        <div className="flex flex-col bg-white p-2">
          <div className="flex gap-1">
            <GiBigWave className="w-3.5 h-3.5" color="#008a93" />
            <p className="ml-px text-xs">
              {filteredPayload &&
                formatWaveHeight(
                  filteredPayload[0].payload.height as number,
                  String(payload[0].unit || "m")
                )}
            </p>
            <p className="text-xs">
              {filteredPayload &&
                degreesToCompassDirection(filteredPayload[0].payload.direction)}
            </p>
          </div>
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
          {payload[0] && (
            <div className="flex gap-1">
              <PiWavesFill className="w-3.5 h-3.5" color="#008a93" />
              <p className="ml-px text-xs">
                {payload[0].payload.primarySwellHeight}m @
              </p>
              <p className="text-xs">
                {payload[0].payload.primarySwellPeriod}s
              </p>
            </div>
          )}
          {payload[0].payload.secondarySwellHeight && (
            <div className="flex gap-1">
              <PiWavesFill className="w-3.5 h-3.5" color="#008a93a6" />
              <p className="ml-px text-xs">
                {payload[0].payload.secondarySwellHeight}m @
              </p>
              <p className="text-xs">
                {payload[0].payload.secondarySwellPeriod}s
              </p>
            </div>
          )}
          {payload[0].payload.tertiarySwellHeight && (
            <div className="flex gap-1">
              <PiWavesFill className="w-3.5 h-3.5" color="#008a9366" />
              <p className="ml-px text-xs">
                {payload[0].payload.tertiarySwellHeight}m @
              </p>
              <p className="text-xs">
                {payload[0].payload.tertiarySwellPeriod}s
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
