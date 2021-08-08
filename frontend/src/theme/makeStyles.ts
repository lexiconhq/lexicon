import { useMemo } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { Theme } from './theme';
import { useTheme } from './ThemeProvider';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

type Creator<T> = (theme: Theme) => T;

export function makeStyles<T extends NamedStyles<T>>(
  stylesOrCreator: T | Creator<T>,
) {
  let creator: Creator<T> =
    typeof stylesOrCreator === 'function'
      ? stylesOrCreator
      : (_: Theme) => stylesOrCreator;

  let useStyles = () => {
    let theme = useTheme();
    return useMemo(() => StyleSheet.create(creator(theme)), [theme]);
  };

  return useStyles;
}
