/* eslint-disable @typescript-eslint/no-var-requires */

const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {
  transformer,
  resolver: { assetExts, sourceExts: defaultSourceExts },
} = defaultConfig;

defaultConfig.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
defaultConfig.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');
const baseSourceExts =
  process.env.DETOX_TESTS === 'true'
    ? ['mock.ts', 'mock.tsx', ...defaultSourceExts]
    : defaultSourceExts;

defaultConfig.resolver.sourceExts = [
  ...baseSourceExts,
  'expo.ts',
  'expo.tsx',
  'expo.js',
  'expo.jsx',
  'wasm',
  'svg',
];

// Worklets init order can break when inlineRequires is off (Reanimated #8904).
const existingGetTransformOptions = defaultConfig.transformer?.getTransformOptions;
defaultConfig.transformer.getTransformOptions = async () => {
  const base = existingGetTransformOptions
    ? await existingGetTransformOptions()
    : {};
  return {
    ...base,
    transform: {
      ...base.transform,
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  };
};

module.exports = defaultConfig;
