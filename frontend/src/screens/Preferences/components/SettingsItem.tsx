import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { Icon, Text } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = TouchableOpacityProps & {
  title: string;
  selected?: boolean;
};

export default function SettingsItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { title, selected, ...otherProps } = props;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.2}
      {...otherProps}
    >
      <Text>{title}</Text>
      {selected && (
        <View style={styles.content}>
          <TouchableOpacity activeOpacity={1}>
            <Icon name="Done" color={colors.textLighter} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    height: 52,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));
