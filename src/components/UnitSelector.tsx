import { UnitPreferences } from "@/types";

export interface UnitSelectorProps {
  onChange: (preferences: UnitPreferences) => void;
  defaultValues: UnitPreferences;
}

export const UnitSelector = ({
  onChange,
  defaultValues,
}: UnitSelectorProps) => {
  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={() =>
          onChange({
            ...defaultValues,
            showAdvancedChart: !defaultValues.showAdvancedChart,
          })
        }
        className="p-2 rounded border border-gray-300 hover:bg-gray-100"
      >
        {defaultValues.showAdvancedChart ? "Hide" : "Show"} Advanced Chart
      </button>
    </div>
  );
};
