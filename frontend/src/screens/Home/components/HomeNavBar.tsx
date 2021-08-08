import React from 'react';
import { Platform, TouchableOpacity, View, ViewProps } from 'react-native';

import { Icon, Text } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = ViewProps & {
  title: string;
  onPressTitle: () => void;
  onPressAdd: () => void;
};

export function HomeNavBar(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { title, onPressTitle, onPressAdd, style, ...otherProps } = props;

  const ios = Platform.OS === 'ios';

  return (
    <View style={[styles.container, style]} {...otherProps}>
      <TouchableOpacity style={styles.title} onPress={() => onPressTitle()}>
        <Text style={styles.titleText} variant={'bold'} size="xl">
          {title}
        </Text>
        <Icon name="Triangle" color={colors.textNormal} size="m" />
      </TouchableOpacity>
      {ios && <Icon name="Add" onPress={onPressAdd} />}
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    paddingEnd: spacing.m,
  },
}));
