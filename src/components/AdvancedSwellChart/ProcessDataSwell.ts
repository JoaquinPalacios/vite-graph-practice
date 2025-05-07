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

import { ChartDataItem } from "@/types";
import { metersToFeet } from "@/utils/chart-utils";

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
  lastTimestamp: number;
}

interface CurrentSwell {
  trainDelta: number;
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
  data: ChartDataItem[],
  options = {
    dirThreshold: 30,
    periodThreshold: 3.0,
    minHeight: 0.15,
    maxGap: 2,
    maxTimeGap: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
  },
  unitPreference: "m" | "ft" = "m"
) {
  const events: EventMap = {};
  let activeEvents: ActiveEvent[] = [];
  let eventCounter = 0;

  data.forEach((timeStep, t) => {
    const localDateTimeISO = timeStep.localDateTimeISO;
    const currentTimestamp = new Date(localDateTimeISO).getTime();

    if (!localDateTimeISO) {
      console.warn("Missing localDateTimeISO:", timeStep);
      return;
    }

    const currentSwells: CurrentSwell[] = [];

    // Gather significant swells for this time step from trainData
    if (timeStep.trainData && timeStep.trainData.length > 0) {
      timeStep.trainData.forEach((train) => {
        if (
          train.sigHeight !== null &&
          train.sigHeight !== undefined &&
          train.sigHeight >= options.minHeight &&
          train.direction !== null &&
          train.direction !== undefined &&
          train.peakPeriod !== null &&
          train.peakPeriod !== undefined
        ) {
          currentSwells.push({
            trainDelta: train.trainDelta || 0,
            height:
              unitPreference === "ft"
                ? metersToFeet(train.sigHeight)
                : train.sigHeight,
            direction: train.direction,
            period: train.peakPeriod,
            timestamp: currentTimestamp,
            matched: false,
          });
        }
      });
    }

    const nextActiveEvents = [];
    const matchedEventIdsThisStep = new Set();

    // Sort active events by their last timestamp to prioritize matching with the most recent events
    activeEvents.sort((a, b) => b.lastTimestamp - a.lastTimestamp);

    // Match current swells to active events
    for (const activeEvent of activeEvents) {
      let bestMatch = null;
      let smallestDiff = Infinity;

      // Check if the time gap is too large
      const timeGap = currentTimestamp - activeEvent.lastTimestamp;
      if (timeGap > options.maxTimeGap) {
        continue; // Skip this active event as the gap is too large
      }

      for (const currentSwell of currentSwells) {
        if (!currentSwell.matched) {
          const dirDiff = Math.abs(
            currentSwell.direction - activeEvent.lastDir
          );
          const perDiff = Math.abs(currentSwell.period - activeEvent.lastPer);

          // Adjust thresholds based on time gap
          const adjustedDirThreshold =
            timeGap <= 3 * 60 * 60 * 1000 // Within 3 hours
              ? options.dirThreshold * 2.2 // Slightly more lenient for close points
              : options.dirThreshold;

          const adjustedPerThreshold =
            timeGap <= 3 * 60 * 60 * 1000
              ? options.periodThreshold * 2.2
              : options.periodThreshold;

          if (
            dirDiff <= adjustedDirThreshold &&
            perDiff <= adjustedPerThreshold
          ) {
            const diffScore = dirDiff + perDiff * 3.5;
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
          localDateTimeISO: localDateTimeISO,
          height: bestMatch.height,
          period: bestMatch.period,
          direction: bestMatch.direction,
        });
        // Update active event state
        activeEvent.lastDir = bestMatch.direction;
        activeEvent.lastPer = bestMatch.period;
        activeEvent.lastT = t;
        activeEvent.lastTimestamp = currentTimestamp;
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
            localDateTimeISO: localDateTimeISO,
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
          lastTimestamp: currentTimestamp,
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
