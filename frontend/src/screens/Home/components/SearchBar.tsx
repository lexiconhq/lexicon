import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { IconWithLabel } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = Omit<TouchableOpacityProps, 'onPress'> & {
  placeholder: string;
  onPressSearch: () => void;
};

export function SearchBar(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { placeholder, onPressSearch, style, ...otherProps } = props;

  return (
    <IconWithLabel
      style={[styles.container, style]}
      label={placeholder}
      fontStyle={styles.input}
      icon="Search"
      color={colors.textLighter}
      onPress={() => onPressSearch()}
      {...otherProps}
    />
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    width: '100%',
    borderRadius: 4,
    padding: spacing.m,
    backgroundColor: colors.backgroundDarker,
  },
  input: {
    flex: 1,
    color: colors.textLighter,
  },
}));
