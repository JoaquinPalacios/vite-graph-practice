import React from "react";
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
          {payload.map((pld, index) => (
            <React.Fragment key={`tooltip-item-${index}`}>
              {index > 0 && <h5 className="mt-2">Face feet</h5>}
              <div className="flex gap-1">
                <GiBigWave className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium ml-px">
                  {index === 0
                    ? formatWaveHeight(
                        pld.value as number,
                        String(pld.unit || "m")
                      )
                    : formatWaveHeight(
                        (pld.value as number) + (payload[0].value as number),
                        String(pld.unit || "m")
                      )}
                </p>
                <p className="font-medium">
                  {degreesToCompassDirection(
                    index === 0
                      ? pld.payload.swellDirection
                      : pld.payload.secondarySwellDirection
                  )}
                </p>
              </div>
              {index === 0 && (
                <div className="flex gap-1">
                  <LuWind className="w-3.5 h-3.5" color="#008a93" />
                  <p className="font-medium ml-px">
                    {unitPreferences.windSpeed === "knots"
                      ? pld.payload.windSpeed_knots
                      : pld.payload.windSpeed_kmh}
                    {unitPreferences.windSpeed === "knots" ? "kts" : "km/h"}
                  </p>
                  <p className="font-medium">
                    {degreesToCompassDirection(pld.payload.windDirection)}
                  </p>
                </div>
              )}
              {index === 0 && (
                <div className="flex gap-1">
                  <PiWavesFill className="w-3.5 h-3.5" color="#008a93" />
                  <p className="font-medium ml-px">
                    {pld.payload.primarySwellHeight}m @
                  </p>
                  <p className="font-medium">
                    {pld.payload.primarySwellPeriod}s
                  </p>
                  <p>
                    <RenderCustomizedLabel
                      value={pld.payload.primarySwellDirection}
                    />
                  </p>
                </div>
              )}
              {pld.payload.secondarySwellHeight && index === 0 && (
                <div className="flex gap-1">
                  <PiWavesFill className="w-3.5 h-3.5" color="#008a93a6" />
                  <p className="font-medium ml-px">
                    {pld.payload.secondarySwellHeight}m @
                  </p>
                  <p>{pld.payload.secondarySwellPeriod}s</p>
                  <p className="">
                    <RenderCustomizedLabel
                      value={pld.payload.secondarySwellDirection}
                    />
                  </p>
                </div>
              )}
              {pld.payload.tertiarySwellHeight && index === 0 && (
                <div className="flex gap-1">
                  <PiWavesFill className="w-3.5 h-3.5" color="#008a9366" />
                  <p className="font-medium ml-px">
                    {pld.payload.tertiarySwellHeight}m @
                  </p>
                  <p className="font-medium">
                    {pld.payload.tertiarySwellPeriod}s
                  </p>
                  <p>
                    <RenderCustomizedLabel
                      value={pld.payload.tertiarySwellDirection}
                    />
                  </p>
                </div>
              )}
              {index === 0 && (
                <>
                  {pld.payload.isRising ? (
                    <>
                      <div className="flex gap-1">
                        <GiHighTide className="w-3.5 h-3.5" color="#008a93" />
                        <p className="font-medium ml-px">
                          {pld.payload.nextHighTideHeight}m @
                        </p>
                        <p className="font-medium">
                          {pld.payload.nextHighTide}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <GiLowTide className="w-3.5 h-3.5" color="#008a93" />
                        <p className="font-medium ml-px">
                          {pld.payload.nextLowTideHeight}m @
                        </p>
                        <p className="font-medium">{pld.payload.nextLowTide}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-1">
                        <GiLowTide className="w-3.5 h-3.5" color="#008a93" />
                        <p className="font-medium ml-px">
                          {pld.payload.nextLowTideHeight}m @
                        </p>
                        <p className="font-medium">{pld.payload.nextLowTide}</p>
                      </div>
                      <div className="flex gap-1">
                        <GiHighTide className="w-3.5 h-3.5" color="#008a93" />
                        <p className="font-medium ml-px">
                          {pld.payload.nextHighTideHeight}m @
                        </p>
                        <p className="font-medium">
                          {pld.payload.nextHighTide}
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
