# Project Memory

This file serves as our memory for the project, tracking important decisions, implementations, and references for future tasks.

## BigPipe Implementation

### Overview

BigPipe is a technique for progressive loading of page content by streaming HTML chunks to the browser. This improves perceived performance by showing content as soon as it's ready.

### Key Files

- `src/lib/bigpipe-entry.ts` - Base class for BigPipe entry points with enhanced logging
- `src/lib/bigpipe-test.ts` - Comprehensive testing utility for BigPipe functionality
- `src/lib/bigpipe-debug.ts` - Real-time monitoring and debugging capabilities
- `src/main.tsx` - Main entry point with BigPipe testing integration
- `BIGPIPE_TESTING.md` - Complete testing guide and troubleshooting

### BigPipe Entry Points

- `src/entries/weather.tsx` - Weather components BigPipe entry
- `src/entries/charts.tsx` - Chart components BigPipe entry
- `src/entries/surf-report.tsx` - Surf report components BigPipe entry
- `src/entries/tides.tsx` - Tide components BigPipe entry
- `src/entries/advanced.tsx` - Advanced chart components BigPipe entry
- `src/entries/subscription.tsx` - Subscription components BigPipe entry

### Testing and Debugging Features

#### Automatic Testing

- Runs comprehensive tests on page load
- Tests headers, containers, event listeners, data flow, and performance
- Provides detailed console output with pass/fail results

#### Manual Testing Commands

```javascript
// Run all BigPipe tests
runBigPipeTests();

// Get current BigPipe status
getBigPipeStatus();

// Simulate BigPipe events
simulateBigPipeEvent(
  "bigpipe:weather-data",
  { temperature: 25 },
  "weather-container"
);

// Show/hide debug panel
showBigPipeDebug();
hideBigPipeDebug();
```

#### Real-time Monitoring

- Monitors all BigPipe events automatically
- Tracks DOM changes for BigPipe containers
- Provides visual debug panel with real-time status
- Logs all events with timestamps and details

#### Debug Panel Features

- Floating panel with real-time status
- Event count and container count
- Quick access to run tests and clear logs
- Visual indicators for monitoring status

### Headers Analysis

Based on the provided headers, BigPipe appears to be configured correctly:

- ✅ `transfer-encoding: chunked` - Indicates streaming response
- ✅ `x-accel-buffering: no` - Disables buffering for streaming
- ✅ `vary: Accept-Encoding` - Proper caching headers

### Expected Behavior

1. **Progressive Loading**: Content should appear as it becomes available
2. **Loading States**: Placeholder containers should show loading indicators initially
3. **Smooth Transitions**: Components should mount smoothly as data arrives
4. **Performance Improvement**: Faster First Contentful Paint and Time to Interactive

### Troubleshooting

If BigPipe isn't working visually:

1. Check console logs for BigPipe initialization messages
2. Verify headers are present (`x-accel-buffering: no`)
3. Run `runBigPipeTests()` to check event handling
4. Use `showBigPipeDebug()` to monitor real-time events
5. Check that placeholder containers exist in the DOM

### Server-Side Requirements

For BigPipe to work properly, the server needs to:

1. Disable buffering with `x-accel-buffering: no` header
2. Use chunked transfer encoding
3. Stream HTML chunks as they become available
4. Dispatch BigPipe events with component data

## Performance Optimization Rules

### Code Optimization

- Use efficient algorithms and data structures
- Implement memoization where beneficial (useMemo/useCallback in React)
- Avoid unnecessary re-renders (React.memo, pure components)
- Optimize loops and iterations
- Use appropriate caching strategies

### Resource Management

- Implement lazy loading for components and assets
- Optimize image and media loading
- Use code splitting to load only what's needed
- Manage state efficiently; keep it local when possible
- Monitor memory usage and perform cleanups

### Build and Bundle

- Keep bundle sizes minimal
- Use tree shaking and dynamic imports
- Optimize third-party dependencies
- Avoid large or unnecessary libraries

## Return Types

When declaring functions on the top-level of a module, declare their return types:

```ts
const myFunc = (): string => {
  return "hello";
};
```

Exception: Comments that return JSX don't need return type declarations.

```tsx
const MyComponent = () => {
  return <div>Hello</div>;
};
```
