import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Text } from '../core-ui';
import { makeStyles } from '../theme';

type Props = {
  type: 'warning' | 'success' | 'error' | 'info';
  title?: string;
  message: string;
  style?: StyleProp<ViewStyle>;
};

export function AlertBanner(props: Props) {
  const styles = useStyles();
  const { message, type, title, style } = props;
  const alertColor = () => {
    switch (type) {
      case 'warning':
        return {
          background: styles.warningBackground,
          text: styles.warningText,
        };
      case 'success':
        return {
          background: styles.successBackground,
          text: styles.successText,
        };
      case 'error':
        return {
          background: styles.errorBackground,
          text: styles.errorText,
        };
      case 'info':
        return {
          background: styles.infoBackground,
          text: styles.infoText,
        };
    }
  };

  return (
    <View style={[styles.bannerContainer, alertColor().background, style]}>
      {title && (
        <Text style={alertColor().text} variant="semiBold" size="s">
          {title}
        </Text>
      )}
      <Text style={alertColor().text} size="s">
        {message}
      </Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  bannerContainer: {
    borderRadius: spacing.m,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  warningBackground: { backgroundColor: colors.alertWarningBackground },
  warningText: { color: colors.alertWarningText },
  successBackground: { backgroundColor: colors.alertSuccessBackground },
  successText: { color: colors.alertSuccessText },
  errorBackground: { backgroundColor: colors.alertErrorBackground },
  errorText: { color: colors.alertErrorText },
  infoBackground: { backgroundColor: colors.alertInfoBackground },
  infoText: { color: colors.alertInfoText },
}));
