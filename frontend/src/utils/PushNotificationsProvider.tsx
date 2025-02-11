import React, { createContext, ReactElement, useContext, useMemo } from 'react';

import {
  PushNotificationsPreferences,
  SetPnPreferences,
  usePushNotificationsPreferences,
} from '../hooks/rest/auth/usePushNotifications';

type ContextValue = {
  pushNotificationsPreferences: PushNotificationsPreferences;
  setPnPreferences: SetPnPreferences;
};

const Context = createContext<ContextValue | undefined>(undefined);

type Props = {
  children: ReactElement;
};

export function PushNotificationsProvider({ children }: Props) {
  let { pushNotificationsPreferences, setPnPreferences } =
    usePushNotificationsPreferences();

  const value = useMemo(
    () => ({
      pushNotificationsPreferences,
      setPnPreferences,
    }),
    [pushNotificationsPreferences, setPnPreferences],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePushNotificationsContext() {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error(
      'usePushNotificationsPreferences must be inside an PushNotificationsPreferencesProvider',
    );
  }

  return context;
}
