import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { ActivityIndicator, Dot, Icon, IconWithLabel } from '../../../core-ui';
import { IconName } from '../../../icons';
import { makeStyles, useTheme } from '../../../theme';

type Props = TouchableOpacityProps & {
  title: string;
  iconName: IconName;
  iconColor?: string;
  indicator?: boolean;
  loading?: boolean;
};

export default function MenuItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    title,
    iconName,
    iconColor,
    indicator = false,
    loading,
    disabled,
    ...otherProps
  } = props;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.2}
      disabled={disabled || loading}
      {...otherProps}
    >
      <IconWithLabel
        label={title}
        icon={iconName}
        color={iconColor}
        fontStyle={styles.label}
        activeOpacity={1}
      />
      <View style={styles.content}>
        {indicator && <Dot />}
        {loading && <ActivityIndicator />}
        <TouchableOpacity activeOpacity={1}>
          <Icon name="ChevronRight" color={colors.textLighter} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
  },
  label: {
    paddingLeft: spacing.xl,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));
