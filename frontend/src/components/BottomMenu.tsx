import React from 'react';
import { Keyboard, Platform, View } from 'react-native';

import { Divider, Icon } from '../core-ui';
import { makeStyles, useTheme } from '../theme';
import { useStorage } from '../helpers';

type Props = {
  onInsertImage: () => void;
  onInsertLink: () => void;
  onInsertPoll?: () => void;
  showLeftMenu?: boolean;
};

export function BottomMenu(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const storage = useStorage();
  const pollSetting = storage.getItem('poll');
  const userTrustLevel = storage.getItem('user')?.trustLevel;

  const {
    onInsertImage,
    onInsertLink,
    onInsertPoll,
    showLeftMenu = true,
  } = props;

  const ios = Platform.OS === 'ios';

  const onHideKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {showLeftMenu && (
        <View style={styles.leftMenu}>
          <View style={styles.row}>
            <Icon
              name="Photo"
              size="l"
              color={colors.textLighter}
              onPress={onInsertImage}
              style={styles.iconButton}
            />
            <Divider vertical />
            <Icon
              name="Link"
              size="l"
              color={colors.textLighter}
              onPress={onInsertLink}
              style={styles.iconButton}
            />
            <Divider vertical />
            {onInsertPoll &&
              pollSetting?.allowPoll &&
              userTrustLevel &&
              pollSetting.pollCreateMinimumTrustLevel <= userTrustLevel && (
                <Icon
                  name="Chart"
                  size="l"
                  color={colors.textLighter}
                  onPress={onInsertPoll}
                  style={styles.iconButton}
                />
              )}
            <Divider vertical />
          </View>
        </View>
      )}

      <View style={styles.rightMenu}>
        <View style={styles.row}>
          <Divider vertical />
          {ios && (
            <Icon
              name="KeyboardHide"
              size="l"
              color={colors.textLighter}
              onPress={onHideKeyboard}
              style={styles.iconButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, shadow, spacing }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    alignItems: 'stretch',
    ...shadow,
  },
  row: {
    flexDirection: 'row',
  },
  leftMenu: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightMenu: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.l,
  },
}));
