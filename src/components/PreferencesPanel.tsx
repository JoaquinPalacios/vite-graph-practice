import { updateUserPreferences, validatePreferences } from "@/api";
import { UnitPreferences } from "@/types";
import { cn } from "@/utils/utils";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { BiCheck, BiLoaderAlt } from "react-icons/bi";

// Save status for UI feedback
export type SaveStatus = "idle" | "saving" | "success" | "error";

export interface PreferencesPanelProps {
  defaultValues: UnitPreferences;
  onChange: (preferences: UnitPreferences) => void;
}

/**
 * PreferencesPanel component
 * @description Renders the unit preference controls and save functionality
 */
const PreferencesPanelComponent = ({
  defaultValues,
  onChange,
}: PreferencesPanelProps) => {
  // State for managing preference changes and save status
  const [pendingChanges, setPendingChanges] = useState<
    Partial<UnitPreferences["units"]>
  >({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Handle preference changes (immediate UI update + track pending changes)
  const handlePreferenceChange = useCallback(
    (newPreferences: UnitPreferences) => {
      // Update parent component immediately for responsive feel
      onChange(newPreferences);

      // Track what has changed for saving to Drupal
      const unitChanges: Partial<UnitPreferences["units"]> = {};
      const currentUnits = defaultValues.units;
      const newUnits = newPreferences.units;

      // Compare each unit type to find changes
      (Object.keys(newUnits) as Array<keyof UnitPreferences["units"]>).forEach(
        (key) => {
          if (currentUnits[key] !== newUnits[key]) {
            (unitChanges as any)[key] = newUnits[key];
          }
        }
      );

      if (Object.keys(unitChanges).length > 0) {
        setPendingChanges((prev) => ({ ...prev, ...unitChanges }));
        setHasUnsavedChanges(true);
      }
    },
    [defaultValues.units, onChange]
  );

  // Manual save handler
  const handleSavePreferences = useCallback(async () => {
    if (Object.keys(pendingChanges).length === 0) return;

    // Validate changes before saving
    const validation = validatePreferences(pendingChanges);
    if (!validation.isValid) {
      setSaveStatus("error");
      return;
    }

    try {
      setSaveStatus("saving");

      const response = await updateUserPreferences(pendingChanges);

      if (response.success) {
        setSaveStatus("success");
        setPendingChanges({});
        setHasUnsavedChanges(false);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } else {
        setSaveStatus("error");
        console.warn(response.message || "Failed to save preferences");
      }
    } catch (error) {
      setSaveStatus("error");
      console.error("Save preferences error:", error);
    }
  }, [pendingChanges]);

  // Clear error messages after 5 seconds
  useEffect(() => {
    if (saveStatus === "error") {
      const timer = setTimeout(() => {
        setSaveStatus("idle");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Memoized event handlers for different unit types to avoid recreation on every render
  const handleSurfHeightChange = useCallback(
    (unit: "ft" | "m" | "surfers_feet") => {
      handlePreferenceChange({
        ...defaultValues,
        units: {
          ...defaultValues.units,
          surfHeight: unit,
        },
      });
    },
    [defaultValues, handlePreferenceChange]
  );

  const handleTemperatureChange = useCallback(
    (unit: "celsius" | "fahrenheit") => {
      handlePreferenceChange({
        ...defaultValues,
        units: {
          ...defaultValues.units,
          temperature: unit,
        },
      });
    },
    [defaultValues, handlePreferenceChange]
  );

  const handleWindChange = useCallback(
    (unit: "knots" | "km" | "mph") => {
      handlePreferenceChange({
        ...defaultValues,
        units: {
          ...defaultValues.units,
          wind: unit,
        },
      });
    },
    [defaultValues, handlePreferenceChange]
  );

  const handleUnitMeasurementsChange = useCallback(
    (unit: "m" | "ft") => {
      handlePreferenceChange({
        ...defaultValues,
        units: {
          ...defaultValues.units,
          unitMeasurements: unit,
        },
      });
    },
    [defaultValues, handlePreferenceChange]
  );

  // Memoized unit options to avoid recreation
  const surfHeightUnits = useMemo(
    () => ["ft", "m", "surfers_feet"] as const,
    []
  );
  const temperatureUnits = useMemo(
    () => ["celsius", "fahrenheit"] as const,
    []
  );
  const windUnits = useMemo(() => ["knots", "km", "mph"] as const, []);
  const unitMeasurementUnits = useMemo(() => ["m", "ft"] as const, []);

  return (
    <div className="tw:min-w-fit tw:flex tw:justify-between tw:items-center tw:gap-8 tw:bg-gray-100 tw:p-4 tw:border-b-gray-300 tw:border-b">
      {/* Surf Height Units */}
      <div className="tw:flex tw:gap-3">
        <label className="margin-none tw:block tw:text-sm tw:font-medium tw:text-gray-700">
          Surf Height
        </label>
        <div className="tw:flex tw:gap-3 tw:relative">
          <div
            className={cn(
              "tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:left-0 tw:h-7 tw:bg-gray-200 tw:shadow tw:z-0 tw:transition-transform tw:duration-200",
              defaultValues.units.surfHeight === "ft" &&
                "tw:w-9 tw:-translate-x-0.5",
              defaultValues.units.surfHeight === "m" &&
                "tw:w-[3.25rem] tw:translate-x-9",
              defaultValues.units.surfHeight === "surfers_feet" &&
                "tw:w-[5.625rem] tw:translate-x-[5.875rem]"
            )}
            style={{ willChange: "transform, width" }}
          />
          {surfHeightUnits.map((unit) => (
            <button
              key={unit}
              type="button"
              className={cn(
                "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-250",
                defaultValues.units.surfHeight === unit
                  ? "tw:text-gray-900"
                  : "tw:text-gray-700"
              )}
              onClick={() => handleSurfHeightChange(unit)}
            >
              {unit === "surfers_feet"
                ? "Surfer's Feet"
                : unit === "ft"
                ? "Feet"
                : "Metres"}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Units */}
      <div className="tw:flex tw:gap-2">
        <label className="margin-none tw:block tw:text-sm tw:font-medium tw:text-gray-700">
          Tempe
        </label>
        <div className="tw:flex tw:gap-3 tw:relative tw:px-2">
          <div
            className={cn(
              "tw:absolute tw:top-1/2 tw:w-6 tw:-translate-y-1/2 tw:left-0 tw:h-7 tw:bg-gray-200 tw:shadow tw:z-0 tw:transition-transform tw:duration-200",
              defaultValues.units.temperature === "celsius"
                ? "tw:translate-x-1"
                : "tw:translate-x-[1.875rem]"
            )}
            style={{ willChange: "transform" }}
          />
          {temperatureUnits.map((unit) => (
            <button
              key={unit}
              type="button"
              className={cn(
                "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-250",
                defaultValues.units.temperature === unit
                  ? "tw:text-gray-900"
                  : "tw:text-gray-700"
              )}
              onClick={() => handleTemperatureChange(unit)}
            >
              {unit === "celsius" ? "°C" : "°F"}
            </button>
          ))}
        </div>
      </div>

      {/* Wind Speed Units */}
      <div className="tw:flex tw:gap-2">
        <label className="margin-none tw:block tw:text-sm tw:font-medium tw:text-gray-700">
          Wind
        </label>
        <div className="tw:flex tw:gap-3 tw:relative tw:px-2">
          <div
            className={cn(
              "tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:left-0 tw:h-7 tw:bg-gray-200 tw:shadow tw:z-0 tw:transition-transform tw:duration-200",
              defaultValues.units.wind === "knots" &&
                "tw:w-11 tw:translate-x-1",
              defaultValues.units.wind === "km" &&
                "tw:w-[2.625rem] tw:translate-x-[3.375rem]",
              defaultValues.units.wind === "mph" &&
                "tw:w-9 tw:translate-x-[6.25rem]"
            )}
            style={{ willChange: "transform, width" }}
          />
          {windUnits.map((unit) => (
            <button
              key={unit}
              type="button"
              className={cn(
                "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-250",
                defaultValues.units.wind === unit
                  ? "tw:text-gray-900"
                  : "tw:text-gray-700"
              )}
              onClick={() => handleWindChange(unit)}
            >
              {unit === "km" ? "Km/h" : unit === "mph" ? "Mph" : "Knots"}
            </button>
          ))}
        </div>
      </div>

      {/* General Measurements */}
      <div className="tw:flex tw:gap-2">
        <label className="margin-none tw:block tw:text-sm tw:font-medium tw:text-gray-700">
          Tide / Swell
        </label>
        <div className="tw:flex tw:gap-3 tw:relative tw:px-2">
          <div
            className={cn(
              "tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:left-0 tw:h-7 tw:bg-gray-200 tw:shadow tw:z-0 tw:transition-all tw:duration-200",
              defaultValues.units.unitMeasurements === "m"
                ? "tw:w-[3.3125rem] tw:translate-x-1"
                : "tw:w-9 tw:translate-x-[3.75rem]"
            )}
            style={{ willChange: "transform, width" }}
          />
          {unitMeasurementUnits.map((unit) => (
            <button
              key={unit}
              type="button"
              className={cn(
                "selector-btn font-sm font-bold tw:relative tw:flex tw:items-center tw:justify-center tw:z-10 tw:w-fit tw:h-fit tw:border-none tw:bg-transparent tw:cursor-pointer tw:transition-colors tw:duration-250",
                defaultValues.units.unitMeasurements === unit
                  ? "tw:text-gray-900"
                  : "tw:text-gray-700"
              )}
              onClick={() => handleUnitMeasurementsChange(unit)}
            >
              {unit === "m" ? "Meters" : "Feet"}
            </button>
          ))}
        </div>
      </div>

      {/* Save button and status */}
      <div className="tw:flex tw:items-center tw:justify-end">
        {/* Save button */}
        <button
          type="button"
          onClick={handleSavePreferences}
          disabled={!hasUnsavedChanges || saveStatus === "saving"}
          className={cn(
            "panel-preferences-submit-btn tw:flex tw:items-center tw:relative",
            hasUnsavedChanges && saveStatus !== "saving" ? "" : ""
          )}
        >
          Save
          {saveStatus === "saving" && (
            <BiLoaderAlt className="tw:size-3.5 tw:animate-spin tw:absolute tw:-left-4 tw:top-1/2 tw:-translate-y-1/2 tw:text-swell" />
          )}
          {saveStatus === "success" && (
            <BiCheck className="tw:size-4 tw:absolute tw:-left-4 tw:top-1/2 tw:-translate-y-1/2 tw:text-swell" />
          )}
        </button>
      </div>
    </div>
  );
};

// Memoized component to prevent unnecessary re-renders when props haven't changed
export const PreferencesPanel = memo(PreferencesPanelComponent);
