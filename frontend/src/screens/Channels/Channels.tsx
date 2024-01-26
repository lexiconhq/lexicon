import React from 'react';
import { Platform, SafeAreaView, ScrollView } from 'react-native';
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
import { RootStackNavProp, RootStackRouteProp } from '../../types';

import ChannelItem from './Components/ChannelItem';

export default function Channels() {
  const styles = useStyles();

  const { navigate, goBack } = useNavigation<RootStackNavProp<'Channels'>>();

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

  const onPress = (id: number) => {
    if (prevScreen === 'Home') {
      storage.setItem('homeChannelId', id);
      navigate('TabNav', { screen: 'Home' });
    } else {
      setValue('channelId', id, { shouldDirty: true });
      navigate(prevScreen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {ios ? (
        <ModalHeader
          title={t('Channels')}
          left={<HeaderItem label={t('Cancel')} onPressItem={goBack} left />}
        />
      ) : (
        <CustomHeader title={t('Channels')} noShadow />
      )}
      <ScrollView>
        {prevScreen === 'Home' && (
          <ChannelItem
            isSelected={isNoChannelFilter(
              homeSelectedChannelId || NO_CHANNEL_FILTER_ID,
            )}
            channel={NO_CHANNEL_FILTER}
            onPress={() => onPress(NO_CHANNEL_FILTER.id)}
          />
        )}
        {channels?.map((channel) => {
          const { id } = channel;
          return (
            <ChannelItem
              key={id}
              isSelected={id === selectedChannel}
              channel={channel}
              onPress={() => onPress(id)}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}));
