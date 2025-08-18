import { EventData } from "@/types";

/**
 * Calculates the event status for a given date based on event data
 * @param dateString - The date string to check
 * @param eventData - The event data containing start/end dates and chance_of_running
 * @returns The event status string
 */
export const getEventStatus = (
  dateString: string,
  eventData: EventData
): string => {
  try {
    const currentDate = new Date(dateString).toISOString().split("T")[0];
    const eventStartDate = new Date(eventData.start_date)
      .toISOString()
      .split("T")[0];
    const eventEndDate = new Date(eventData.end_date)
      .toISOString()
      .split("T")[0];

    // Check if current date is within event range
    if (currentDate < eventStartDate || currentDate > eventEndDate) {
      return "No event";
    }

    // Calculate days from event start
    const startDate = new Date(eventStartDate);
    const targetDate = new Date(currentDate);
    const diffTime = targetDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Get the corresponding chance_of_running entry
    const chanceEntry = eventData.chance_of_running[diffDays];
    if (!chanceEntry) {
      return "No event";
    }

    // Map numeric values to status text
    switch (chanceEntry.numeric_value) {
      case 3:
        return "Should be on";
      case 2:
        return "Could be on";
      case 1:
        return "Won't be on";
      default:
        return "No event";
    }
  } catch (error) {
    console.error("Error calculating event status:", error);
    return "No event";
  }
};

/**
 * Generates unique ticks for event status display
 * @param chartData - The chart data array
 * @returns Array of unique date strings for ticks
 */
export const generateEventTicks = (
  chartData: Array<{ localDateTimeISO: string }>
): string[] => {
  return chartData
    .reduce((acc: string[], curr) => {
      const date = new Date(curr.localDateTimeISO).toISOString().split("T")[0];
      // Only keep the first occurrence of each date
      if (
        !acc.some(
          (existingDate) =>
            new Date(existingDate).toISOString().split("T")[0] === date
        )
      ) {
        acc.push(curr.localDateTimeISO);
      }
      return acc;
    }, [])
    .slice(1); // Remove the first tick due to being duplicated
};
