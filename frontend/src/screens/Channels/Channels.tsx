import React, { useCallback, useMemo } from 'react';
import { FlatList, Platform } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormContext } from 'react-hook-form';

import { CustomHeader, HeaderItem, ModalHeader } from '../../components';
import {
  isNoChannelFilter,
  NO_CHANNEL_FILTER,
  NO_CHANNEL_FILTER_ID,
} from '../../constants';
import { useStorage } from '../../helpers';
import { makeStyles } from '../../theme';
import { Channel, RootStackNavProp, RootStackRouteProp } from '../../types';

import ChannelItem from './Components/ChannelItem';

export default function Channels() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  const { goBack } = useNavigation<RootStackNavProp<'Channels'>>();

  const {
    params: { prevScreen },
  } = useRoute<RootStackRouteProp<'Channels'>>();

  const storage = useStorage();
  const channels = storage.getItem('channels');
  const { setValue, getValues } = useFormContext();
  const { channelId: selectedChannelId } = getValues();
  const homeSelectedChannelId = storage.getItem('homeChannelId');

  const selectedChannel =
    prevScreen === 'Home' ? homeSelectedChannelId : selectedChannelId;

  const ios = Platform.OS === 'ios';

  const listData = useMemo(() => {
    const items = channels ?? [];
    if (prevScreen === 'Home') {
      return [NO_CHANNEL_FILTER, ...items];
    }
    return items;
  }, [channels, prevScreen]);

  const onPress = useCallback(
    (id: number) => {
      if (prevScreen === 'Home') {
        storage.setItem('homeChannelId', id);
      } else {
        setValue('channelId', id, { shouldDirty: true });
      }
      goBack();
    },
    [goBack, prevScreen, setValue, storage],
  );

  const renderItem = useCallback(
    ({ item }: { item: Channel }) => {
      const { id } = item;
      const isSelected = isNoChannelFilter(id)
        ? isNoChannelFilter(selectedChannel ?? NO_CHANNEL_FILTER_ID)
        : id === selectedChannel;

      return (
        <ChannelItem
          isSelected={isSelected}
          channel={item}
          onPress={() => onPress(id)}
        />
      );
    },
    [onPress, selectedChannel],
  );

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top }]}
      edges={['left', 'right', 'bottom']}
    >
      {ios ? (
        <ModalHeader
          title={t('Channels')}
          left={<HeaderItem label={t('Cancel')} onPressItem={goBack} left />}
        />
      ) : (
        <CustomHeader title={t('Channels')} noShadow />
      )}

      <FlatList
        data={listData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={16}
        maxToRenderPerBatch={12}
        windowSize={7}
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}));
