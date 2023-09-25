module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', { allowUndefined: true }],
      /**
       * Reanimated plugin has to be listed last
       * Added to avoid this error
       * `Export namespace should be first transformed by @babel/plugin-proposal-export-namespace-from`
       * and as suggested in the docs
       * https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin
       */
      'react-native-reanimated/plugin',
    ],
  };
};
