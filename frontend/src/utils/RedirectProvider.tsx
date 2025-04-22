import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { isChatOrThread, isPostOrMessageDetail } from '../constants';
import { navigateChatOrThread, navigatePostOrMessageDetail } from '../helpers';

import { useDevice } from './DeviceProvider';

type ContextValue = {
  redirectPath: string;
  setRedirectPath: (path: string) => void;
  handleRedirect: () => void;
};

const Context = createContext<ContextValue | undefined>(undefined);

type Props = {
  children: ReactElement;
};

export function RedirectProvider({ children }: Props) {
  const { isTablet, isTabletLandscape } = useDevice();
  const [redirectPath, setRedirect] = useState<string>('');

  const setRedirectPath = useCallback((path: string) => {
    setRedirect(path);
  }, []);

  const handleRedirect = useCallback(() => {
    const [route, ...pathParams] = redirectPath.split('/');

    if (isPostOrMessageDetail(route)) {
      navigatePostOrMessageDetail(
        route,
        pathParams,
        isTablet,
        isTabletLandscape,
      );
    } else if (isChatOrThread(route)) {
      navigateChatOrThread({ route, pathParams });
    }
  }, [isTablet, isTabletLandscape, redirectPath]);

  const value = useMemo(
    () => ({ redirectPath, setRedirectPath, handleRedirect }),
    [redirectPath, setRedirectPath, handleRedirect],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useRedirect() {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useRedirect must be inside a RedirectProvider');
  }

  return context;
}
