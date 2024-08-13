/* eslint-disable @typescript-eslint/no-var-requires */

const { getDefaultConfig } = require('expo/metro-config');
const defaultSourceExts =
  require('metro-config/src/defaults/defaults').sourceExts;

const defaultConfig = getDefaultConfig(__dirname);
const {
  transformer,
  resolver: { assetExts },
} = defaultConfig;

defaultConfig.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
defaultConfig.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');
(defaultConfig.resolver.sourceExts =
  process.env.DETOX_TESTS === 'true'
    ? ['mock.ts', 'mock.tsx', ...defaultSourceExts]
    : defaultSourceExts),
  defaultConfig.resolver.sourceExts.push('svg');

module.exports = defaultConfig;
