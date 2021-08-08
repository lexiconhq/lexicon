import React, { createContext, ReactElement, useContext, useMemo } from 'react';
import { Platform } from 'react-native';

import { useColorScheme } from './AppearanceProvider';
import { getTheme, Theme } from './theme';

const Context = createContext<Theme | undefined>(undefined);

type Props = {
  children: ReactElement;
};

export function ThemeProvider({ children }: Props) {
  const { colorScheme } = useColorScheme();

  const theme = useMemo(
    () =>
      getTheme({
        colorScheme,
        // TODO: Allow a way to switch aesthetic for testing.
        aesthetic: Platform.OS === 'ios' ? 'ios' : 'android',
      }),
    [colorScheme],
  );

  return <Context.Provider value={theme}>{children}</Context.Provider>;
}

export function useTheme() {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useTheme must be inside a ThemeProvider');
  }

  return context;
}
