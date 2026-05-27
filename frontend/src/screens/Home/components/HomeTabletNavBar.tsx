import React from 'react';
import { Platform, View, ViewProps } from 'react-native';

import { Icon, Text } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = ViewProps & {
  title: string;
  onPressIconSideBar: () => void;
  onPressAdd: () => void;
  showSidebarToggle?: boolean;
};

export function HomeTabletNavBar(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const {
    title,
    onPressIconSideBar,
    onPressAdd,
    showSidebarToggle = true,
    style,
    ...otherProps
  } = props;

  const ios = Platform.OS === 'ios';

  return (
    <View style={[styles.container, style]} {...otherProps}>
      {showSidebarToggle ? (
        <Icon
          name={ios ? 'SideBar' : 'SideBarAndroid'}
          onPress={onPressIconSideBar}
          color={colors.primary}
          size="xl"
        />
      ) : (
        <View style={styles.togglePlaceholder} />
      )}
      <Text style={styles.titleText} variant={'semiBold'} size="l">
        {title}
      </Text>
      {ios ? (
        <Icon name="Add" onPress={onPressAdd} testID="HomeNavBar:Icon:Add" />
      ) : (
        <View />
      )}
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
    paddingTop: spacing.m,
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: spacing.m,
  },
  togglePlaceholder: {
    width: 28,
    height: 28,
  },
}));
