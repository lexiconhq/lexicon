import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { Color, makeStyles } from '../theme';

import { ActivityIndicator } from './ActivityIndicator';
import { Text } from './Text';

type Props = TouchableOpacityProps & {
  content: string;
  large?: boolean;
  loading?: boolean;
  textColor?: Color;
  outline?: boolean;
};

export function Button(props: Props) {
  const styles = useStyles();

  const {
    content,
    large = false,
    loading = false,
    textColor = 'pureWhite',
    disabled,
    style,
    outline,
    ...otherProps
  } = props;

  return (
    <TouchableOpacity
      disabled={loading || disabled}
      style={[
        styles.container,
        (loading || disabled) && styles.opacityReduced,
        large && styles.largeButton,
        outline ? styles.outline : styles.default,
        style,
      ]}
      {...otherProps}
    >
      {loading && (
        <ActivityIndicator color="pureWhite" style={styles.spacingRight} />
      )}
      <Text variant="semiBold" color={outline ? 'textNormal' : textColor}>
        {content}
      </Text>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    height: 36,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
  },
  default: { backgroundColor: colors.primary },
  outline: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spacingRight: {
    paddingRight: spacing.xl,
  },
  opacityReduced: {
    opacity: 0.75,
  },
  largeButton: {
    height: 44,
    paddingHorizontal: 0,
  },
}));
