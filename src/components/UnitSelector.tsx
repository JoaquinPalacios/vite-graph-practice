import { UnitPreferences } from "@/types";

export interface UnitSelectorProps {
  onChange: (preferences: UnitPreferences) => void;
  defaultValues: UnitPreferences;
}

/**
 * UnitSelector component
 * @description This component is used to select the unit of the tide data.
 * It is used to display the unit of the tide data in the graph.
 * @param param0 - The props of the component
 * @returns The UnitSelector component
 */
export const UnitSelector = ({
  onChange,
  defaultValues,
}: UnitSelectorProps) => {
  return (
    <div className="tw:flex tw:gap-4 tw:items-center tw:max-md:px-5">
      <button
        onClick={() =>
          onChange({
            ...defaultValues,
            showAdvancedChart: !defaultValues.showAdvancedChart,
          })
        }
        className="tw:p-2 tw:rounded tw:border tw:border-gray-300 tw:hover:bg-gray-100"
      >
        {defaultValues.showAdvancedChart ? "Hide" : "Show"} Advanced Chart
      </button>
    </div>
  );
};
