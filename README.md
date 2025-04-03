# Swellnet Graphs 🌊

A high-performance React application for displaying weather and tide data using Vite and Recharts.

## Features

- 📊 Interactive charts for swell, tide, and weather data
- 🎨 Smooth animations and transitions
- 📱 Responsive design
- ⚡ Optimized performance with code splitting
- 🔄 Real-time data updates
- 🎯 Type-safe with TypeScript

## Tech Stack

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [Recharts](https://recharts.org/) - Composable charting library built on React components
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

## Performance Optimizations

The project implements several performance optimizations:

- Code splitting for better initial load
- Dynamic imports for chart components
- Efficient bundle organization
- CSS optimizations with Tailwind

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
│   ├── ChartsContainer.tsx       # Main container (Server Component)
│   ├── ChartsContainerClient.tsx # Client-side container
│   ├── ChartsWrapper.tsx         # Scroll and interaction handling
│   ├── GraphButtons.tsx          # Navigation controls
│   ├── UnitSelector.tsx          # Unit preference selector
│   ├── SwellChart/               # Swell chart components
│   ├── TideChart/                # Tide chart components
│   ├── WeatherChart/             # Weather chart components
│   └── ui/                       # Shared UI components
├── data/                         # Data management
├── lib/                          # Utility libraries
├── types/                        # TypeScript type definitions
├── utils/                        # Helper functions
├── App.tsx                       # Main application component
├── main.tsx                      # Application entry point
└── index.css                     # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Reach out

If you have any questions that are not covered here then contact mailto:joaquin@swellnet.com

Happy Coding 🥳
