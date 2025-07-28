import { ChartDataItem } from "@/types";

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
 * @author - Joaquin Palacios
 * @name - Process Swell Data
 * @description Analyzes wave data over time to identify and track distinct swell events.
 * The function groups waves into "events" based on similar characteristics (direction, period, and height),
 * making it easier to track how specific swell patterns evolve over time, grouping them by direction, height and period.
 *
 * For example, if you have a week of wave data, this function will help identify:
 * - When a new swell arrives
 * - How long it lasts
 * - How its characteristics change over time
 * - When it fades away
 *
 * The result is a collection of swell events, each containing a series of measurements
 * that show how that particular swell pattern developed.
 *
 * @param data - Array of wave measurements over time
 * @param options - Configuration settings for matching waves into events
 * @param {number} options.dirThreshold - Max direction difference (degrees).
 * @param {number} options.periodThreshold - Max period difference (seconds).
 * @param {number} options.minHeight - Minimum height (meters) to track.
 * @param {number} options.maxGap - Max number of time steps an event can disappear before being considered ended.
 * @returns {object} - Collection of swell events, where each event contains its complete history
 */
export default function processSwellData(
  data: ChartDataItem[],
  options = {
    dirThreshold: 15,
    periodThreshold: 1.5,
    minHeight: 0.05,
    maxGap: 2,
    maxTimeGap: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
  }
) {
  const events: EventMap = {};
  let activeEvents: ActiveEvent[] = [];
  let eventCounter = 0;

  data.forEach((timeStep, t) => {
    const localDateTimeISO = timeStep.localDateTimeISO;
    if (!localDateTimeISO) {
      console.warn("Missing localDateTimeISO:", timeStep);
      return;
    }

    const currentTimestamp = new Date(localDateTimeISO).getTime();

    const currentSwells: CurrentSwell[] = [];

    // Handle missing data by creating minimal invisible swells
    if (timeStep._isMissingData === true) {
      // Create a minimal swell event just above threshold to maintain timeline structure
      currentSwells.push({
        trainDelta: 0,
        height: options.minHeight + 0.01, // Just above minimum threshold
        direction: 0, // Default direction
        period: options.periodThreshold + 0.1, // Just above minimum period
        timestamp: currentTimestamp,
        matched: false,
      });

      // Update gap count for all active events since we have missing data
      const nextActiveEvents = [];
      for (const activeEvent of activeEvents) {
        activeEvent.gapCount++;
        if (activeEvent.gapCount <= options.maxGap) {
          nextActiveEvents.push(activeEvent);
        }
      }
      activeEvents = nextActiveEvents;

      // Continue with normal processing using the minimal swell
    } else {
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
              height: train.sigHeight,
              direction: train.direction,
              period: train.peakPeriod,
              timestamp: currentTimestamp,
              matched: false,
            });
          }
        });
      }
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
          const perDiff = Math.abs(currentSwell.period - activeEvent.lastPer);

          // First check period - this is our primary matching criterion
          if (perDiff <= options.periodThreshold) {
            const dirDiff = Math.abs(
              currentSwell.direction - activeEvent.lastDir
            );

            // Only then check direction if period matches
            if (dirDiff <= options.dirThreshold) {
              // Use period difference as the primary score, with direction as a secondary factor
              const diffScore = perDiff * 10 + dirDiff; // Period weighted 10x more than direction
              if (diffScore < smallestDiff) {
                smallestDiff = diffScore;
                bestMatch = currentSwell;
              }
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
