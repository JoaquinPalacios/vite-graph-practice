import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { FaRuler, FaWind, FaThermometer, FaWater } from "react-icons/fa";

// Define types for our unit options
export type UnitPreferences = {
  waveHeight: "ft" | "m";
  windSpeed: "knots" | "km/h";
  temperature: "°C" | "°F";
  tideHeight: "ft" | "m";
};

interface UnitSelectorProps {
  onChange: (preferences: UnitPreferences) => void;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({ onChange }) => {
  // Initialize with defaults or stored preferences
  const [preferences, setPreferences] = useState<UnitPreferences>(() => {
    const stored = localStorage.getItem("unitPreferences");
    return stored
      ? JSON.parse(stored)
      : {
          waveHeight: "ft",
          windSpeed: "knots",
          temperature: "°C",
          tideHeight: "m",
        };
  });

  // Save preferences to localStorage and notify parent when changed
  useEffect(() => {
    localStorage.setItem("unitPreferences", JSON.stringify(preferences));
    onChange(preferences);
  }, [preferences, onChange]);

  // Toggle a single unit preference
  const toggleUnit = (key: keyof UnitPreferences) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev };

      // Toggle between available options
      switch (key) {
        case "waveHeight":
        case "tideHeight":
          newPrefs[key] = prev[key] === "ft" ? "m" : "ft";
          break;
        case "windSpeed":
          newPrefs[key] = prev[key] === "knots" ? "km/h" : "knots";
          break;
        case "temperature":
          newPrefs[key] = prev[key] === "°C" ? "°F" : "°C";
          break;
      }

      return newPrefs;
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => toggleUnit("waveHeight")}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-white w-fit",
          preferences.waveHeight === "m" ? "bg-teal-700" : "bg-blue-900"
        )}
      >
        <FaRuler className="text-xs" />
        Wave: {preferences.waveHeight}
      </button>

      <button
        onClick={() => toggleUnit("windSpeed")}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-white w-fit",
          preferences.windSpeed === "km/h" ? "bg-teal-700" : "bg-blue-900"
        )}
      >
        <FaWind className="text-xs" />
        Wind: {preferences.windSpeed}
      </button>

      <button
        onClick={() => toggleUnit("temperature")}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-white w-fit",
          preferences.temperature === "°F" ? "bg-teal-700" : "bg-blue-900"
        )}
      >
        <FaThermometer className="text-xs" />
        Temp: {preferences.temperature}
      </button>

      <button
        onClick={() => toggleUnit("tideHeight")}
        className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-white w-fit",
          preferences.tideHeight === "ft" ? "bg-teal-700" : "bg-blue-900"
        )}
      >
        <FaWater className="text-xs" />
        Tide: {preferences.tideHeight}
      </button>
    </div>
  );
};
