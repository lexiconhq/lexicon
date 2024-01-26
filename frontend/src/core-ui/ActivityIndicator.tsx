import React from 'react';
import {
  ActivityIndicator as BaseActivityIndicator,
  ActivityIndicatorProps,
} from 'react-native';

import { Color, useTheme } from '../theme';

type Props = ActivityIndicatorProps & {
  color?: Color;
};

export function ActivityIndicator(props: Props) {
  const { colors } = useTheme();

  const { color = 'loading', ...otherProps } = props;
  const indicatorColor = colors[color];

  return <BaseActivityIndicator color={indicatorColor} {...otherProps} />;
}
