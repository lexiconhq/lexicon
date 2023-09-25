import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { MutationHookOptions } from '@apollo/client';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import {
  PushNotificationsMutation,
  PushNotificationsMutationVariables,
  PushNotificationsDocument,
} from '../../generated/server';
import { useMutation } from '../../utils/useMutation';
import {
  getExpoPushTokenHandler,
  pushNotificationsSetupFailAlert,
  useStorage,
} from '../../helpers';
import { DEFAULT_NOTIFICATION_BEHAVIOUR } from '../../constants';
import { getExperienceId } from '../../helpers/experienceId';

export function usePushNotificationsToken() {
  const mutatePushNotifications = usePushNotificationsMutation();
  const syncToken = useCallback(async () => {
    const { success, token } = await getExpoPushTokenHandler();
    if (!success) {
      return;
    }
    mutatePushNotifications?.mutatePushNotifications(token);
  }, [mutatePushNotifications]);

  return { syncToken };
}

export function usePushNotificationsMutation(
  options?: MutationHookOptions<
    PushNotificationsMutation,
    PushNotificationsMutationVariables
  >,
) {
  const [mutate, { loading, error }] = useMutation<
    PushNotificationsMutation,
    PushNotificationsMutationVariables
  >(PushNotificationsDocument, {
    ...options,
  });

  /**
   * According to the Expo documentation, the experienceID format contains `<username>/<slug>`. For the username, it uses your Expo account username, and for the slug, it uses the slug of your app from the `app.json` file.
   * To configure the experienceID, you can modify the value in the `app.json` file under currentFullName. Simply update the value based on your app.
   */

  const mutatePushNotifications = (expoToken: string) => {
    const experienceIdResult = getExperienceId();
    if (!experienceIdResult.success) {
      pushNotificationsSetupFailAlert();
      return;
    }

    const defaultVariable = {
      applicationName: Constants.expoConfig?.name ?? 'Lexicon Mobile App',
      experienceId: experienceIdResult.result,
      platform: Platform.OS,
    };

    mutate({
      variables: {
        ...defaultVariable,
        PushNotificationsToken: expoToken,
      },
    });
  };

  return { mutatePushNotifications, loading, error };
}

export type PushNotificationsPreferences = {
  shouldShowAlert: boolean;
  shouldPlaySound: boolean;
  shouldSetBadge: boolean;
};

export type SetPnPreferences = (params: {
  key: keyof PushNotificationsPreferences;
  active: boolean;
}) => void;

export function usePushNotificationsPreferences() {
  const storage = useStorage();

  const cachedPushNotificationsPreferences =
    storage.getItem('pushNotifications');

  const [pushNotificationsPreferences, setPushNotificationsPreferences] =
    useState<PushNotificationsPreferences>({
      ...DEFAULT_NOTIFICATION_BEHAVIOUR,
      ...cachedPushNotificationsPreferences,
    });

  useEffect(() => {
    storage.setItem('pushNotifications', pushNotificationsPreferences);
    Notifications.setNotificationHandler({
      handleNotification: async () => DEFAULT_NOTIFICATION_BEHAVIOUR,
    });
  }, [pushNotificationsPreferences, storage]);

  const setPnPreferences = useCallback<SetPnPreferences>(
    ({ key, active }) => {
      setPushNotificationsPreferences({
        ...pushNotificationsPreferences,
        [key]: active,
      });
    },
    [pushNotificationsPreferences],
  );

  return {
    pushNotificationsPreferences,
    setPnPreferences,
  };
}
