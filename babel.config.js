module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        root: ["."],
        alias: {
          "@": "./src",
          "@modules": "./modules",
        },
      },
    ],
  ],
};
