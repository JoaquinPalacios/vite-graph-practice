/**
 * Formats a date for tooltip display in the format "time weekday day month" (e.g., "3pm Mon 15 Apr")
 * @param {string | Date} date - The date to format (can be ISO string or Date object)
 * @returns {string} The formatted date string
 */
export const formatTooltipDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const time = dateObj
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
    .toLowerCase()
    .replace(" ", "");

  const weekday = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const day = dateObj.getDate();

  const month = dateObj.toLocaleDateString("en-US", {
    month: "short",
  });

  return `${time} ${weekday} ${day} ${month}`;
};
