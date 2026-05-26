# Patches

## react-native-macos+0.81.7.patch

Bumps `fmt` 11.0.2 to 12.1.0 to fix `consteval` build failures with Xcode 26+ (see [facebook/react-native#55601](https://github.com/facebook/react-native/issues/55601)) — remove this patch when upgrading to a react-native-macos version that ships fmt 12.x+.

## react-native-css+3.0.7.patch

Adds a `cursor` property parser to the compiler so Tailwind classes like `cursor-pointer` compile through to the native `cursor` style prop (supported by react-native-macos and react-native-windows) — remove this patch when react-native-css adds cursor support upstream.
