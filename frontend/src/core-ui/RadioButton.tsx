import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { makeStyles, useTheme } from '../theme';

import { Icon } from './Icon';

type Props = {
  children: ReactNode;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  checkCircleIcon?: boolean;
  inactiveOpacity?: number;
};

export function RadioButton(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    children,
    selected,
    disabled,
    onPress,
    style,
    checkCircleIcon,
    inactiveOpacity = 0.5,
  } = props;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {selected ? (
        checkCircleIcon ? (
          <Icon
            name="CheckCircle"
            size="m"
            color={disabled ? colors.lightTextDarkest : colors.primary}
          />
        ) : (
          <View
            style={[
              styles.circle,
              disabled ? styles.circleInactive : styles.circleActive,
            ]}
          >
            <View
              style={[
                styles.innerCircle,
                disabled
                  ? styles.innerCircleInactive
                  : styles.innerCircleActive,
              ]}
            />
          </View>
        )
      ) : (
        <View style={styles.circle} />
      )}
      <View
        style={[
          styles.labelContainer,
          disabled && { opacity: inactiveOpacity },
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.xl,
    width: '100%',
  },
  labelContainer: {
    flex: 1,
    marginLeft: spacing.m,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    margin: 4,
  },
  circleActive: { borderColor: colors.primary },
  circleInactive: { borderColor: colors.lightTextDarkest },
  innerCircleActive: { backgroundColor: colors.primary },
  innerCircleInactive: { backgroundColor: colors.lightTextDarkest },
}));
