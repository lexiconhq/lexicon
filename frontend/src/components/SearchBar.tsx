import React from 'react';
import { TextInput, View, ViewProps } from 'react-native';

import { Icon } from '../core-ui';
import { IconSize, makeStyles, useTheme } from '../theme';

type Props = ViewProps & {
  iconSize?: IconSize;
  placeholder?: string;
  searchValue: string;
  onSearchValueChange: (searchValue: string) => void;
};

export function SearchBar(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    iconSize,
    placeholder,
    searchValue,
    onSearchValueChange,
    style,
    ...otherProps
  } = props;

  return (
    <View style={[styles.searchContainer, style]} {...otherProps}>
      <Icon name="Search" color={colors.textLighter} size={iconSize} />
      <TextInput
        style={styles.searchTextInput}
        value={searchValue}
        onChangeText={(value) => onSearchValueChange(value)}
        placeholder={placeholder}
        placeholderTextColor={colors.textLighter}
        autoCorrect={false}
      />
      {searchValue !== '' && (
        <Icon
          name="Cancel"
          color={colors.textLighter}
          onPress={() => onSearchValueChange('')}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, spacing }) => ({
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: colors.backgroundDarker,
    alignItems: 'center',
  },
  searchTextInput: {
    flex: 1,
    color: colors.textNormal,
    fontSize: fontSizes.m,
    paddingHorizontal: spacing.m,
    textDecorationLine: 'none',
  },
}));
