import React, { ReactElement } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { makeStyles, useTheme } from '../theme';

import { Dot } from './Dot';
import { Text } from './Text';

type Props = TouchableOpacityProps & {
  content: string;
  decorationColor?: string;
  large?: boolean;
  right?: ReactElement;
};

export function Chip(props: Props) {
  const styles = useStyles();
  const { spacing } = useTheme();

  const {
    content,
    decorationColor,
    large,
    right,
    style,
    ...otherProps
  } = props;

  const { onPress, onPressIn, onPressOut, onLongPress } = otherProps;

  const interactable =
    onPress !== undefined ||
    onPressIn !== undefined ||
    onPressOut !== undefined ||
    onLongPress !== undefined;

  return (
    <TouchableOpacity
      delayPressIn={150}
      disabled={!interactable}
      {...otherProps}
    >
      <View
        style={[
          styles.container,
          large && { height: 40, paddingHorizontal: spacing.xl },
          right && { paddingRight: spacing.m },
          style,
        ]}
      >
        {decorationColor ? (
          <Dot
            variant="small"
            color={decorationColor}
            style={{ marginRight: spacing.s }}
          />
        ) : null}
        <Text
          size={large ? 'm' : 's'}
          color={large ? 'textNormal' : 'textLight'}
        >
          {content}
        </Text>
        {right && <View style={{ paddingStart: spacing.m }}>{right}</View>}
      </View>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    borderColor: colors.border,
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: spacing.m,
  },
}));
