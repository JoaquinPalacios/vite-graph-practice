# Swellnet Graphs 🌊

A high-performance React application for displaying comprehensive weather, tide, and surf data using Vite and Recharts. This application provides detailed visualizations for surfers and weather enthusiasts.

## Features

- 📊 Interactive charts for:
  - Swell data with primary and secondary swell components
  - **Advanced D3.js swell analysis** with intelligent event tracking and arrow visualization
  - Tide data (Australia and worldwide) using D3.js for precise time-series visualization
  - Weather conditions and forecasts
- 🕰️ Real-time "Now" indicator on Swell (Recharts) and Tide (D3.js) charts, with an interpolated position for precise, up-to-the-minute tracking.
- 🎨 Smooth animations and transitions powered by D3.js and React
- 📱 Responsive design with mobile optimization
- ⚡ Optimized performance with:
  - Code splitting
  - Dynamic imports
  - Suspense boundaries
  - Efficient bundle organization
  - D3.js optimized rendering for large datasets
- 🔄 Real-time data updates from multiple sources:
  - ECMWF and GFS forecast models
  - Weather API integration
  - Tide data services
- 🎯 Type-safe with TypeScript
- 🔒 Subscription-based access control
- 🌍 Support for multiple timezones
- 📏 Flexible unit preferences (metric/imperial)

## Tech Stack

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [D3.js](https://d3js.org/) - Data-driven document manipulation for tide and advanced swell visualizations
- [Recharts](https://recharts.org/) - Composable charting library built on React components
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Drupal](https://www.drupal.org/) - Backend CMS and API

## Performance Optimizations

The project implements several performance optimizations:

- Code splitting for better initial load
- Dynamic imports for chart components
- Suspense boundaries for better loading states
- Efficient bundle organization
- CSS optimizations with Tailwind
- Client-side data processing
- Optimized chart rendering with D3.js for tide data
- **Advanced D3.js optimizations**:
  - Data-driven DOM manipulation
  - Efficient event tracking algorithms
  - Optimized arrow rendering with SVG transforms
  - Smart tooltip positioning and boundary detection
- Responsive image loading
- D3.js data-driven DOM updates for efficient tide chart rendering

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── assets/                    # Static assets
├── components/
│   ├── ChartsContainer.tsx       # Main container (Client Component)
│   ├── ChartsContainerClient.tsx # Client-side container
│   ├── ChartsWrapper.tsx         # Scroll and interaction handling
│   ├── GraphButtons.tsx          # Navigation controls
│   ├── UnitSelector.tsx          # Unit preference selector
│   ├── SwellChart/              # Swell chart components
│   │   ├── AdvancedSwellChart/   # Advanced swell analysis
│   │   └── SwellChartYAxis/      # Y-axis components
│   ├── AdvanceD3Chart/          # **NEW: D3.js Advanced Swell Chart**
│   │   ├── index.tsx            # Main D3.js chart component
│   │   ├── ProcessDataSwell.ts  # Swell event tracking algorithm
│   │   └── SwellTooltip.tsx     # Interactive tooltips
│   ├── TideChart/               # Tide chart components
│   ├── WeatherChart/            # Weather chart components
│   ├── SubscriptionOverlay/      # Subscription UI components
│   └── ui/                      # Shared UI components
├── data/                       # Data management and API integration
├── lib/                        # Utility libraries
│   └── time-utils.ts           # Timezone and date handling
├── types/                      # TypeScript type definitions
├── utils/                      # Helper functions
├── App.tsx                     # Main application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## Data Integration

The application integrates with multiple data sources:

- Drupal API for core data
- Weather API for current conditions
- Tide data services (Australia and worldwide)
- ECMWF and GFS forecast models
- User preferences and subscription data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Reach out

If you have any questions that are not covered here then contact mailto:joaquin@swellnet.com

Happy Coding 🥳
