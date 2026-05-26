# 1. Prebuild script stamps window config into native code

Date: 2026-05-26

## Status

Accepted

## Context

The app runs on macOS (react-native-macos) and Windows (react-native-windows). Both platforms create the application window in native code before the JS bundle loads — `AppDelegate.mm` for macOS, `MyApp.cpp` for Windows. We need a way to configure initial window properties (size, min/max constraints, title, resizability) from a single source of truth in JS-land.

Three approaches were considered:

1. **Native reads a static config file at startup** — the native side parses a JSON file before creating the window. Requires custom native file-reading logic on both platforms, and the config file must be bundled into the native build artifacts correctly.
2. **Post-load resize from JS** — the window opens at a hardcoded default, then the WindowManager native module immediately reconfigures it once the JS bundle loads. Simple, but causes a visible flash of the wrong size on every launch.
3. **Prebuild script stamps values into native code** — a Node script reads `app.json` and writes the config values directly into native source files between marker comments. The values are baked in at build time.

## Decision

Use approach 3: a prebuild script (`scripts/prebuild-desktop.mjs`) that reads the `desktop` key from `app.json` and writes platform-specific native code between `// WINDOW_CONFIG_START` and `// WINDOW_CONFIG_END` markers in `AppDelegate.mm` and `MyApp.cpp`.

## Consequences

- Config lives in `app.json` under `desktop`, with optional `macos`/`windows` overrides — one source of truth.
- The prebuild script must be run before building. It is not yet auto-wired into build scripts.
- Native files contain managed marker blocks that developers must not hand-edit.
- Adding new prebuild-time properties requires updating both the script and the marker block templates.
- No runtime cost or startup flash — values are compiled in.
