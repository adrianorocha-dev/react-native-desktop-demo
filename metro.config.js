const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = mergeConfig(getDefaultConfig(__dirname), {});

module.exports = withNativewind(config);

// Metro doesn't re-transform global.css when source files change, so Tailwind
// never sees new class names. Work around this by touching the CSS file whenever
// a source file is saved, which forces Metro to re-run the PostCSS pipeline.
const globalCssPath = path.resolve(__dirname, 'global.css');
const srcDir = path.resolve(__dirname, 'src');
let debounce;
fs.watch(srcDir, { recursive: true }, (_event, filename) => {
  if (filename && /\.[jt]sx?$/.test(filename)) {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      try {
        let css = fs.readFileSync(globalCssPath, 'utf8');
        css = css.replace(/\/\* tw:\d+ \*\/\n?$/, '');
        fs.writeFileSync(globalCssPath, css + `/* tw:${Date.now()} */\n`);
      } catch {}
    }, 50);
  }
});
