module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [['module:react-native-dotenv', { allowUndefined: true }]],
    // Reanimated / Worklets Babel plugin is added automatically by babel-preset-expo.
    // Do not add react-native-worklets/plugin here — a duplicate breaks runtime init.
  };
};
