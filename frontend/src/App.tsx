import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';

import { client } from './graphql/client';
import { StorageProvider } from './helpers';
import AppNavigator from './navigation/AppNavigator';
import { AppearanceProvider, ThemeProvider } from './theme';
import { ModalProvider, PostProvider } from './utils';

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <StorageProvider>
        <SafeAreaProvider>
          <AppearanceProvider>
            <ThemeProvider>
              <PostProvider>
                <ModalProvider>
                  <AppNavigator />
                </ModalProvider>
              </PostProvider>
            </ThemeProvider>
          </AppearanceProvider>
        </SafeAreaProvider>
      </StorageProvider>
    </ApolloProvider>
  );
}
