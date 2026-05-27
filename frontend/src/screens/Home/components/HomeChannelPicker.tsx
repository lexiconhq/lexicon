import React, { useCallback, useMemo } from 'react';
import { FlatList, Modal, Platform } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { CustomHeader, HeaderItem, ModalHeader } from '../../../components';
import {
  isNoChannelFilter,
  NO_CHANNEL_FILTER,
} from '../../../constants';
import { useStorage } from '../../../helpers';
import { makeStyles } from '../../../theme';
import { Channel } from '../../../types';
import ChannelItem from '../../Channels/Components/ChannelItem';

type Props = {
  visible: boolean;
  selectedChannelId: number;
  onSelectChannel: (id: number) => void;
  onClose: () => void;
};

function HomeChannelPickerContent(props: Omit<Props, 'visible'>) {
  const { selectedChannelId, onSelectChannel, onClose } = props;

  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const storage = useStorage();
  const channels = storage.getItem('channels');
  const ios = Platform.OS === 'ios';

  const data = useMemo(
    () => [NO_CHANNEL_FILTER, ...(channels ?? [])],
    [channels],
  );

  const handleSelect = useCallback(
    (id: number) => {
      onSelectChannel(id);
      onClose();
    },
    [onClose, onSelectChannel],
  );

  const renderItem = useCallback(
    ({ item }: { item: Channel }) => {
      const { id } = item;
      const isSelected = isNoChannelFilter(id)
        ? isNoChannelFilter(selectedChannelId)
        : id === selectedChannelId;

      return (
        <ChannelItem
          isSelected={isSelected}
          channel={item}
          onPress={() => handleSelect(id)}
        />
      );
    },
    [handleSelect, selectedChannelId],
  );

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top }]}
      edges={['left', 'right', 'bottom']}
    >
      {ios ? (
        <ModalHeader
          title={t('Channels')}
          left={<HeaderItem label={t('Cancel')} onPressItem={onClose} left />}
        />
      ) : (
        <CustomHeader title={t('Channels')} noShadow />
      )}
      <FlatList
        data={data}
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

export function HomeChannelPicker(props: Props) {
  const { visible, selectedChannelId, onSelectChannel, onClose } = props;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <HomeChannelPickerContent
          selectedChannelId={selectedChannelId}
          onSelectChannel={onSelectChannel}
          onClose={onClose}
        />
      </SafeAreaProvider>
    </Modal>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
}));
