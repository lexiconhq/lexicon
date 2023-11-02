import React, { RefObject, useRef, useState } from 'react';
import {
  StyleProp,
  TextInput as BaseTextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { IconName } from '../icons';
import { IconSize, makeStyles, useTheme } from '../theme';

import { Divider } from './Divider';
import { Icon } from './Icon';
import { Text } from './Text';

type Props = Omit<TextInputProps, 'style'> & {
  label?: string;
  error?: boolean;
  rightIcon?: IconName;
  rightIconColor?: string;
  iconSize?: IconSize;
  onPressIcon?: () => void;
  errorMsg?: string;
  inputRef?: RefObject<BaseTextInput>;
  inputStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export { BaseTextInput as TextInputType };

export function TextInput(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    label,
    error = false,
    rightIcon,
    iconSize,
    errorMsg = '',
    onPressIcon,
    inputRef,
    inputStyle,
    style,
    secureTextEntry,
    rightIconColor,
    disabled,
    ...otherProps
  } = props;

  const defaultRef = useRef<BaseTextInput>(null);

  const [borderColor, setBorderColor] = useState(colors.border);

  const onPressLabel = () => {
    const finalRef = inputRef ? inputRef.current : defaultRef.current;
    finalRef?.focus();
  };

  return (
    <View style={style}>
      {label && (
        <Text
          size="s"
          color={error ? 'error' : 'textLight'}
          style={[styles.label, disabled && styles.disabled]}
          onPress={() => onPressLabel()}
        >
          {label}
        </Text>
      )}
      <View style={styles.rowInput}>
        <BaseTextInput
          ref={inputRef || defaultRef}
          placeholderTextColor={colors.darkTextLighter}
          onFocus={() => setBorderColor(colors.primary)}
          onEndEditing={() => setBorderColor(colors.border)}
          style={[styles.input, disabled && styles.disabled, inputStyle]}
          secureTextEntry={secureTextEntry}
          {...otherProps}
        />
        {rightIcon && (
          <Icon
            name={rightIcon}
            color={
              disabled || secureTextEntry
                ? colors.textLighter
                : rightIconColor || colors.primary
            }
            size={iconSize}
            onPress={onPressIcon}
          />
        )}
      </View>
      <Divider
        style={[
          styles.divider,
          { borderBottomColor: error ? colors.error : borderColor },
        ]}
      />
      {error && errorMsg !== '' && (
        <Text color="error" size="s" style={styles.error}>
          {errorMsg}
        </Text>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  label: {
    paddingBottom: spacing.m,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxHeight: 90,
  },
  input: {
    color: colors.textNormal,
    flexGrow: 1,
    fontSize: fontSizes.m,
  },
  divider: {
    flexGrow: 0,
    paddingTop: spacing.xl,
  },
  error: {
    paddingTop: spacing.m,
  },
  disabled: { color: colors.textLighter },
}));
