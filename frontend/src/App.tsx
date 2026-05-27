import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { client } from './api/client';
import { RequestError, Toast } from './components';
import ErrorBoundary from './components/ErrorBoundary';
import { FORM_DEFAULT_VALUES } from './constants';
import { StorageProvider } from './helpers';
import AppNavigator from './navigation/AppNavigator';
import { AppearanceProvider, ThemeProvider } from './theme';
import { NewPostForm } from './types';
import {
  DeviceProvider,
  ModalProvider,
  OngoingLikedTopicProvider,
  PushNotificationsProvider,
  RedirectProvider,
} from './utils';
import { AuthProvider } from './utils/AuthProvider';
import { BlockedUsersProvider } from './utils/BlockedUsersProvider';
import { HiddenWordsProvider } from './utils/HiddenWordsProvider';

if (__DEV__) {
  require('react-native-console-time-polyfill');
  // Reactotron is disabled: it imports XHRInterceptor removed in RN 0.81+ (Expo SDK 54).
  // To re-enable when using the desktop Reactotron app on a compatible setup, uncomment:
  // require('../reactotronConfig');
  // Based on react-native-reanimated documentation about warning https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#reduced-motion-setting-is-enabled-on-this-device
  LogBox.ignoreLogs([
    '[Reanimated] Reduced motion setting is enabled on this device.',
    'An error occurred in a responseTransformer:',
  ]);
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
      <DeviceProvider>
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
                                <BlockedUsersProvider>
                                  <HiddenWordsProvider>
                                    <FormProvider {...newPostMethods}>
                                      <AppNavigator />
                                    </FormProvider>
                                  </HiddenWordsProvider>
                                </BlockedUsersProvider>
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
      </DeviceProvider>
    </ApolloProvider>
  );
}
