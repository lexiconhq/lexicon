import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Icon, Text } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = {
  label: string;
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function DateTimeButton(props: Props) {
  const { label, text, onPress, style } = props;
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={style}>
      <Text color="textLight" size="s">
        {label}
      </Text>
      <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <Text>{text}</Text>
        <Icon name="Triangle" color={colors.textNormal} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  buttonContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xl,
    paddingTop: spacing.m,
  },
  icon: {
    flex: 1,
    alignItems: 'flex-end',
  },
}));
