/**
 * Data Processing Function
 * Identifies and groups swell events from time series data.
 * @param {Array} data - The input chartData array.
 * @param {object} options - Thresholds for matching.
 * @param {number} options.dirThreshold - Max direction difference (degrees).
 * @param {number} options.periodThreshold - Max period difference (seconds).
 * @param {number} options.minHeight - Minimum height (meters) to track.
 * @param {number} options.maxGap - Max number of time steps an event can disappear before being considered ended.
 * @param {string} unitPreference - The preferred unit for wave height ('m' or 'ft').
 * @returns {object} - Object where keys are event IDs and values are arrays of data points.
 */

import { SwellData } from "@/types";
import { metersToFeet } from "@/utils/chart-utils";

type SwellRank = "primary" | "secondary" | "tertiary" | "fourth" | "fifth";

interface SwellEvent {
  timestamp: number;
  height: number;
  period: number;
  direction: number;
}

interface ActiveEvent {
  id: string;
  lastDir: number;
  lastPer: number;
  lastT: number;
  gapCount: number;
}

interface CurrentSwell {
  rank: SwellRank;
  height: number;
  direction: number;
  period: number;
  timestamp: number;
  matched: boolean;
}

interface EventMap {
  [key: string]: SwellEvent[];
}

/**
 * Function to ensure the timestamp are in miliseconds
 * @param timeStep - The time step object.
 * @returns {number} - The timestamp in miliseconds.
 */
function ensureTimestampInMs(timestamp: number) {
  if (isNaN(timestamp)) {
    console.warn("Invalid timestamp generated for timestep:", timestamp);
    return; // Skip this iteration
  }
  // Check if input timestamp is likely seconds
  if (timestamp < 31536000000) {
    // Simple check for seconds timestamp
    return timestamp * 1000;
  } else {
    return timestamp; // Assume already ms
  }
}

/**
 * Process Swell Data
 * @param data - The input chartData array.
 * @param options - Thresholds for matching.
 * @param unitPreference - The preferred unit for wave height ('m' or 'ft').
 * @returns {object} - Object where keys are event IDs and values are arrays of data points.
 */
export default function processSwellData(
  data: SwellData[],
  options = {
    dirThreshold: 20,
    periodThreshold: 2.0,
    minHeight: 0.15,
    maxGap: 2,
  },
  unitPreference: "m" | "ft" = "m"
) {
  const events: EventMap = {};
  let activeEvents: ActiveEvent[] = [];
  let eventCounter = 0;

  data.forEach((timeStep, t) => {
    const currentSwells: CurrentSwell[] = [];
    const ranks: SwellRank[] = [
      "primary",
      "secondary",
      "tertiary",
      "fourth",
      "fifth",
    ];

    // Gather significant swells for this time step
    ranks.forEach((rank) => {
      const height = timeStep[`${rank}SwellHeight` as keyof SwellData] as
        | number
        | undefined;
      const direction = timeStep[`${rank}SwellDirection` as keyof SwellData] as
        | number
        | undefined;
      const period = timeStep[`${rank}SwellPeriod` as keyof SwellData] as
        | number
        | undefined;
      if (
        height !== undefined &&
        height >= options.minHeight &&
        direction !== undefined &&
        period !== undefined
      ) {
        currentSwells.push({
          rank: rank,
          height: unitPreference === "ft" ? metersToFeet(height) : height,
          direction: direction,
          period: period,
          timestamp: ensureTimestampInMs(timeStep.timestamp) as number,
          matched: false,
        });
      }
    });

    const nextActiveEvents = [];
    const matchedEventIdsThisStep = new Set();

    // 1. Try to match current swells to active events from the previous step
    for (const activeEvent of activeEvents) {
      let bestMatch = null;
      let smallestDiff = Infinity;

      for (const currentSwell of currentSwells) {
        if (!currentSwell.matched) {
          const dirDiff = Math.abs(
            currentSwell.direction - activeEvent.lastDir
          );
          const perDiff = Math.abs(currentSwell.period - activeEvent.lastPer);

          // Simple matching criteria (adjust as needed)
          if (
            dirDiff <= options.dirThreshold &&
            perDiff <= options.periodThreshold
          ) {
            const diffScore = dirDiff + perDiff * 5; // Weight period difference more? Tune this.
            if (diffScore < smallestDiff) {
              smallestDiff = diffScore;
              bestMatch = currentSwell;
            }
          }
        }
      }

      if (bestMatch) {
        // Found a match - continue the event
        bestMatch.matched = true;
        events[activeEvent.id].push({
          timestamp: ensureTimestampInMs(bestMatch.timestamp) as number,
          height: bestMatch.height,
          period: bestMatch.period,
          direction: bestMatch.direction,
        });
        // Update active event state
        activeEvent.lastDir = bestMatch.direction;
        activeEvent.lastPer = bestMatch.period;
        activeEvent.lastT = t;
        activeEvent.gapCount = 0;
        nextActiveEvents.push(activeEvent); // Keep it active
        matchedEventIdsThisStep.add(activeEvent.id);
      } else {
        // No match found - increment gap count
        activeEvent.gapCount++;
        if (activeEvent.gapCount <= options.maxGap) {
          nextActiveEvents.push(activeEvent); // Keep potentially active for a few steps
          matchedEventIdsThisStep.add(activeEvent.id); // Still considered 'active' during gap
        } // Else: event is considered ended, drop it
      }
    }

    // 2. Any unmatched current swells are new events
    for (const currentSwell of currentSwells) {
      if (!currentSwell.matched) {
        eventCounter++;
        const newEventId = `event_${eventCounter}_${
          currentSwell.direction
        }_${currentSwell.period.toFixed(1)}`;
        events[newEventId] = [
          {
            timestamp: ensureTimestampInMs(currentSwell.timestamp) as number,
            height: currentSwell.height,
            period: currentSwell.period,
            direction: currentSwell.direction,
          },
        ];
        const newActiveEvent = {
          id: newEventId,
          lastDir: currentSwell.direction,
          lastPer: currentSwell.period,
          lastT: t,
          gapCount: 0,
        };
        nextActiveEvents.push(newActiveEvent);
        matchedEventIdsThisStep.add(newActiveEvent.id);
      }
    }

    // Update the list of active events for the next time step
    activeEvents = nextActiveEvents;
  });

  return events;
}
