import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import {
  ActivityIndicator,
  Icon,
  IconProps,
  IconWithLabel,
  Text,
} from '../../core-ui';
import { IconName } from '../../icons';
import { makeStyles, useTheme } from '../../theme';

type HeaderItemProps = Omit<TouchableOpacityProps, 'onPress'> &
  Pick<IconProps, 'color' | 'size'> & {
    left?: boolean;
    onPressItem: () => void;
    fontStyles?: StyleProp<TextStyle>;
    disabled?: boolean;
  } & (
    | {
        label: string;
        icon?: IconName;
        loading?: boolean;
      }
    | {
        label?: string;
        icon: IconName;
        loading?: boolean;
      }
  );

type LabelWithIcon = Omit<HeaderItemProps, 'icon' | 'label'> & {
  icon: IconName;
  label: string;
};

type IconOnlyProps = Omit<HeaderItemProps, 'icon'> & {
  icon: IconName;
};

type LabelOnlyProps = Omit<HeaderItemProps, 'icon'>;

function LabelWithIcon(props: LabelWithIcon) {
  const styles = useStyles();

  const { fontStyles, onPressItem, left, style, label, icon, ...otherProps } =
    props;

  return (
    <IconWithLabel
      label={label}
      icon={icon}
      fontStyle={[styles.label, fontStyles]}
      onPress={onPressItem}
      {...otherProps}
      style={[!left && styles.right, style]}
      testID="HeaderItem:IconWithLabel"
    />
  );
}

function IconOnly(props: IconOnlyProps) {
  const styles = useStyles();

  const { icon, onPressItem, left, style, size, color, ...otherProps } = props;

  return (
    <Icon
      name={icon}
      size={size}
      color={color}
      onPress={onPressItem}
      {...otherProps}
      style={[!left && styles.right, style]}
      testID="HeaderItem:IconOnly"
    />
  );
}

function LabelOnly(props: LabelOnlyProps) {
  const styles = useStyles();

  const { label, onPressItem, left, style, fontStyles, ...otherProps } = props;

  return (
    <TouchableOpacity
      onPress={onPressItem}
      {...otherProps}
      style={[!left && styles.right, style]}
      testID="HeaderItem:LabelOnly"
    >
      <Text style={[styles.label, fontStyles]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function HeaderItem(props: HeaderItemProps) {
  const styles = useStyles();
  const { colors } = useTheme();

  let {
    label = '',
    icon,
    loading = false,
    disabled = false,
    style,
    ...otherProps
  } = props;

  const itemStyle = [style, disabled && styles.opacityReduced];

  if (loading) {
    return <ActivityIndicator />;
  }

  if (label !== '' && icon) {
    return (
      <LabelWithIcon
        icon={icon}
        label={label}
        disabled={disabled}
        style={itemStyle}
        {...otherProps}
      />
    );
  }

  if (icon) {
    return (
      <IconOnly
        icon={icon}
        disabled={disabled}
        style={itemStyle}
        {...otherProps}
      />
    );
  }

  if (disabled) {
    return (
      <LabelOnly
        label={label}
        fontStyles={{ color: colors.headerCap }}
        style={itemStyle}
        disabled={disabled}
        {...otherProps}
      />
    );
  }

  return (
    <LabelOnly
      label={label}
      disabled={disabled}
      style={itemStyle}
      {...otherProps}
    />
  );
}

const useStyles = makeStyles(({ colors }) => ({
  right: {
    alignItems: 'flex-end',
  },
  label: {
    color: colors.primary,
  },
  opacityReduced: {
    opacity: 0.5,
  },
}));
