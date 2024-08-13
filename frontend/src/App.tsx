import React from 'react';
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
