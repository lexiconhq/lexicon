import { reloadAsync } from 'expo-updates';
import React, { ReactNode } from 'react';
import { NativeModules, StyleSheet, View } from 'react-native';

import { SPACING } from '../constants';
import { Button, Icon, Text } from '../core-ui';

type Props = {
  children: ReactNode;
};
type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  restartApp = () => {
    if (__DEV__) {
      NativeModules.DevSettings.reload();
    } else {
      reloadAsync();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Icon name="WarningCircle" size="xxxl" />
          <Text style={styles.textErrorTitle} variant="semiBold" size="l">
            {t('Something Went Wrong')}
          </Text>
          <Text style={styles.textErrorDesc}>
            {t(
              'Sorry, an unexpected issue occurred. Please relaunch the app to continue.',
            )}
          </Text>
          <Button onPress={this.restartApp} content={t('Relaunch')} />
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: SPACING.xxl,
  },
  textErrorTitle: {
    marginBottom: SPACING.m,
  },
  textErrorDesc: {
    marginBottom: SPACING.xl,
    textAlign: 'center',
    lineHeight: 20,
  },
});
