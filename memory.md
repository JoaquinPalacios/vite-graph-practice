# Memory File

## Recent Changes

### TideChart Component Updates

- Updated TideChartYAxis to use 0.5m interval ticks
- Modified both Y-axes (main chart and Y-axis component) to use consistent tick settings
- Implemented generateTideTicks function for precise 0.5m interval control
- Added interval={0} to force display of all ticks
- Set allowDecimals={true} to show decimal values
- Updated tick formatting to show decimals only for non-whole numbers (e.g., "1m" for 1.0, "1.5m" for 1.5)
- Hidden the first tick (0m) while keeping all other ticks visible

## Related Files

- src/components/TideChart/TideChartYAxis.tsx
- src/components/TideChart/index.tsx
- src/utils/chart-utils.ts

## Key Functions

- generateTideTicks: Generates ticks at 0.5m intervals up to the maximum height
- TideChartYAxis: Displays the Y-axis with custom ticks and formatting
- TideChart: Main chart component with synchronized Y-axis settings

## Notes

- Both Y-axes (main chart and Y-axis component) must use identical tick settings
- Ticks are generated at 0.5m intervals (0.5, 1.0, 1.5, etc.)
- First tick (0m) is hidden
- Whole numbers are displayed without decimals (e.g., "1m")
- Non-whole numbers show one decimal place (e.g., "1.5m")
- Maximum height is rounded up to the next 0.5m increment
