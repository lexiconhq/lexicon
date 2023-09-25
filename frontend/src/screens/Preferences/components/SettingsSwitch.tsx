import React from 'react';
import { View, ViewProps } from 'react-native';
import { Switch } from 'react-native-gesture-handler';

import { Text } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = ViewProps & {
  title: string;
  isEnabled: boolean;
  onSwitch?: (value: boolean) => void;
};

export default function SettingsSwitch(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { title, isEnabled, onSwitch, ...otherProps } = props;

  return (
    <View style={styles.container} {...otherProps}>
      <Text>{title}</Text>
      <View style={styles.content}>
        <Switch
          trackColor={{ false: colors.grey, true: colors.grey }}
          thumbColor={isEnabled ? colors.activeTab : colors.inactiveTab}
          ios_backgroundColor={colors.grey}
          onValueChange={(value) => onSwitch?.(value)}
          value={isEnabled}
        />
      </View>
    </View>
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
