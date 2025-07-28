import { cn } from "@/utils/utils";

interface NoDataFallbackProps {
  showMain?: boolean;
  showWeather?: boolean;
  showTide?: boolean;
}

/**
 * NoDataFallback component
 * @description This component displays a skeleton-like UI without animation
 * and shows a message when no forecast data is available
 * @param showMain - Whether to show the main chart area
 * @param showWeather - Whether to show the weather chart area
 * @param showTide - Whether to show the tide chart area
 */
const NoDataFallback = ({
  showMain,
  showWeather,
  showTide,
}: NoDataFallbackProps) => {
  return (
    <div
      className={cn(
        "tw:w-full tw:pl-4 tw:bg-gray-50 tw:overflow-hidden",
        showMain && !showWeather && !showTide && "tw:h-80",
        showWeather && !showMain && !showTide && "tw:h-16",
        showTide && !showMain && !showWeather && "tw:h-24",
        showMain && showWeather && !showTide && "tw:h-80",
        showMain && showTide && !showWeather && "tw:h-80",
        showWeather && showTide && !showMain && "tw:h-40",
        showMain && showWeather && showTide && "tw:h-80"
      )}
    >
      {/* Message */}
      <div className="tw:flex tw:items-center tw:justify-center tw:h-full tw:flex-col tw:gap-4">
        <div className="tw:text-center tw:px-6">
          <div className="tw:text-gray-600 tw:text-lg tw:font-medium tw:mb-2">
            {showMain &&
              !showWeather &&
              !showTide &&
              "No forecast data available"}
            {showWeather &&
              !showMain &&
              !showTide &&
              "No weather data available"}
            {showTide && !showMain && !showWeather && "No tide data available"}
            {showMain &&
              showWeather &&
              !showTide &&
              "No forecast data and weather data available"}
            {showMain &&
              showTide &&
              !showWeather &&
              "No forecast data and tide data available"}
            {showMain && showWeather && showTide && "No data available"}
            {showWeather &&
              showTide &&
              !showMain &&
              "No tide data and weather data available"}
          </div>
          {showMain && (
            <div className="tw:text-gray-500 tw:text-sm">
              Please try again later
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoDataFallback;
