import Constants from 'expo-constants';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  isNoChannelFilter,
  NO_CHANNEL_FILTER,
  NO_CHANNEL_FILTER_ID,
} from '../../constants';
import { SIDE_BAR_WIDTH } from '../../constants/layout';
import { Icon, Text } from '../../core-ui';
import { useStorage } from '../../helpers';
import { makeStyles, useTheme } from '../../theme';

import ChannelItem from './Components/ChannelItem';

type Props = {
  setSelectedChannelId: (id: number) => void;
  hideSideBar: () => void;
  /** Side-by-side tablet drawer: align header with home nav, hide duplicate toggle. */
  embeddedInDrawer?: boolean;
  showToggle?: boolean;
};

export default function ChannelSideBarContent(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    setSelectedChannelId,
    hideSideBar,
    embeddedInDrawer = false,
    showToggle = true,
  } = props;

  const ios = Platform.OS === 'ios';

  const storage = useStorage();
  const channels = storage.getItem('channels');
  const homeSelectedChannelId = storage.getItem('homeChannelId');

  const onPress = (id: number) => {
    setSelectedChannelId(id);
  };

  return (
    <SafeAreaView
      style={styles.safeViewContainer}
      edges={embeddedInDrawer ? ['left', 'bottom'] : ['top', 'left', 'bottom']}
    >
      <View
        style={[
          styles.header,
          embeddedInDrawer && styles.headerDrawerEmbedded,
        ]}
      >
        {showToggle ? (
          <Icon
            name={ios ? 'SideBar' : 'SideBarAndroid'}
            onPress={hideSideBar}
            color={colors.primary}
            size="xl"
          />
        ) : null}
        <Text
          style={[styles.titleText, !showToggle && styles.titleWithoutToggle]}
          variant="bold"
          size="xl"
        >
          {t('Channels')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <ChannelItem
          isSelected={isNoChannelFilter(
            homeSelectedChannelId || NO_CHANNEL_FILTER_ID,
          )}
          channel={NO_CHANNEL_FILTER}
          onPress={() => onPress(NO_CHANNEL_FILTER.id)}
          isSidebar
        />
        {channels?.map((channel) => {
          const { id } = channel;
          return (
            <ChannelItem
              key={id}
              isSelected={id === homeSelectedChannelId}
              channel={channel}
              onPress={() => onPress(id)}
              isSidebar
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  safeViewContainer: {
    width: SIDE_BAR_WIDTH,
    flex: 1,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerDrawerEmbedded: {
    paddingTop: Constants.statusBarHeight + spacing.xl,
    paddingBottom: spacing.xl,
  },
  titleText: {
    flex: 1,
    marginLeft: spacing.l,
  },
  titleWithoutToggle: {
    marginLeft: 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  scrollContent: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: spacing.xxxl,
  },
}));

export { Props as ChannelSideBarContentProps };
