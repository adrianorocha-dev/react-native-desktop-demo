# WindowManager

Native module for controlling the desktop window from JavaScript. Works on macOS and Windows. Throws on iOS and Android.

WindowManager has two parts:

- **Prebuild config** — a Node script reads window properties from `app.json` and writes them into native source files before compilation. This sets the initial window size, title, and constraints without any JS bundle load delay.
- **Runtime API** — a native module exposed to JS for resizing, repositioning, and toggling window properties at runtime.


## Prebuild config

Define window properties under the `desktop` key in `app.json`:

```json
{
  "name": "MyApp",
  "displayName": "MyApp",
  "desktop": {
    "initialSize": { "width": 1000, "height": 800 },
    "minSize": { "width": 400, "height": 300 },
    "maxSize": { "width": 1920, "height": 1080 },
    "title": "MyApp",
    "resizable": true
  }
}
```

Run the prebuild script to stamp these values into native code:

```sh
pnpm run prebuild:desktop
```

The script replaces everything between `// WINDOW_CONFIG_START` and `// WINDOW_CONFIG_END` markers in:

- `macos/MyApp-macOS/AppDelegate.mm`
- `windows/MyApp/MyApp.cpp`

The script is idempotent. Run it again after changing `app.json` and rebuild the native app.

### Config properties

| Property | Type | Description |
|---|---|---|
| `initialSize` | `{ width, height }` | Window size on launch (logical pixels). |
| `minSize` | `{ width, height }` | Minimum window dimensions. |
| `maxSize` | `{ width, height }` | Maximum window dimensions. |
| `title` | `string` | Window title bar text. |
| `resizable` | `boolean` | Whether the user can resize the window. Defaults to `true` if omitted. |

All properties are optional.

### Per-platform overrides

Add a `macos` or `windows` key inside `desktop` to override specific properties for one platform. Overrides replace the shared value entirely (no deep merging of width/height within a size object).

```json
{
  "desktop": {
    "initialSize": { "width": 1000, "height": 800 },
    "macos": {
      "initialSize": { "width": 1280, "height": 720 }
    },
    "windows": {
      "minSize": { "width": 600, "height": 400 }
    }
  }
}
```

In this example, macOS gets a 1280x720 initial size while Windows gets the shared 1000x800. Windows gets a 600x400 minimum size while macOS has no minimum.

### Validation

The script checks for:

- Non-numeric or non-positive size values
- `minSize` larger than `maxSize`
- `initialSize` outside the min/max bounds
- Wrong types for `title` and `resizable`

It exits with an error before writing anything if validation fails.


## Runtime API

```ts
import { WindowManager } from "./modules/WindowManager";
```

All methods except `getSize` are fire-and-forget (they dispatch to the main thread asynchronously).

| Method | Signature | Description |
|---|---|---|
| `setSize` | `(width: number, height: number, options?: SetSizeOptions) => void` | Resize the window's content area. On macOS, animates by default. |
| `setMinSize` | `(width: number, height: number) => void` | Set minimum window dimensions. |
| `setMaxSize` | `(width: number, height: number) => void` | Set maximum window dimensions. |
| `setTitle` | `(title: string) => void` | Change the title bar text. |
| `setResizable` | `(resizable: boolean) => void` | Enable or disable user resizing. |
| `setFullScreen` | `(fullScreen: boolean) => void` | Enter or exit fullscreen. |
| `setAlwaysOnTop` | `(alwaysOnTop: boolean) => void` | Keep the window above other windows. |
| `center` | `() => void` | Center the window on the current display. |
| `getSize` | `() => Promise<{ width: number; height: number }>` | Returns the current content area size. |
| `isAvailable` | `boolean` (getter) | `true` on macOS and Windows, `false` elsewhere. |

### SetSizeOptions

| Property | Type | Default | Description |
|---|---|---|---|
| `animated` | `boolean` | `true` on macOS, N/A on Windows | Smoothly animate the resize transition using the native AppKit animation. Only supported on macOS; the option is ignored on Windows. |

### Example

```ts
WindowManager.setMinSize(400, 300);
WindowManager.setSize(800, 600);
WindowManager.center();

// Disable animation for an instant resize on macOS
WindowManager.setSize(1024, 768, { animated: false });

const size = await WindowManager.getSize();
console.log(`${size.width} x ${size.height}`);
```

Calling any method on a non-desktop platform throws an error. Check `WindowManager.isAvailable` first if you need to guard against this.


## File structure

```
src/modules/WindowManager/
  index.ts                  TypeScript API wrapping NativeModules.WindowManager
  macos/
    WindowManagerModule.mm  Obj-C module using NSWindow APIs
  windows/
    WindowManagerModule.h   C++ module header (REACT_MODULE macros)
    WindowManagerModule.cpp C++ module using AppWindow + OverlappedPresenter

scripts/
  prebuild-desktop.mjs     Reads app.json, validates, stamps native files
```

The native files are referenced by each platform's build system:

- Xcode: `WindowManagerModule.mm` is listed in `project.pbxproj` as a source file for the `MyApp-macOS` target.
- Visual Studio: `WindowManagerModule.h` and `.cpp` are listed in `MyApp.vcxproj` with an additional include directory pointing to the module's `windows/` folder.


## Adding a new prebuild property

1. Add the property to `app.json` under `desktop`.
2. In `scripts/prebuild-desktop.mjs`:
   - Add the key name to the `mergeConfig` loop so it gets picked up from overrides.
   - Add validation logic in `validate` if needed.
   - Add native code generation in `generateMacOS` and `generateWindows`.
3. Run `pnpm run prebuild:desktop` and rebuild the native app.

The generated code is inserted between the `// WINDOW_CONFIG_START` and `// WINDOW_CONFIG_END` markers. The script replaces everything between the markers on each run, so you only need to update the generation functions.
