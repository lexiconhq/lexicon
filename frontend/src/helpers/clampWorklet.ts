/**
 * This is made for reanimated2 hence the 'worklet' keyword
 * It will run on UI thread instead of JS thread
 * more info on https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/worklets/
 */
export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number,
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};
