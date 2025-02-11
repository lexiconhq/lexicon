import React from 'react';
import { Platform, SafeAreaView, ScrollView, View } from 'react-native';

import {
  isNoChannelFilter,
  NO_CHANNEL_FILTER,
  NO_CHANNEL_FILTER_ID,
} from '../../constants';
import { Icon, Text } from '../../core-ui';
import { useStorage } from '../../helpers';
import { makeStyles, useTheme } from '../../theme';

import ChannelItem from './Components/ChannelItem';

type Props = {
  setSelectedChannelId: (id: number) => void;
  hideSideBar: () => void;
};

export default function ChannelSideBarContent(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { setSelectedChannelId, hideSideBar } = props;

  const ios = Platform.OS === 'ios';

  const storage = useStorage();
  const channels = storage.getItem('channels');
  const homeSelectedChannelId = storage.getItem('homeChannelId');

  const onPress = (id: number) => {
    storage.setItem('homeChannelId', id);
    setSelectedChannelId(id);
  };

  return (
    <SafeAreaView style={styles.safeViewContainer}>
      <View style={styles.container}>
        <Icon
          name={ios ? 'SideBar' : 'SideBarAndroid'}
          onPress={hideSideBar}
          color={colors.textNormal}
          size="xl"
        />
        <Text style={styles.titleText} variant={'bold'} size="xl">
          {t('Channels')}
        </Text>

        <ScrollView>
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
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing, shadow }) => ({
  safeViewContainer: {
    maxWidth: 320,
    zIndex: 1000,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderColor: colors.border,
    ...shadow,
    shadowOffset: {
      width: 0.5,
      height: 0,
    },
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.xl + spacing.xxl,
  },
  titleText: {
    marginTop: spacing.xl,
    marginBottom: spacing.m,
  },
}));

export { Props as ChannelSideBarContentProps };
