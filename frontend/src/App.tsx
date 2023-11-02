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
import { FORM_DEFAULT_VALUES } from './constants';
import ErrorBoundary from './components/ErrorBoundary';

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
    defaultValues: FORM_DEFAULT_VALUES,
  });

  /**
   * Error Boundary is inside the ThemeProvider because we need to use the core UI, which relies on the theme provided by the ThemeProvider.
   */

  return (
    <ApolloProvider client={client}>
      <StorageProvider>
        <PushNotificationsProvider>
          <SafeAreaProvider>
            <AppearanceProvider>
              <ThemeProvider>
                <ErrorBoundary>
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
                </ErrorBoundary>
              </ThemeProvider>
            </AppearanceProvider>
          </SafeAreaProvider>
        </PushNotificationsProvider>
      </StorageProvider>
    </ApolloProvider>
  );
}
