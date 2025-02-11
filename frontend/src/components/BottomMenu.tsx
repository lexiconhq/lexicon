import React from 'react';
import { Keyboard, Platform, ScrollView, View } from 'react-native';

import { Divider, Icon } from '../core-ui';
import { useStorage } from '../helpers';
import { makeStyles, useTheme } from '../theme';
import { useDevice } from '../utils';

type Props = {
  onInsertImage: () => void;
  onInsertLink: () => void;
  onInsertPoll?: () => void;
  onBold: () => void;
  onItalic: () => void;
  onQuote?: () => void;
  onBulletedList: () => void;
  onNumberedList: () => void;
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
    onBold,
    onItalic,
    onQuote,
    onBulletedList,
    onNumberedList,
    showLeftMenu = true,
  } = props;

  const ios = Platform.OS === 'ios';
  const { isTablet } = useDevice();

  const onHideKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View
      style={[
        styles.container,
        ios && isTablet ? styles.containerTablet : undefined,
      ]}
    >
      {showLeftMenu && (
        <ScrollView
          horizontal
          style={[styles.leftMenu, !ios && styles.marginBottom]}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          testID="BottomMenu:ScrollView"
        >
          <View style={styles.row}>
            <Icon
              name="BoldText"
              size="l"
              color={colors.textLighter}
              onPress={onBold}
              style={styles.iconButton}
              testID="BottomMenu:IconBold"
            />
            <Divider vertical />
            <Icon
              name="ItalicText"
              size="l"
              color={colors.textLighter}
              onPress={onItalic}
              style={styles.iconButton}
              testID="BottomMenu:IconItalic"
            />
            <Divider vertical />
            <Icon
              name="QuoteText"
              size="l"
              color={colors.textLighter}
              onPress={onQuote}
              style={styles.iconButton}
              testID="BottomMenu:IconQuote"
            />
            <Divider vertical />
            <Icon
              name="BulletList"
              size="l"
              color={colors.textLighter}
              onPress={onBulletedList}
              style={styles.iconButton}
              testID="BottomMenu:IconBulletList"
            />
            <Divider vertical />
            <Icon
              name="NumberList"
              size="l"
              color={colors.textLighter}
              onPress={onNumberedList}
              style={styles.iconButton}
              testID="BottomMenu:IconNumberList"
            />
            <Divider vertical />
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
              testID="BottomMenu:Link"
            />
            <Divider vertical />
            {onInsertPoll &&
            pollSetting?.allowPoll &&
            userTrustLevel &&
            pollSetting.pollCreateMinimumTrustLevel <= userTrustLevel ? (
              <Icon
                name="Chart"
                size="l"
                color={colors.textLighter}
                onPress={onInsertPoll}
                style={styles.iconButton}
                testID="BottomMenu:IconPoll"
              />
            ) : null}
            <Divider vertical />
          </View>
        </ScrollView>
      )}

      <View style={styles.rightMenu}>
        <View style={styles.row}>
          <Divider vertical />
          {ios ? (
            <Icon
              name="KeyboardHide"
              size="l"
              color={colors.textLighter}
              onPress={onHideKeyboard}
              style={styles.iconButton}
            />
          ) : null}
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
  containerTablet: {
    marginBottom: spacing.m,
  },
  marginBottom: { marginBottom: spacing.s },
  row: {
    flexDirection: 'row',
  },
  leftMenu: {
    flex: 1,
  },
  rightMenu: {
    alignItems: 'flex-end',
  },
  iconButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.l,
  },
}));
