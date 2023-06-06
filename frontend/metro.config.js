// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config');

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
defaultConfig.resolver.sourceExts.push('svg');
module.exports = defaultConfig;
