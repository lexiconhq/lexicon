import React from 'react';
import { Platform, View, ViewProps } from 'react-native';

import { Icon, Text } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';
import { useDevice } from '../../../utils';

type Props = ViewProps & {
  title: string;
  onPressIconSideBar: () => void;
  onPressAdd: () => void;
  isShowIcon: boolean;
};

export function HomeTabletNavBar(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { isPortrait } = useDevice();

  const {
    title,
    onPressIconSideBar,
    onPressAdd,
    style,
    isShowIcon,
    ...otherProps
  } = props;

  const ios = Platform.OS === 'ios';

  return (
    <View style={[styles.container, style]} {...otherProps}>
      {isPortrait || (!isPortrait && isShowIcon) ? (
        <Icon
          name={ios ? 'SideBar' : 'SideBarAndroid'}
          onPress={onPressIconSideBar}
          color={colors.textNormal}
          size="xl"
        />
      ) : (
        <View style={styles.emptyIcon} />
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

const useStyles = makeStyles(({ colors, spacing, iconSizes }) => ({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: spacing.m,
  },
  titleText: {
    paddingEnd: spacing.m,
  },
  emptyIcon: {
    width: iconSizes.xl,
    height: iconSizes.xl,
  },
}));
