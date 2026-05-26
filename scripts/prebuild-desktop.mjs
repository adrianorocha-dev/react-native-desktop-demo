import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const MARKER_START = "WINDOW_CONFIG_START";
const MARKER_END = "WINDOW_CONFIG_END";

// --- Config loading & validation ---

function loadConfig() {
  const raw = JSON.parse(readFileSync(resolve(ROOT, "app.json"), "utf-8"));
  const desktop = raw.desktop;
  if (!desktop) {
    console.log("No 'desktop' key in app.json — nothing to prebuild.");
    process.exit(0);
  }
  return desktop;
}

function mergeConfig(desktop, platform) {
  const override = desktop[platform] ?? {};
  const merged = {};

  for (const key of ["initialSize", "minSize", "maxSize", "title", "resizable"]) {
    if (key in override) {
      merged[key] = override[key];
    } else if (key in desktop) {
      merged[key] = desktop[key];
    }
  }

  return merged;
}

function validate(config) {
  const errors = [];

  for (const key of ["initialSize", "minSize", "maxSize"]) {
    const size = config[key];
    if (size && (typeof size.width !== "number" || typeof size.height !== "number")) {
      errors.push(`${key} must have numeric 'width' and 'height'`);
    }
    if (size && (size.width <= 0 || size.height <= 0)) {
      errors.push(`${key} width and height must be positive`);
    }
  }

  if (config.minSize && config.maxSize) {
    if (config.minSize.width > config.maxSize.width) {
      errors.push(`minSize.width (${config.minSize.width}) > maxSize.width (${config.maxSize.width})`);
    }
    if (config.minSize.height > config.maxSize.height) {
      errors.push(`minSize.height (${config.minSize.height}) > maxSize.height (${config.maxSize.height})`);
    }
  }

  if (config.initialSize) {
    if (config.minSize) {
      if (config.initialSize.width < config.minSize.width) {
        errors.push(`initialSize.width (${config.initialSize.width}) < minSize.width (${config.minSize.width})`);
      }
      if (config.initialSize.height < config.minSize.height) {
        errors.push(`initialSize.height (${config.initialSize.height}) < minSize.height (${config.minSize.height})`);
      }
    }
    if (config.maxSize) {
      if (config.initialSize.width > config.maxSize.width) {
        errors.push(`initialSize.width (${config.initialSize.width}) > maxSize.width (${config.maxSize.width})`);
      }
      if (config.initialSize.height > config.maxSize.height) {
        errors.push(`initialSize.height (${config.initialSize.height}) > maxSize.height (${config.maxSize.height})`);
      }
    }
  }

  if (config.title !== undefined && typeof config.title !== "string") {
    errors.push("title must be a string");
  }

  if (config.resizable !== undefined && typeof config.resizable !== "boolean") {
    errors.push("resizable must be a boolean");
  }

  if (errors.length > 0) {
    console.error("Desktop config validation failed:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

// --- Code generation ---

function generateMacOS(config) {
  const lines = [];

  if (config.initialSize) {
    lines.push(`  [self.window setContentSize:NSMakeSize(${config.initialSize.width}, ${config.initialSize.height})];`);
  }
  if (config.minSize) {
    lines.push(`  self.window.minSize = NSMakeSize(${config.minSize.width}, ${config.minSize.height});`);
  }
  if (config.maxSize) {
    lines.push(`  self.window.maxSize = NSMakeSize(${config.maxSize.width}, ${config.maxSize.height});`);
  }
  if (config.title !== undefined) {
    lines.push(`  self.window.title = @"${config.title}";`);
  }
  if (config.resizable === false) {
    lines.push(`  self.window.styleMask &= ~NSWindowStyleMaskResizable;`);
  }

  return lines.join("\n");
}

function generateWindows(config) {
  const lines = [];

  if (config.initialSize) {
    lines.push(`  appWindow.Resize({${config.initialSize.width}, ${config.initialSize.height}});`);
  }
  if (config.title !== undefined) {
    lines.push(`  appWindow.Title(L"${config.title}");`);
  }
  if (config.minSize || config.maxSize || config.resizable === false) {
    lines.push(`  auto presenter = appWindow.Presenter().as<winrt::Microsoft::UI::Windowing::OverlappedPresenter>();`);
    if (config.minSize) {
      lines.push(`  presenter.PreferredMinimumWidth(${config.minSize.width});`);
      lines.push(`  presenter.PreferredMinimumHeight(${config.minSize.height});`);
    }
    if (config.maxSize) {
      lines.push(`  presenter.PreferredMaximumWidth(${config.maxSize.width});`);
      lines.push(`  presenter.PreferredMaximumHeight(${config.maxSize.height});`);
    }
    if (config.resizable === false) {
      lines.push(`  presenter.IsResizable(false);`);
    }
  }

  return lines.join("\n");
}

function stampFile(filePath, commentPrefix, generated) {
  const content = readFileSync(filePath, "utf-8");
  const startMarker = `${commentPrefix} ${MARKER_START}`;
  const endMarker = `${commentPrefix} ${MARKER_END}`;

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Markers not found in ${filePath}`);
    console.error(`Expected '${startMarker}' and '${endMarker}'`);
    process.exit(1);
  }

  const before = content.slice(0, startIdx + startMarker.length);
  const after = content.slice(endIdx);

  const stamped = generated.length > 0
    ? `${before}\n${generated}\n  ${after}`
    : `${before}\n  ${after}`;

  writeFileSync(filePath, stamped, "utf-8");
  console.log(`  Stamped ${filePath}`);
}

// --- Main ---

const desktop = loadConfig();

const macosConfig = mergeConfig(desktop, "macos");
const windowsConfig = mergeConfig(desktop, "windows");

console.log("Validating macOS config...");
validate(macosConfig);
console.log("Validating Windows config...");
validate(windowsConfig);

const macosFile = resolve(ROOT, "macos/MyApp-macOS/AppDelegate.mm");
const windowsFile = resolve(ROOT, "windows/MyApp/MyApp.cpp");

console.log("\nGenerating native code...");
stampFile(macosFile, "//", generateMacOS(macosConfig));
stampFile(windowsFile, "//", generateWindows(windowsConfig));

console.log("\nDone!");
