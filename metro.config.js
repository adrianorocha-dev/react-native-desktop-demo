const fs = require("fs");
const path = require("path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = mergeConfig(getDefaultConfig(__dirname), {});

module.exports = withNativewind(config);

// Metro doesn't re-transform global.css when source files change, so Tailwind
// never sees new class names. Work around this by touching the CSS file whenever
// a source file is saved, which forces Metro to re-run the PostCSS pipeline.
// Only run during `react-native start` — the watcher holds the event loop open
// and prevents the one-shot `bundle` command from exiting (blocking Xcode builds).
const isBundling = process.argv.some(
  (arg) => arg === "bundle" || arg.endsWith("/bundle.js"),
);

console.log("isBundling", isBundling);

if (!isBundling) {
  const globalCssPath = path.resolve(__dirname, "global.css");
  const srcDir = path.resolve(__dirname, "src");
  let debounce;
  const watcher = fs.watch(srcDir, { recursive: true }, (_event, filename) => {
    if (filename && /\.[jt]sx?$/.test(filename)) {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        try {
          let css = fs.readFileSync(globalCssPath, "utf8");
          css = css.replace(/\/\* tw:\d+ \*\/\n?$/, "");
          fs.writeFileSync(globalCssPath, css + `/* tw:${Date.now()} */\n`);
        } catch {}
      }, 50);
    }
  });

  process.on("exit", () => {
    watcher.close();
    clearTimeout(debounce);
    let css = fs.readFileSync(globalCssPath, "utf8");
    css = css.replace(/\/\* tw:\d+ \*\/\n?$/, "");
    fs.writeFileSync(globalCssPath, css);
  });
}
