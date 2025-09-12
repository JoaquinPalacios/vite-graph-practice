import { useScreenDetector } from "@/hooks/useScreenDetector";
import { getWindColor } from "@/lib/charts";
import { formatTooltipDate } from "@/lib/formatting";
import {
  degreesToCompassDirection,
  getAdjustedDirection,
  getBeachFacingDirection,
} from "@/lib/surf";
import { UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";
import { X } from "lucide-react";
import { memo, MouseEvent } from "react";
import { TooltipProps } from "recharts";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { SwellTrainRow } from "./SwellTrainRow";

interface TrainData {
  direction: number;
  sigHeight: number;
  peakPeriod: number;
}

type SwellTooltipProps = TooltipProps<ValueType, NameType> & {
  payload?: Payload<ValueType, NameType>[];
  label?: string;
  unitPreferences: UnitPreferences;
  onClose?: () => void;
};

// Helper function to get surf height label based on unit preferences
const getSurfHeightLabel = (
  swellData: any,
  unitPreferences: UnitPreferences,
  isPrimary: boolean = true
): string => {
  const data = isPrimary ? swellData.primary : swellData.secondary;
  const { surfHeight } = unitPreferences.units;

  switch (surfHeight) {
    case "surfers_feet":
      return data.fullSurfHeightFeetLabelBin;
    case "ft":
      return data.fullSurfHeightFaceFeetLabelBin;
    default:
      return data.fullSurfHeightMetresLabelBin;
  }
};

// Helper function to get wind speed and unit
const getWindSpeed = (
  windData: any,
  unitPreferences: UnitPreferences
): { speed: number; unit: string } => {
  const isKnots = unitPreferences.units.wind === "knots";
  const isKmh = unitPreferences.units.wind === "km";
  const isMph = unitPreferences.units.wind === "mph";
  return {
    speed: Math.round(
      isKnots
        ? windData.speedKnots
        : isKmh
        ? windData.speedKmh
        : isMph
        ? windData.speedMph
        : 0
    ),
    unit: isKnots ? "kts" : isKmh ? "km/h" : isMph ? "mph" : "",
  };
};

// Reusable component for surf height section
const SurfHeightSection = memo(
  ({
    swellData,
    unitPreferences,
    isPrimary = true,
    showBeachFacing = false,
  }: {
    swellData: any;
    unitPreferences: UnitPreferences;
    isPrimary?: boolean;
    showBeachFacing?: boolean;
  }) => {
    const data = isPrimary ? swellData.primary : swellData.secondary;
    const heightLabel = getSurfHeightLabel(
      swellData,
      unitPreferences,
      isPrimary
    );
    const descriptiveLabel = data.fullSurfHeightFeetLabelDescriptive;
    const direction = getAdjustedDirection(Number(data.direction));
    const compassDirection = degreesToCompassDirection(direction);

    return (
      <div className="tw:flex tw:flex-col">
        <div className="tw:flex tw:gap-1 surf-height-label">
          <p className="margin-none tw:leading-[1.2]">{heightLabel}</p>
          <p className="margin-none tw:leading-[1.2]">
            {String(data.fullSurfHeightFeet) !== "0.00" && compassDirection}
          </p>
        </div>
        {showBeachFacing && (
          <p className="margin-none semibold tooltip-paragraph tw:leading-[1.2]">
            {getBeachFacingDirection(Number(data.direction))}
          </p>
        )}
        <p className="margin-bottom-2 tooltip-paragraph-small">
          ({descriptiveLabel})
        </p>
      </div>
    );
  }
);

SurfHeightSection.displayName = "SurfHeightSection";

// Reusable component for wind section
const WindSection = memo(
  ({
    windData,
    unitPreferences,
  }: {
    windData: any;
    unitPreferences: UnitPreferences;
  }) => {
    const color = getWindColor(windData.speedKnots);
    const { speed, unit } = getWindSpeed(windData, unitPreferences);
    const direction = getAdjustedDirection(Number(windData.direction) || 0);
    const compassDirection = degreesToCompassDirection(direction + 180);

    return (
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
            transform={`rotate(${direction ?? 0}, 0, 0)`}
            style={{ transformOrigin: "center" }}
            className="tw:transition-transform tw:duration-150 tw:ease"
          />
          <path
            d="M7.65 10h5v7.5h-5z"
            transform={`rotate(${direction ?? 0}, 0, 0)`}
            style={{ transformOrigin: "center" }}
          />
        </svg>
        <p className="margin-none tooltip-paragraph">
          {speed}
          {unit}
        </p>
        <p className="margin-none tooltip-paragraph">{compassDirection}</p>
      </div>
    );
  }
);

WindSection.displayName = "WindSection";

/**
 * SwellTooltip component
 * This component is used to display the tooltip of the SwellChart.
 * @param {TooltipProps<ValueType, NameType> & { unitPreferences: UnitPreferences }} props - The props for the SwellTooltip component
 * @returns {React.ReactElement} The SwellTooltip component
 */
export const SwellTooltip = memo((props: SwellTooltipProps) => {
  const { active, payload, label, unitPreferences, onClose } = props;
  const { isMobile, isLandscapeMobile, isTablet } = useScreenDetector();
  const isMobileDevice = isMobile || isLandscapeMobile || isTablet;

  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose?.();
  };

  if (active && payload && payload.length) {
    const swellData = payload[0].payload;
    const hasSecondary = payload && payload[1];

    return (
      <div
        key={label}
        className="tooltip-container fade-in-with-delay tw:bg-white/96 tw:relative tw:shadow-md"
        role="tooltip"
        aria-label="Swell and wind information"
      >
        {/* Close button for mobile */}
        {isMobileDevice && (
          <button
            onClick={handleClose}
            className="tw:absolute tw:top-0.5 tw:right-0.5 tw:z-20 tw:w-6 tw:h-6 tw:flex tw:items-center tw:justify-center tw:text-gray-600 tw:text-sm tw:font-bold"
            aria-label="Close tooltip"
          >
            <X className="tw:w-3.5 tw:h-3.5" />
          </button>
        )}

        <div
          className="pseudo-arrow tw:absolute tw:top-1.5 tw:z-0 tw:w-6 tw:h-5 tw:bg-white/96"
          aria-hidden
        />
        <h5
          className={cn(
            "margin-none tw:pl-2.5 tw:pr-7 tw:py-1.5 tw:border-b tw:border-gray-400/20 tw:relative z-10"
          )}
        >
          {label && formatTooltipDate(label)}
        </h5>

        {/* Surf Height and Wind */}
        <div className="tw:flex tw:flex-col tw:px-2 tw:pt-2 tw:border-b tw:border-gray-400/20">
          <SurfHeightSection
            swellData={swellData}
            unitPreferences={unitPreferences}
            isPrimary={true}
          />

          {hasSecondary && (
            <SurfHeightSection
              swellData={swellData}
              unitPreferences={unitPreferences}
              isPrimary={false}
              showBeachFacing={true}
            />
          )}

          <WindSection
            windData={swellData.wind}
            unitPreferences={unitPreferences}
          />
        </div>

        {/* Swell Trains */}
        {swellData?.trainData && (
          <div className="tw:flex tw:flex-col tw:p-2">
            {swellData.trainData.map((train: TrainData, index: number) => (
              <SwellTrainRow
                key={`train-${index}`}
                direction={train.direction}
                sigHeight={train.sigHeight}
                peakPeriod={train.peakPeriod}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
});
