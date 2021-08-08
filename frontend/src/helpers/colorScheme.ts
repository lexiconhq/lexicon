import { Appearance } from 'react-native-appearance';

export type ColorScheme = 'light' | 'dark' | 'no-preference';

export function filterColorScheme(colorScheme: ColorScheme | null | undefined) {
  if (colorScheme && colorScheme !== 'no-preference') {
    return colorScheme;
  }
}

export function getSystemColorScheme(): ColorScheme {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}
