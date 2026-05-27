import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { DEFAULT_COLOR_SCHEME, FIXED_COLOR_SCHEME } from '../constants';
import {
  ColorScheme,
  filterColorScheme,
  getSystemColorScheme,
  useStorage,
} from '../helpers';

type ContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
};

const Context = createContext<ContextValue | undefined>(undefined);

type Props = {
  children: ReactElement;
};

export function AppearanceProvider({ children }: Props) {
  const storage = useStorage();
  // TODO: Use Recoil for this?
  const fixedColorScheme = filterColorScheme(FIXED_COLOR_SCHEME);
  const storedColorScheme = storage.getItem('colorScheme');

  const [colorScheme, setColorSchemeState] = useState(() => {
    if (fixedColorScheme) {
      return fixedColorScheme;
    }
    if (storedColorScheme === 'no-preference') {
      return getSystemColorScheme();
    }
    if (storedColorScheme === 'light' || storedColorScheme === 'dark') {
      return storedColorScheme;
    }
    return DEFAULT_COLOR_SCHEME;
  });

  const setColorScheme = useCallback(
    (colorScheme: ColorScheme) => {
      storage.setItem('colorScheme', colorScheme);
      if (colorScheme === 'no-preference') {
        setColorSchemeState(getSystemColorScheme());
      } else {
        setColorSchemeState(colorScheme);
      }
    },
    [storage],
  );

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
    }),
    [colorScheme, setColorScheme],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useColorScheme() {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useColorScheme must be inside an AppearanceProvider');
  }

  return context;
}
