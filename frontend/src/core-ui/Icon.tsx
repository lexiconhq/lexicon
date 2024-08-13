import React from 'react';
import {
  Insets,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

import { Icons, IconName } from '../icons';
import { IconSize, useTheme } from '../theme';

type Props = {
  color?: string;
  name: IconName;
  onPress?: () => void;
  size?: IconSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  hitSlop?: Insets | null | number;
} & Pick<TouchableOpacityProps, 'testID'>;

export { Props as IconProps };

export function Icon(props: Props) {
  const { colors, iconSizes } = useTheme();

  const {
    color = colors.primary,
    name,
    onPress,
    size = 'l',
    disabled = false,
    style,
    hitSlop,
    testID,
  } = props;

  const Icon = Icons[name];
  const icon = (
    <Icon width={iconSizes[size]} height={iconSizes[size]} color={color} />
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={style}
        onPress={onPress}
        disabled={disabled}
        hitSlop={hitSlop}
        testID={testID}
      >
        {icon}
      </TouchableOpacity>
    );
  } else {
    return <View style={style}>{icon}</View>;
  }
}
