import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { isPostOrMessageDetail } from '../constants';
import { navigatePostOrMessageDetail } from '../helpers';

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
  const [redirectPath, setRedirect] = useState<string>('');

  const setRedirectPath = useCallback((path: string) => {
    setRedirect(path);
  }, []);

  const handleRedirect = useCallback(() => {
    const [route, ...pathParams] = redirectPath.split('/');

    if (isPostOrMessageDetail(route)) {
      navigatePostOrMessageDetail(route, pathParams);
    }
  }, [redirectPath]);

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
