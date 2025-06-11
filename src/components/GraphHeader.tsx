/**
 * GraphHeader component
 * @description This component is used to display the header of the graph.
 * @param locationName - The name of the location
 */
export const GraphHeader = ({ locationName }: { locationName: string }) => {
  return (
    <h2 className="tw:text-2xl tw:font-semibold tw:mb-4 tw:max-md:px-5">
      {locationName} Surf Forecast
    </h2>
  );
};
