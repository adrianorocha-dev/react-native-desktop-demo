# NativeWind v5 Setup

NativeWind v5 (`5.0.0-preview.4`) on a bare React Native 0.81 project with `react-native-macos`.

## Dependencies

NativeWind v5 is a thin wrapper around `react-native-css`, which handles CSS compilation, babel transforms, and runtime styling. Both require `@expo/metro-config` for the Metro CSS transformer, and `expo` because `@expo/metro-config` imports from it internally. This does not turn the project into an Expo project.

| Package | Pin | Why pinned |
|---|---|---|
| `nativewind` | `^5.0.0-preview.4` | v5 targets Tailwind CSS v4 |
| `react-native-css` | `^3.0.7` | peer dep of nativewind |
| `tailwindcss` | `^4.3.0` | peer dep of nativewind (must be >4.1.11) |
| `@tailwindcss/postcss` | `^4.3.0` | PostCSS plugin for Tailwind v4 |
| `@expo/metro-config` | `~54.0.2` | must match Expo SDK 54 for react-native 0.81 |
| `expo` | `~54.0.10` | required by `@expo/metro-config` internals |
| `lightningcss` | `^1.30.1` | **1.32+ breaks react-native-css** with a deserialization error ("expected Specifier") |
| `react-native-reanimated` | `~3.17.0` | Metro statically resolves `require("react-native-reanimated")` in react-native-css even though it's only called at runtime |
| `react-native-worklets` | `^0.5.2` | required by react-native-reanimated |

## Config files

**`postcss.config.mjs`** (new) — registers `@tailwindcss/postcss`.

**`global.css`** (new) — imports Tailwind layers and the NativeWind theme (platform fonts, elevation, custom utilities). `@source "./src"` tells Tailwind where to scan for class names.

**`nativewind-env.d.ts`** (auto-generated) — adds `className` types to React Native components. Referenced from `tsconfig.json` (also auto-updated by `withNativewind` on first Metro start).

**`metro.config.js`** (modified) — wraps the base config with `withNativewind()`, which replaces Metro's transformer with `react-native-css`'s CSS-aware transformer and adds `css` to `sourceExts`. Uses `@react-native/metro-config` (not `@expo/metro-config`) for `getDefaultConfig` because the Expo version can't resolve `react-native-macos` platform files like `ReactDevToolsSettingsManager.macos.js`.

**`src/App.tsx`** (modified) — imports `global.css` and uses `className` props.

## Workarounds

### lightningcss pinned to 1.30.1

`lightningcss` 1.32+ changed its serialization format in a way that breaks `react-native-css`'s compiler. The error is `"failed to deserialize; expected an object-like struct named Specifier, found ()"`. Pin to 1.30.1 until react-native-css releases a compatible update.

### Metro CSS watcher in metro.config.js

Metro only re-transforms a file when its content changes. When you add a new Tailwind class to a `.tsx` file, Metro re-transforms that file but not `global.css`, so Tailwind never scans for the new class name. The watcher at the bottom of `metro.config.js` fixes this by appending a timestamp comment to `global.css` whenever a source file changes, which forces Metro to re-run the PostCSS/Tailwind pipeline. The timestamp comment is auto-managed and can be gitignored with a smudge filter if needed.

## Verification

1. `npx react-native start --reset-cache`
2. `npx react-native run-macos`
3. Add a new class (e.g. `bg-red-500`) to a component, save, and confirm the style appears without restarting Metro.
