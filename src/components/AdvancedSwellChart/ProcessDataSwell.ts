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
  localDateTimeISO: string;
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
    // We'll use the ISO string directly instead of converting to timestamp
    const localDateTimeISO = timeStep.localDateTimeISO;

    if (!localDateTimeISO) {
      console.warn("Missing localDateTimeISO:", timeStep);
      return;
    }

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
          timestamp: new Date(localDateTimeISO).getTime(), // Keep timestamp for internal comparisons
          matched: false,
        });
      }
    });

    const nextActiveEvents = [];
    const matchedEventIdsThisStep = new Set();

    // Match current swells to active events
    for (const activeEvent of activeEvents) {
      let bestMatch = null;
      let smallestDiff = Infinity;

      for (const currentSwell of currentSwells) {
        if (!currentSwell.matched) {
          const dirDiff = Math.abs(
            currentSwell.direction - activeEvent.lastDir
          );
          const perDiff = Math.abs(currentSwell.period - activeEvent.lastPer);

          if (
            dirDiff <= options.dirThreshold &&
            perDiff <= options.periodThreshold
          ) {
            const diffScore = dirDiff + perDiff * 5;
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
          localDateTimeISO: localDateTimeISO, // Use ISO string instead of timestamp
          height: bestMatch.height,
          period: bestMatch.period,
          direction: bestMatch.direction,
        });
        // Update active event state
        activeEvent.lastDir = bestMatch.direction;
        activeEvent.lastPer = bestMatch.period;
        activeEvent.lastT = t;
        activeEvent.gapCount = 0;
        nextActiveEvents.push(activeEvent);
        matchedEventIdsThisStep.add(activeEvent.id);
      } else {
        activeEvent.gapCount++;
        if (activeEvent.gapCount <= options.maxGap) {
          nextActiveEvents.push(activeEvent);
          matchedEventIdsThisStep.add(activeEvent.id);
        }
      }
    }

    // Create new events for unmatched swells
    for (const currentSwell of currentSwells) {
      if (!currentSwell.matched) {
        eventCounter++;
        const newEventId = `event_${eventCounter}_${
          currentSwell.direction
        }_${currentSwell.period.toFixed(1)}`;
        events[newEventId] = [
          {
            localDateTimeISO: localDateTimeISO, // Use ISO string instead of timestamp
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

    activeEvents = nextActiveEvents;
  });

  return events;
}
