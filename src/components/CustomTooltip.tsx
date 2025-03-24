import { degreesToCompassDirection } from "@/lib/degrees-to-compass-direction";
import { GiBigWave, GiHighTide, GiLowTide } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import RenderCustomizedLabel from "./RenderCustomizedLabel";
import { PiWavesFill } from "react-icons/pi";
import { UnitPreferences } from "./UnitSelector";

// Helper function to format wave heights
const formatWaveHeight = (
  height: number | undefined,
  unit: string | undefined
) => {
  if (!height) return "0m"; // Handle undefined height
  const actualUnit = unit || "m"; // Default to meters if unit is undefined

  if (actualUnit === "ft") {
    // For feet, show as a range (e.g., 2-3ft)
    const lowerBound = Math.floor(height);
    const upperBound = Math.ceil(height);

    // If the height is already a whole number, just return that value
    if (lowerBound === upperBound) {
      return `${lowerBound}${actualUnit}`;
    }

    return `${lowerBound}-${upperBound}${actualUnit}`;
  }

  // For meters, show one decimal place
  return `${height.toFixed(1)}${actualUnit}`;
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  unitPreferences,
}: TooltipProps<ValueType, NameType> & {
  unitPreferences: UnitPreferences;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-100 rounded-md overflow-hidden">
        <h5 className="mb-2 px-2 pt-2 text-center">
          {payload[0].payload.time}&nbsp;-&nbsp;
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </h5>
        <div className="flex flex-col bg-stone-50 p-2">
          <div className="flex gap-1">
            <GiBigWave className="w-3.5 h-3.5" color="#008a93" />
            <p className="font-medium ml-px">
              {payload &&
                formatWaveHeight(
                  payload[0].value as number,
                  String(payload[0].unit || "m")
                )}
            </p>
            <p className="font-medium">
              {payload[0] &&
                degreesToCompassDirection(payload[0].payload.swellDirection)}
            </p>
          </div>
          {payload && payload[1] && (
            <div className="flex gap-1">
              <GiBigWave className="w-3.5 h-3.5" color={"#ffa800"} />
              <p className="font-medium ml-px">
                {formatWaveHeight(
                  (payload[1].value as number) +
                    (payload[0].payload.waveHeight_ft as number),
                  String(payload[1].unit || "ft")
                )}
              </p>
              <p className="font-medium">South Facing Beaches</p>
            </div>
          )}
          {payload[0] && (
            <div className="flex gap-1">
              <LuWind className="w-3.5 h-3.5" color="#008a93" />
              <p className="font-medium ml-px">
                {unitPreferences.windSpeed === "knots"
                  ? payload[0].payload.windSpeed_knots
                  : payload[0].payload.windSpeed_kmh}
                {unitPreferences.windSpeed === "knots" ? "kts" : "km/h"}
              </p>
              <p className="font-medium">
                {degreesToCompassDirection(payload[0].payload.windDirection)}
              </p>
            </div>
          )}
          {payload[0] && (
            <div className="flex gap-1">
              <PiWavesFill className="w-3.5 h-3.5" color="#008a93" />
              <p className="font-medium ml-px">
                {payload[0].payload.primarySwellHeight}m @
              </p>
              <p className="font-medium">
                {payload[0].payload.primarySwellPeriod}s
              </p>
              <p>
                <RenderCustomizedLabel
                  value={payload[0].payload.primarySwellDirection}
                />
              </p>
            </div>
          )}
          {payload[0].payload.secondarySwellHeight && (
            <div className="flex gap-1">
              <PiWavesFill className="w-3.5 h-3.5" color="#008a93a6" />
              <p className="font-medium ml-px">
                {payload[0].payload.secondarySwellHeight}m @
              </p>
              <p>{payload[0].payload.secondarySwellPeriod}s</p>
              <p className="">
                <RenderCustomizedLabel
                  value={payload[0].payload.secondarySwellDirection}
                />
              </p>
            </div>
          )}
          {payload[0].payload.tertiarySwellHeight && (
            <div className="flex gap-1">
              <PiWavesFill className="w-3.5 h-3.5" color="#008a9366" />
              <p className="font-medium ml-px">
                {payload[0].payload.tertiarySwellHeight}m @
              </p>
              <p className="font-medium">
                {payload[0].payload.tertiarySwellPeriod}s
              </p>
              <p>
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
                  <div className="flex gap-1">
                    <GiHighTide className="w-3.5 h-3.5" color="#008a93" />
                    <p className="font-medium ml-px">
                      {payload[0].payload.nextHighTideHeight}m @
                    </p>
                    <p className="font-medium">
                      {payload[0].payload.nextHighTide}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <GiLowTide className="w-3.5 h-3.5" color="#008a93" />
                    <p className="font-medium ml-px">
                      {payload[0].payload.nextLowTideHeight}m @
                    </p>
                    <p className="font-medium">
                      {payload[0].payload.nextLowTide}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-1">
                    <GiLowTide className="w-3.5 h-3.5" color="#008a93" />
                    <p className="font-medium ml-px">
                      {payload[0].payload.nextLowTideHeight}m @
                    </p>
                    <p className="font-medium">
                      {payload[0].payload.nextLowTide}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <GiHighTide className="w-3.5 h-3.5" color="#008a93" />
                    <p className="font-medium ml-px">
                      {payload[0].payload.nextHighTideHeight}m @
                    </p>
                    <p className="font-medium">
                      {payload[0].payload.nextHighTide}
                    </p>
                  </div>
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
