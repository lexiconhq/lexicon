import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { makeStyles } from '../theme';

import { Icon } from './Icon';

type Props = {
  children: ReactNode;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

export function RadioButton(props: Props) {
  const styles = useStyles();

  const { children, selected, disabled, onPress } = props;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {selected ? (
        <Icon name="CheckCircle" size="m" />
      ) : (
        <View style={styles.circle} />
      )}
      <View style={[styles.labelContainer, disabled && { opacity: 0.5 }]}>
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
  },
}));
