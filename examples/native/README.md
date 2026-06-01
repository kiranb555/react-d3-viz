# react-d3-viz — React Native example (Expo)

Validates that the library runs on React Native via `react-native-svg`. The lib
is consumed as a local `file:../..` dependency; `metro.config.js` watches the
library folder and forces a single copy of React / React Native / react-native-svg.

## Run

```bash
cd examples/native
npm install            # if not already
npx expo start         # then press "i" (iOS) or "a" (Android)
# or
npm run ios            # needs Xcode + simulator
```

> If you change the library source, rebuild it first: `npm run build` in the repo root
> (Metro consumes `dist/`).

## Headless bundle check (no simulator)

```bash
npx expo export --platform ios --output-dir /tmp/expo-out
```

A successful export confirms Metro resolves the `react-native-svg` adapter
(`primitives/index.native.tsx`) and bundles every chart. This is what CI can run.
