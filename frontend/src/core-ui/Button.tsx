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
    ...otherProps
  } = props;

  return (
    <TouchableOpacity
      disabled={loading || disabled}
      style={[
        styles.container,
        (loading || disabled) && styles.opacityReduced,
        large && styles.largeButton,
        style,
      ]}
      {...otherProps}
    >
      {loading && (
        <ActivityIndicator color="pureWhite" style={styles.spacingRight} />
      )}
      <Text variant="semiBold" color={textColor}>
        {content}
      </Text>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    backgroundColor: colors.primary,
    height: 36,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
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
