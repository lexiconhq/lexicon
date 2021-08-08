import React, { ReactElement } from 'react';
import { StyleProp, TextStyle, View, ViewProps } from 'react-native';

import { Text } from '../../core-ui';
import { makeStyles } from '../../theme';

type Props = ViewProps & {
  left?: ReactElement;
  right?: ReactElement;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
};

export function ModalHeader(props: Props) {
  const styles = useStyles();

  const { left, right, title, titleStyle, style, ...otherProps } = props;

  return (
    <>
      <View style={styles.draggable} />
      <View style={[styles.container, style]} {...otherProps}>
        <View style={styles.left}>{left}</View>
        {title && (
          <Text variant="semiBold" size="l" style={[styles.title, titleStyle]}>
            {title}
          </Text>
        )}
        <View style={styles.right}>{right}</View>
      </View>
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.background,
  },
  draggable: {
    alignSelf: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.m,
    height: 6,
    width: 24,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
}));
