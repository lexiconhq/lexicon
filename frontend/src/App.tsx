import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';

import { client } from './graphql/client';
import { StorageProvider } from './helpers';
import AppNavigator from './navigation/AppNavigator';
import { AppearanceProvider, ThemeProvider } from './theme';
import { ModalProvider, OngoingLikedTopicProvider } from './utils';
import { RequestError, Toast } from './components';

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
  return (
    <>
      <ApolloProvider client={client}>
        <StorageProvider>
          <SafeAreaProvider>
            <AppearanceProvider>
              <ThemeProvider>
                <>
                  <OngoingLikedTopicProvider>
                    <ModalProvider>
                      <RequestError>
                        <AppNavigator />
                      </RequestError>
                    </ModalProvider>
                  </OngoingLikedTopicProvider>
                  <Toast />
                </>
              </ThemeProvider>
            </AppearanceProvider>
          </SafeAreaProvider>
        </StorageProvider>
      </ApolloProvider>
    </>
  );
}
