import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { FormProvider, useForm } from 'react-hook-form';

import { client } from './graphql/client';
import { StorageProvider } from './helpers';
import AppNavigator from './navigation/AppNavigator';
import { AppearanceProvider, ThemeProvider } from './theme';
import { RequestError, Toast } from './components';
import {
  ModalProvider,
  OngoingLikedTopicProvider,
  PushNotificationsProvider,
  RedirectProvider,
} from './utils';
import { AuthProvider } from './utils/AuthProvider';
import { NewPostForm } from './types';
import { NO_CHANNEL_FILTER_ID } from './constants';

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
  // required by https://github.com/andyearnshaw/Intl.js/issues/231

  if (Platform.OS === 'android') {
    // See https://github.com/expo/expo/issues/6536 for this issue.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-underscore-dangle
    if (typeof (Intl as any).__disableRegExpRestore === 'function') {
      // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
      (Intl as any).__disableRegExpRestore();
    }
  }
}
if (__DEV__) {
  require('react-native-console-time-polyfill');
}

export default function App() {
  const newPostMethods = useForm<NewPostForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      raw: '',
      tags: [],
      channelId: NO_CHANNEL_FILTER_ID,
      editPostId: undefined,
      editTopicId: undefined,
    },
  });

  return (
    <ApolloProvider client={client}>
      <StorageProvider>
        <PushNotificationsProvider>
          <SafeAreaProvider>
            <AppearanceProvider>
              <ThemeProvider>
                <>
                  <OngoingLikedTopicProvider>
                    <ModalProvider>
                      <RedirectProvider>
                        <RequestError>
                          <AuthProvider>
                            <FormProvider {...newPostMethods}>
                              <AppNavigator />
                            </FormProvider>
                          </AuthProvider>
                        </RequestError>
                      </RedirectProvider>
                    </ModalProvider>
                  </OngoingLikedTopicProvider>
                  <Toast />
                </>
              </ThemeProvider>
            </AppearanceProvider>
          </SafeAreaProvider>
        </PushNotificationsProvider>
      </StorageProvider>
    </ApolloProvider>
  );
}
