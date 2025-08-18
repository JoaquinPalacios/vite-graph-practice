import { cn } from "@/utils/utils";

/**
 * GraphHeader component
 * @description This component is used to display the header of the graph.
 * @param locationName - The name of the location
 */
export const GraphHeader = ({
  locationName,
  isEmbedded,
}: {
  locationName: string;
  isEmbedded?: boolean;
}) => {
  const Tag = isEmbedded ? "h2" : "h1";
  return (
    <Tag className={cn("tw:mb-4", !isEmbedded && "tw:max-md:px-5")}>
      {locationName} Surf Forecast
    </Tag>
  );
};
