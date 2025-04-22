import React from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { Icon } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
};

function BaseSearch(props: Props) {
  const { containerStyle, ...textInputProps } = props;
  const styles = useStyles();
  const { colors } = useTheme();
  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <Icon name="Search" color={colors.textLight} />
      <TextInput
        testID="Channel:Search:TextInput"
        style={styles.searchTextInput}
        placeholderTextColor={colors.textLight}
        keyboardType="visible-password" // To remove underline at every words on Android
        {...textInputProps}
      />
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing, fontSizes }) => ({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarker,
    borderRadius: 10,
    marginVertical: spacing.s,
    padding: spacing.m,
  },
  searchTextInput: {
    flex: 1,
    color: colors.textNormal,
    fontSize: fontSizes.m,
    paddingHorizontal: spacing.m,
  },
}));

let Search = React.memo(BaseSearch);
export default Search;
