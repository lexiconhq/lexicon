import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { Text } from '../../core-ui';
import { Color, makeStyles, useTheme } from '../../theme';

export type ActionSheetItemVariant = 'default' | 'destructive' | 'cancel';

type Props = TouchableOpacityProps & {
  label: string;
  variant?: ActionSheetItemVariant;
  isTop?: boolean;
  isBottom?: boolean;
  isCancelOption?: boolean;
};

export { Props as ActionSheetItemProps };

const ios = Platform.OS === 'ios';

export function ActionSheetItem(props: Props) {
  const { colors } = useTheme();
  const styles = useStyles();

  const {
    label,
    variant = 'default',
    onPress,
    disabled = false,
    isTop = false,
    isBottom = false,
    isCancelOption = false,
    style,
  } = props;

  const resolvedVariant: ActionSheetItemVariant = isCancelOption
    ? 'cancel'
    : variant;

  const labelColor: Color =
    resolvedVariant === 'destructive'
      ? 'error'
      : resolvedVariant === 'cancel'
      ? 'textNormal'
      : 'primary';

  const labelVariant =
    resolvedVariant === 'destructive' || resolvedVariant === 'cancel'
      ? 'semiBold'
      : 'normal';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        resolvedVariant === 'cancel'
          ? styles.cancelContainer
          : styles.actionContainer,
        ios && resolvedVariant !== 'cancel' && [
          isTop && styles.topRadius,
          isBottom && styles.bottomRadius,
          !isBottom && styles.itemSeparator,
        ],
        ios &&
          resolvedVariant === 'cancel' && [
            styles.cancelRadius,
            { backgroundColor: colors.background },
          ],
        style,
        disabled && styles.disabled,
      ]}
    >
      <Text
        size="l"
        color={labelColor}
        variant={labelVariant}
        style={disabled && styles.disabled}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    width: '100%',
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 52,
  },
  actionContainer: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  itemSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  cancelContainer: {
    borderWidth: 0,
    marginTop: spacing.s,
  },
  disabled: {
    opacity: 0.45,
  },
  topRadius: {
    borderTopWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bottomRadius: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cancelRadius: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
}));
