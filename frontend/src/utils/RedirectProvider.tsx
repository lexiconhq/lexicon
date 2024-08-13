import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  DeepRoutes,
  isEmailLoginOrActivateAccount,
  isPostOrMessageDetail,
} from '../constants';
import { navigatePostOrMessageDetail } from '../helpers';
import { reset } from '../navigation/NavigationService';

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
    } else if (isEmailLoginOrActivateAccount(route)) {
      reset({
        index: 0,
        routes: [
          {
            name: 'Login',
            params: {
              emailToken: pathParams[0],
              isActivateAccount: route === DeepRoutes['activate-account'],
            },
          },
        ],
      });
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
