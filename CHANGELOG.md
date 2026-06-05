# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-05

### Added
- Waterfall Chart: visualize cumulative flows with positive/negative steps
- Sankey Diagram: node-and-link flow diagrams with curved paths
- Mekko Chart: stacked bars with varying column widths
- Shared interactivity hook for tooltips/legends across all charts

## [1.0.1] - 2025-10-01

### Fixed
- Drop `react-native` and `react-native-svg` from peerDependencies to prevent web installs from requiring native packages

## [1.0.0] - 2025-09-28

### Added
- Initial release with 9 cross-platform chart types (LineChart, AreaChart, BarChart, ScatterPlot, BubbleChart, PieChart, Histogram, RadarChart, TreemapChart)
- Full TypeScript support
- Theme customization system
- Responsive sizing with automatic measurement
- SVG-native tooltips and interactive legends
- Enter animations with customizable easing
- React Native support via `react-native-svg`
- Comprehensive test suite
- Storybook documentation for all charts
