import React from 'react';
import { View, ViewProps } from 'react-native';

import { makeStyles, Spacing, useTheme } from '../theme';

type Props = ViewProps & {
  vertical?: boolean;
  horizontalSpacing?: Spacing;
  verticalSpacing?: Spacing;
  leftSpacing?: Spacing;
  rightSpacing?: Spacing;
  topSpacing?: Spacing;
  bottomSpacing?: Spacing;
  startSpacing?: Spacing;
  endSpacing?: Spacing;
};

export function Divider({
  vertical = false,
  horizontalSpacing,
  verticalSpacing,
  leftSpacing,
  rightSpacing,
  topSpacing,
  bottomSpacing,
  startSpacing,
  endSpacing,
  style,
  ...otherProps
}: Props) {
  const styles = useStyles();
  const { spacing } = useTheme();

  const margin = {
    marginHorizontal: horizontalSpacing && spacing[horizontalSpacing],
    marginVertical: verticalSpacing && spacing[verticalSpacing],
    marginLeft: leftSpacing && spacing[leftSpacing],
    marginRight: rightSpacing && spacing[rightSpacing],
    marginTop: topSpacing && spacing[topSpacing],
    marginBottom: bottomSpacing && spacing[bottomSpacing],
    marginStart: startSpacing && spacing[startSpacing],
    marginEnd: endSpacing && spacing[endSpacing],
  };

  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { ...margin },
        style,
      ]}
      {...otherProps}
    />
  );
}

const useStyles = makeStyles(({ colors }) => ({
  horizontal: {
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  vertical: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
}));
