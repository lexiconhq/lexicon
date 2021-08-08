import React from 'react';
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { Text } from '../../core-ui';
import { makeStyles } from '../../theme';

type Props = TouchableOpacityProps & {
  label: string;
  isTop?: boolean;
  isBottom?: boolean;
  isCancelOption?: boolean;
};

export { Props as ActionSheetItemProps };

const ios = Platform.OS === 'ios';

export function ActionSheetItem(props: Props) {
  const styles = useStyles();

  const {
    label,
    onPress,
    disabled = false,
    isTop = false,
    isBottom = false,
    isCancelOption = false,
    style,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.container,
        style,
        disabled && styles.disabled,
        ios && [
          isTop && styles.topRadius,
          isBottom && styles.bottomRadius,
          isCancelOption && styles.cancelButton,
        ],
      ]}
    >
      <Text
        size="l"
        color={ios ? 'primary' : 'pureBlack'}
        variant={!isCancelOption ? 'normal' : 'bold'}
        style={disabled && styles.disabled}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    backgroundColor: colors.lightActionSheetBackground,
    width: '100%',
    padding: spacing.xl,
    justifyContent: ios ? 'center' : 'flex-start',
    alignItems: ios ? 'center' : 'flex-start',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.grey,
    elevation: 5,
  },
  disabled: {
    opacity: 0.9,
  },
  topRadius: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bottomRadius: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cancelButton: {
    backgroundColor: colors.pureWhite,
    borderRadius: 12,
    marginTop: spacing.m,
  },
}));
