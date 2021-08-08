import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import { IconName } from '../icons';
import { makeStyles } from '../theme';

import { Icon, IconProps } from './Icon';
import { Text } from './Text';

type Props = TouchableOpacityProps &
  Pick<IconProps, 'size' | 'color'> & {
    label: string;
    icon: IconName;
    fontStyle?: StyleProp<TextStyle>;
    numberOfLines?: number;
  };

export { Props as IconWithLabelProps };

export function IconWithLabel(props: Props) {
  const styles = useStyles();

  const {
    label,
    icon,
    size,
    color,
    fontStyle,
    onPress,
    numberOfLines,
    style,
    ...otherProps
  } = props;

  const content = (
    <>
      <Icon name={icon} size={size} color={color} />
      <Text style={[styles.text, fontStyle]} numberOfLines={numberOfLines}>
        {label}
      </Text>
    </>
  );

  return onPress ? (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      {...otherProps}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={[styles.container, style]}>{content}</View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingLeft: spacing.m,
    flexGrow: 1,
  },
}));
