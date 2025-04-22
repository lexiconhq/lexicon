import React from 'react';
import { View, ViewProps } from 'react-native';

import { makeStyles, useTheme } from '../theme';

const dotVariant = {
  extraLarge: {
    size: 12,
    padding: 4,
  },
  large: {
    size: 10,
    padding: 3,
  },
  normal: {
    size: 9,
    padding: 1.5,
  },
  small: {
    size: 6,
    padding: 1,
  },
};

type Props = ViewProps & {
  color?: string;
  variant?: keyof typeof dotVariant;
};

export function Dot(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    variant = 'normal',
    color = colors.primary,
    style,
    ...otherProps
  } = props;

  return (
    <View style={{ padding: dotVariant[variant].padding }}>
      <View
        style={[
          styles.circle,
          {
            backgroundColor: color,
            width: dotVariant[variant].size,
            height: dotVariant[variant].size,
          },
          style,
        ]}
        {...otherProps}
      />
    </View>
  );
}

const useStyles = makeStyles(() => ({
  circle: {
    borderRadius: 100,
  },
}));
