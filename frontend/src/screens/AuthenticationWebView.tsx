import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { RSA } from 'react-native-rsa-native';
import { WebView } from 'react-native-webview';

import { getNormalizedUrlTemplate } from '../api/discourse-apollo-rest/utils';
import { CustomHeader, ModalHeader } from '../components';
import { discourseHost } from '../constants';
import { ActivityIndicator } from '../core-ui';
import {
  encodeToBase64Token,
  errorHandlerAlert,
  getDeviceId,
  useStorage,
} from '../helpers';
import { useGetSiteSettings, usePushNotificationsToken } from '../hooks';
import { makeStyles } from '../theme';
import { StackNavProp } from '../types';
import { Group } from '../types/api';
import { useRedirect } from '../utils';
import { useAuth } from '../utils/AuthProvider';

const KEY_SIZE = 4096;

export default function AuthenticationWebView() {
  const styles = useStyles();
  const ios = Platform.OS === 'ios';
  const storage = useStorage();
  const { setTokenState } = useAuth();
  const { redirectPath, setRedirectPath, handleRedirect } = useRedirect();
  const { syncToken } = usePushNotificationsToken();
  const { reset, navigate } =
    useNavigation<StackNavProp<'AuthenticationWebView'>>();

  const [uri, setUri] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const authRedirect = discourseHost + '/auth_redirect';
  const appName = Constants.expoConfig?.slug;
  const injectedJavaScript = `(function() {
    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
      this.addEventListener('load', function() {
        if (!this.responseURL.startsWith('${
          discourseHost.endsWith('/') ? discourseHost : discourseHost + '/'
        }session')) {
          return;
        }
        
        try {
          const data = JSON.parse(this.responseText);
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        } catch (error) {
          console.log('Error parsing XHR JSON:', error);
        }
      });
      return originalXhrOpen.apply(this, arguments);
    };
  })();`;

  const { getSiteSettings } = useGetSiteSettings({
    onCompleted: ({ site }) => {
      reset({
        index: 0,
        routes: [
          {
            name: 'TabNav',
            state: { routes: [{ name: 'Home' }] },
          },
        ],
      });

      if (site.enableLexiconPushNotifications) {
        syncToken();
      }

      if (redirectPath) {
        handleRedirect();
        setRedirectPath('');
      }
    },
    fetchPolicy: 'network-only',
  });

  const onLoginCompleted = (key: string) => {
    setTokenState(encodeToBase64Token(key));
    getSiteSettings();
  };

  useEffect(() => {
    const getClientID = async () => {
      const deviceId = await getDeviceId();
      return `${deviceId}-${Crypto.randomUUID()}`;
    };

    getClientID().then((clientID) => {
      RSA.generateKeys(KEY_SIZE).then(
        ({ public: publicKey, private: privateKey }) => {
          const params = new URLSearchParams({
            public_key: publicKey,
            client_id: clientID,
            application_name: appName || '',
            scopes: 'read,write',
            nonce: Crypto.getRandomBytes(16).toString(),
            auth_redirect: authRedirect,
          });
          const uri = `${discourseHost}/user-api-key/new?${params.toString()}`;

          setUri(uri);
          setPrivateKey(privateKey);
        },
      );
    });
  }, [appName, authRedirect]);

  const onErrorAuth = () => {
    errorHandlerAlert('Something wrong when login please try again');
    navigate('Welcome');
  };

  return (
    <View style={[styles.flex, styles.container]}>
      {ios ? <ModalHeader /> : <CustomHeader />}
      {!uri ? (
        <View style={[styles.flex, styles.center]}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <WebView
          style={styles.flex}
          source={{ uri }}
          incognito
          originWhitelist={[discourseHost]}
          sharedCookiesEnabled={false}
          javaScriptEnabled={true}
          injectedJavaScript={injectedJavaScript}
          rend
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);

              if (!data.user) {
                return;
              }

              const {
                id,
                username,
                name,
                avatar_template,
                trust_level,
                groups,
              } = data.user;

              storage.setItem('user', {
                id,
                username,
                name: name ?? '',
                avatar: getNormalizedUrlTemplate({ path: avatar_template }),
                trustLevel: trust_level,
                groups: groups.map((group: Group) => group.name),
              });
            } catch {
              return;
            }
          }}
          onShouldStartLoadWithRequest={({ url }) => {
            if (!url.startsWith(authRedirect)) {
              return true;
            }

            // The URL format is 'discourse://auth_redirect?payload=[apiKey]'
            const apiKey = url.substring(url.indexOf('payload=') + 8);

            (async () => {
              let decrypted: string = '';

              try {
                decrypted = await RSA.decrypt(
                  decodeURIComponent(apiKey),
                  privateKey,
                );
              } catch (error) {
                onErrorAuth();
              }

              try {
                const { key } = JSON.parse(decrypted);
                if (!key) {
                  onErrorAuth();
                }

                onLoginCompleted(key);
              } catch (error) {
                onErrorAuth();
              }
            })();

            return false;
          }}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  flex: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: colors.background },
}));
