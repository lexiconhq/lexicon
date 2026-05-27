import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { RSA } from 'react-native-rsa-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { getNormalizedUrlTemplate } from '../api/discourse-apollo-rest/utils';
import { CustomHeader, ModalHeader } from '../components';
import { discourseHost } from '../constants';
import { ActivityIndicator, Text } from '../core-ui';
import {
  encodeToBase64Token,
  errorHandlerAlert,
  extractAuthPayload,
  getAuthRedirectUrl,
  getDeviceId,
  isAuthRedirectAwaitingPayload,
  isAuthRedirectUrl,
  useStorage,
} from '../helpers';
import { useGetSiteSettings, usePushNotificationsToken } from '../hooks';
import { makeStyles } from '../theme';
import { StackNavProp, StackRouteProp } from '../types';
import { Group } from '../types/api';
import { useDevice, useRedirect } from '../utils';
import { useAuth } from '../utils/AuthProvider';

const KEY_SIZE = 4096;

function createNonce(): string {
  return Array.from(Crypto.getRandomBytes(16))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export default function AuthenticationWebView() {
  const styles = useStyles();
  const ios = Platform.OS === 'ios';
  const storage = useStorage();
  const { setTokenState } = useAuth();
  const { redirectPath, setRedirectPath, handleRedirect } = useRedirect();
  const { syncToken } = usePushNotificationsToken();
  const { reset, navigate } =
    useNavigation<StackNavProp<'AuthenticationWebView'>>();
  const route = useRoute<StackRouteProp<'AuthenticationWebView'>>();
  const eulaAccepted = route.params?.eulaAccepted === true;

  const [uri, setUri] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [setupError, setSetupError] = useState<string | null>(null);

  const authRedirect = getAuthRedirectUrl(discourseHost);
  const appName = Constants.expoConfig?.slug;
  const isCompletingAuthRef = useRef(false);
  const handledAuthUrlRef = useRef<string | null>(null);
  const insets = useSafeAreaInsets();
  const { isTablet } = useDevice();
  const useFullScreenAuthModal = Platform.OS === 'ios' && (Platform.isPad || isTablet);

  const discourseSessionPrefix = discourseHost.endsWith('/')
    ? discourseHost
    : `${discourseHost}/`;

  const injectedJavaScript = `(function() {
    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
      this.addEventListener('load', function() {
        if (!this.responseURL.startsWith('${discourseSessionPrefix}session')) {
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

  const finishLoginNavigation = useCallback(() => {
    reset({
      index: 0,
      routes: [
        {
          name: 'TabNav',
          state: { routes: [{ name: 'Home' }] },
        },
      ],
    });
  }, [reset]);

  const { getSiteSettings } = useGetSiteSettings({
    onCompleted: ({ site }) => {
      if (site.enableLexiconPushNotifications) {
        syncToken();
      }

      if (redirectPath) {
        finishLoginNavigation();
        handleRedirect();
        setRedirectPath('');
        return;
      }

      finishLoginNavigation();
    },
    onError: () => {
      isCompletingAuthRef.current = false;
      handledAuthUrlRef.current = null;
      errorHandlerAlert('Something wrong when login please try again');
      navigate('Welcome');
    },
    fetchPolicy: 'network-only',
  });

  const onLoginCompleted = (key: string) => {
    setTokenState(encodeToBase64Token(key));
    getSiteSettings();
  };

  const onErrorAuth = useCallback(() => {
    isCompletingAuthRef.current = false;
    handledAuthUrlRef.current = null;
    errorHandlerAlert('Something wrong when login please try again');
    navigate('Welcome');
  }, [navigate]);

  const completeAuthFromRedirect = useCallback(
    (url: string, options?: { allowInProgress?: boolean }) => {
      if (!privateKey || isCompletingAuthRef.current) {
        return false;
      }

      if (!isAuthRedirectUrl(url, authRedirect)) {
        return false;
      }

      const payloadParam = extractAuthPayload(url);
      if (!payloadParam) {
        // iPad often navigates to /auth_redirect before ?payload= is present.
        return options?.allowInProgress === true;
      }

      if (handledAuthUrlRef.current === url) {
        return true;
      }
      handledAuthUrlRef.current = url;
      isCompletingAuthRef.current = true;

      (async () => {
        try {
          let encryptedPayload = payloadParam;
          try {
            encryptedPayload = decodeURIComponent(payloadParam);
          } catch {
            encryptedPayload = payloadParam;
          }

          const decrypted = await RSA.decrypt(encryptedPayload, privateKey);
          const parsed = JSON.parse(decrypted) as { key?: string };
          if (!parsed.key) {
            throw new Error('Missing API key in auth payload');
          }

          onLoginCompleted(parsed.key);
        } catch {
          handledAuthUrlRef.current = null;
          onErrorAuth();
        }
      })();

      return true;
    },
    [authRedirect, onErrorAuth, privateKey],
  );

  useEffect(() => {
    if (!eulaAccepted) {
      navigate('Welcome');
      return;
    }

    const getClientID = async () => {
      const deviceId = await getDeviceId();
      return `${deviceId}-${Crypto.randomUUID()}`;
    };

    getClientID()
      .then((clientID) =>
        RSA.generateKeys(KEY_SIZE).then(({ public: publicKey, private: privateKey }) => {
          const params = new URLSearchParams({
            public_key: publicKey,
            client_id: clientID,
            application_name: appName || '',
            scopes: 'read,write',
            nonce: createNonce(),
            auth_redirect: authRedirect,
          });
          const authorizeUri = `${discourseHost}/user-api-key/new?${params.toString()}`;

          setUri(authorizeUri);
          setPrivateKey(privateKey);
        }),
      )
      .catch(() => {
        setSetupError(
          t(
            'Login setup failed. This app needs a development build (not Expo Go) for secure sign-in, or RSA native modules are unavailable on this device.',
          ),
        );
      });
  }, [appName, authRedirect, eulaAccepted, navigate]);

  useEffect(() => {
    if (!useFullScreenAuthModal) {
      return;
    }

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
    };
  }, [useFullScreenAuthModal]);

  if (!eulaAccepted) {
    return (
      <View style={[styles.flex, styles.container, styles.center]}>
        {ios ? <ModalHeader /> : <CustomHeader />}
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (setupError) {
    return (
      <View style={[styles.flex, styles.container]}>
        {ios ? <ModalHeader /> : <CustomHeader />}
        <View style={[styles.flex, styles.center, styles.errorPadding]}>
          <Text style={styles.errorText}>{setupError}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.flex, styles.container]}>
      {ios ? <ModalHeader /> : <CustomHeader />}
      {!uri ? (
        <View style={[styles.flex, styles.center]}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View
          style={[
            styles.flex,
            useFullScreenAuthModal && { paddingBottom: insets.bottom },
          ]}
        >
          <WebView
            style={styles.flex}
            source={{ uri }}
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          javaScriptEnabled
          domStorageEnabled
          injectedJavaScript={injectedJavaScript}
          originWhitelist={['https://*', 'http://*']}
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
          onShouldStartLoadWithRequest={(request) => {
            if (
              completeAuthFromRedirect(request.url, { allowInProgress: true })
            ) {
              return false;
            }
            return true;
          }}
          onNavigationStateChange={(navState) => {
            if (!navState.url || navState.loading) {
              return;
            }
            if (isAuthRedirectAwaitingPayload(navState.url, authRedirect)) {
              return;
            }
            completeAuthFromRedirect(navState.url);
          }}
          onError={(event) => {
            const { url, code } = event.nativeEvent;
            if (
              url &&
              (isAuthRedirectUrl(url, authRedirect) ||
                isAuthRedirectAwaitingPayload(url, authRedirect)) &&
              Platform.OS === 'ios'
            ) {
              return;
            }
            if (code === -1002 && isCompletingAuthRef.current) {
              return;
            }
          }}
        />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  flex: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: colors.background },
  errorPadding: { padding: spacing.xl },
  errorText: { textAlign: 'center' },
}));
