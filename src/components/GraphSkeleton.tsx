import { useScreenDetector } from "@/hooks/useScreenDetector";

interface GraphSkeletonProps {
  showMain?: boolean;
  showWeather?: boolean;
  showTide?: boolean;
}

/**
 * GraphSkeleton component
 * @description This component is used to display the skeleton of the graph.
 * It is used to display the skeleton of the graph in the graph.
 * @param showMain - Whether to show the main chart
 * @param showWeather - Whether to show the weather chart
 * @param showTide - Whether to show the tide chart
 */
const GraphSkeleton = ({
  showMain,
  showWeather,
  showTide,
}: GraphSkeletonProps) => {
  const { isExtraLargeDesktop } = useScreenDetector();
  // Determine roughly how many placeholder bars/items to show
  const placeholderCount = 33; // Adjust based on desired density

  return (
    <div className="tw:w-full tw:pl-4 tw:bg-gray-50 tw:overflow-hidden tw:h-[33rem]">
      {/* Main Chart Skeleton */}
      {showMain && (
        <>
          {/* Top Axis (Time Labels) */}
          <div className="tw:flex tw:justify-around tw:mt-3 tw:mb-2 tw:pl-8 tw:h-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={`time-${i}`}
                className="tw:h-4 tw:w-10 tw:bg-gray-200 tw:rounded-xs tw:animate-pulse"
              ></div>
            ))}
          </div>

          {/* Main Chart Area */}
          <div className="tw:flex tw:space-x-1 tw:h-48 tw:md:h-64">
            {/* Left Axis (Height Labels) */}
            <div className="tw:flex tw:flex-col tw:justify-between tw:h-full">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`yaxis-${i}`}
                  className="tw:h-3 tw:w-4 tw:bg-gray-200 tw:rounded-xs tw:animate-pulse"
                ></div>
              ))}
            </div>
            {/* Graph Background & Bars Area */}
            <div className="tw:flex-1 tw:flex tw:items-end tw:justify-start tw:space-x-1 tw:overflow-hidden tw:relative tw:h-full">
              {/* Background Bands (simplified) */}
              <div className="tw:absolute tw:inset-0 tw:flex tw:z-0">
                <div className="tw:w-1/4 tw:h-full tw:bg-gray-200/60"></div>
                <div className="tw:w-1/4 tw:h-full tw:bg-gray-100/60"></div>
                <div className="tw:w-1/4 tw:h-full tw:bg-gray-200/60"></div>
                <div className="tw:w-1/4 tw:h-full tw:bg-gray-100/60"></div>
              </div>
              {/* Bars + Arrows Placeholder */}
              <div className="tw:flex tw:items-end tw:h-full tw:space-x-1 tw:relative tw:z-10">
                {[...Array(placeholderCount)].map((_, i) => (
                  <div
                    key={`bar-${i}`}
                    className="tw:flex tw:flex-col tw:items-center tw:space-y-1"
                  >
                    <div
                      className="tw:w-4 tw:md:w-8 tw:bg-gray-300 tw:animate-pulse"
                      style={{ height: `${Math.random() * 50 + 20}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wind Section */}
          <div className="tw:h-12 tw:pl-4 tw:flex tw:justify-around tw:items-center">
            {[...Array(Math.floor(placeholderCount / 2))].map((_, i) => (
              <div
                key={`wind-${i}`}
                className="tw:flex tw:flex-col tw:items-center tw:space-y-1"
              >
                <div className="tw:h-4 tw:w-4 tw:bg-gray-200 tw:rounded-xs tw:animate-pulse"></div>
                <div className="tw:h-2 tw:w-3 tw:bg-gray-200 tw:rounded-xs tw:animate-pulse"></div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Weather Chart Skeleton */}
      {showWeather && (
        <div className="tw:py-4 tw:ml-5 tw:flex tw:flex-row tw:items-center tw:gap-2 tw:justify-start tw:border-y tw:border-gray-200/50 tw:overflow-hidden">
          {[...Array(isExtraLargeDesktop ? 40 : 32)].map((_, i) => (
            <div
              key={`weather-skel-${i}`}
              className="tw:flex tw:flex-col tw:items-center tw:gap-1"
            >
              <div className="tw:w-6 tw:h-6 tw:bg-gray-200 tw:rounded-full tw:animate-pulse tw:aspect-square"></div>
              <div className="tw:w-3 tw:h-2 tw:bg-gray-200/80 tw:rounded-full tw:animate-pulse tw:aspect-video"></div>
            </div>
          ))}
        </div>
      )}

      {/* Tide Chart Skeleton */}
      {showTide && (
        <div className="tw:mt-2 tw:ml-4 tw:flex tw:flex-row tw:items-end tw:gap-1 tw:justify-center tw:h-16">
          {[...Array(80)].map((_, i) => (
            <div
              key={`tide-skel-${i}`}
              className="tw:w-3 tw:bg-gray-200 tw:rounded tw:animate-pulse"
              style={{ height: `${Math.abs(Math.sin(i / 5)) * 32 + 4}px` }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GraphSkeleton;
