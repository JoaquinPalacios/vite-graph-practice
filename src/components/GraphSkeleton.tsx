const GraphSkeleton = () => {
  // Determine roughly how many placeholder bars/items to show
  const placeholderCount = 33; // Adjust based on desired density

  return (
    // Outermost container - mimic general padding/background if needed
    <div className="w-full bg-white py-4 pr-4 pl-12 rounded-lg overflow-hidden">
      {/* Top Axis (Time Labels) */}
      <div className="flex justify-around mb-2 pl-8 h-5">
        {[...Array(4)].map(
          (
            _,
            i // ~6 major time labels visible
          ) => (
            <div
              key={`time-${i}`}
              className="h-4 w-10 bg-gray-200 rounded animate-pulse"
            ></div>
          )
        )}
      </div>

      {/* Main Chart Area */}
      <div className="flex space-x-1 h-48 md:h-64">
        {" "}
        {/* Adjust height as needed */}
        {/* Left Axis (Height Labels) - Optional but good for layout */}
        <div className="flex flex-col justify-between w-10 h-full">
          <div className="h-3 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Graph Background & Bars Area */}
        {/* Simple version: single pulsing background */}
        {/* <div className="flex-1 bg-gray-100 animate-pulse rounded"></div> */}
        {/* More complex version: attempt day/night bands + bars */}
        <div className="flex-1 flex items-end justify-start space-x-1 overflow-hidden relative h-full">
          {/* Background Bands (simplified) */}
          <div className="absolute inset-0 flex z-0">
            <div className="w-1/4 h-full bg-slate-200/60"></div>
            <div className="w-1/4 h-full bg-slate-100/60"></div>
            <div className="w-1/4 h-full bg-slate-200/60"></div>
            <div className="w-1/4 h-full bg-slate-100/60"></div>
            {/* Add more bands if needed */}
          </div>
          {/* Bars + Arrows Placeholder */}
          <div className="flex items-end h-full space-x-1 relative z-10">
            {[...Array(placeholderCount)].map((_, i) => (
              <div
                key={`bar-${i}`}
                className="flex flex-col items-center space-y-1"
              >
                {/* Swell Arrow Placeholder */}
                {/* <div className="h-3 w-3 bg-gray-300 rounded-full animate-pulse"></div> */}
                {/* Bar Placeholder - Use varying heights */}
                <div
                  className="w-4 md:w-8 bg-gray-300 animate-pulse"
                  style={{ height: `${Math.random() * 50 + 20}%` }} // Random height (20% to 70%)
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wind Section */}
      <div className="h-12 pl-4 flex justify-around items-center">
        {[...Array(Math.floor(placeholderCount / 2))].map(
          (
            _,
            i // Fewer placeholders for wind needed
          ) => (
            <div
              key={`wind-${i}`}
              className="flex flex-col items-center space-y-1"
            >
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>{" "}
              {/* Arrow */}
              <div className="h-2 w-3 bg-gray-200 rounded animate-pulse"></div>{" "}
              {/* Text */}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GraphSkeleton;
