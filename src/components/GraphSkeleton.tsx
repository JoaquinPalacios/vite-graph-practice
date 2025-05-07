const GraphSkeleton = () => {
  // Determine roughly how many placeholder bars/items to show
  const placeholderCount = 33; // Adjust based on desired density

  return (
    // Outermost container - mimic general padding/background if needed
    <div className="tw:w-full tw:bg-white tw:py-4 tw:pr-4 tw:pl-12 tw:rounded-lg tw:overflow-hidden">
      {/* Top Axis (Time Labels) */}
      <div className="tw:flex tw:justify-around tw:mb-2 tw:pl-8 tw:h-5">
        {[...Array(4)].map(
          (
            _,
            i // ~6 major time labels visible
          ) => (
            <div
              key={`time-${i}`}
              className="tw:h-4 tw:w-10 tw:bg-gray-200 tw:rounded tw:animate-pulse"
            ></div>
          )
        )}
      </div>

      {/* Main Chart Area */}
      <div className="tw:flex tw:space-x-1 tw:h-48 tw:md:h-64">
        {" "}
        {/* Adjust height as needed */}
        {/* Left Axis (Height Labels) - Optional but good for layout */}
        <div className="tw:flex tw:flex-col tw:justify-between tw:h-full">
          <div className="tw:h-3 tw:w-4 tw:bg-gray-200 tw:rounded tw:animate-pulse"></div>
          <div className="tw:h-3 tw:w-4 tw:bg-gray-200 tw:rounded tw:animate-pulse"></div>
          <div className="tw:h-3 tw:w-4 tw:bg-gray-200 tw:rounded tw:animate-pulse"></div>
          <div className="tw:h-3 tw:w-4 tw:bg-gray-200 tw:rounded tw:animate-pulse"></div>
          <div className="tw:h-3 tw:w-4 tw:bg-gray-200 tw:rounded tw:animate-pulse"></div>
        </div>
        {/* Graph Background & Bars Area */}
        {/* Simple version: single pulsing background */}
        {/* <div className="flex-1 bg-gray-100 animate-pulse rounded"></div> */}
        {/* More complex version: attempt day/night bands + bars */}
        <div className="tw:flex-1 tw:flex tw:items-end tw:justify-start tw:space-x-1 tw:overflow-hidden tw:relative tw:h-full">
          {/* Background Bands (simplified) */}
          <div className="tw:absolute tw:inset-0 tw:flex tw:z-0">
            <div className="tw:w-1/4 tw:h-full tw:bg-slate-200/60"></div>
            <div className="tw:w-1/4 tw:h-full tw:bg-slate-100/60"></div>
            <div className="tw:w-1/4 tw:h-full tw:bg-slate-200/60"></div>
            <div className="tw:w-1/4 tw:h-full tw:bg-slate-100/60"></div>
            {/* Add more bands if needed */}
          </div>
          {/* Bars + Arrows Placeholder */}
          <div className="tw:flex tw:items-end tw:h-full tw:space-x-1 tw:relative tw:z-10">
            {[...Array(placeholderCount)].map((_, i) => (
              <div
                key={`bar-${i}`}
                className="tw:flex tw:flex-col tw:items-center tw:space-y-1"
              >
                {/* Swell Arrow Placeholder */}

                <div
                  className="tw:w-4 tw:md:w-8 tw:bg-gray-300 tw:animate-pulse"
                  style={{ height: `${Math.random() * 50 + 20}%` }} // Random height (20% to 70%)
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wind Section */}
      <div className="tw:h-12 tw:pl-4 tw:flex tw:justify-around tw:items-center">
        {[...Array(Math.floor(placeholderCount / 2))].map(
          (
            _,
            i // Fewer placeholders for wind needed
          ) => (
            <div
              key={`wind-${i}`}
              className="tw:flex tw:flex-col tw:items-center tw:space-y-1"
            >
              <div className="tw:h-4 tw:w-4 tw:bg-gray-200 tw:rounded tw:animate-pulse"></div>{" "}
              {/* Arrow */}
              <div className="tw:h-2 tw:w-3 tw:bg-gray-200 tw:rounded tw:animate-pulse"></div>{" "}
              {/* Text */}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GraphSkeleton;
