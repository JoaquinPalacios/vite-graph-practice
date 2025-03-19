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

// Helper function to format wind speed
const formatWindSpeed = (speed: number | undefined, unit: string) => {
  if (!speed) return "0" + unit; // Handle undefined speed
  // Round to nearest whole number for both units
  const roundedSpeed = Math.round(speed);
  return `${roundedSpeed}${unit}`;
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
              <div className="flex gap-1">
                <GiBigWave className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium ml-px">
                  {formatWaveHeight(
                    pld.value as number,
                    String(pld.unit || "m")
                  )}
                </p>
                <p className="font-medium">
                  {degreesToCompassDirection(pld.payload.swellDirection)}
                </p>
              </div>
              <div className="flex gap-1">
                <LuWind className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium ml-px">
                  {formatWindSpeed(
                    unitPreferences.windSpeed === "knots"
                      ? pld.payload.windSpeed * 0.539957 // Convert km/h to knots
                      : pld.payload.windSpeed,
                    unitPreferences.windSpeed
                  )}
                </p>
                <p className="font-medium">
                  {degreesToCompassDirection(pld.payload.windDirection)}
                </p>
              </div>
              <div className="flex gap-1">
                <PiWavesFill className="w-3.5 h-3.5" color="#008a93" />
                <p className="font-medium ml-px">
                  {pld.payload.primarySwellHeight}m @
                </p>
                <p className="font-medium">{pld.payload.primarySwellPeriod}s</p>
                <p>
                  <RenderCustomizedLabel
                    value={pld.payload.primarySwellDirection}
                  />
                </p>
              </div>
              {pld.payload.secondarySwellHeight && (
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
              {pld.payload.tertiarySwellHeight && (
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
              {pld.payload.isRising ? (
                <>
                  <div className="flex gap-1">
                    <GiHighTide className="w-3.5 h-3.5" color="#008a93" />
                    <p className="font-medium ml-px">
                      {pld.payload.nextHighTideHeight}m @
                    </p>
                    <p className="font-medium">{pld.payload.nextHighTide}</p>
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
                    <p className="font-medium">{pld.payload.nextHighTide}</p>
                  </div>
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
