# Context

## Glossary

- **WindowManager** — a native module (macOS + Windows) that exposes window control to JavaScript. Has two facets: a prebuild step that stamps startup config into native code, and a runtime API for imperative window operations.
- **Prebuild** — a Node script that reads `app.json` and writes values into native source files between marker comments. Conceptually similar to `expo prebuild` but scoped to desktop window configuration.
- **Desktop config** — the `desktop` key in `app.json`. Holds shared window properties (`initialSize`, `minSize`, `maxSize`, `title`, `resizable`) with optional `macos` and `windows` override sub-keys.
