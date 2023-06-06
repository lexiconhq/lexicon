import React, { useState } from 'react';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  VirtualizedList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
} from '../../components';
import { FloatingButton } from '../../core-ui';
import { MessageQuery } from '../../generated/server';
import { errorHandler, getParticipants, useStorage } from '../../helpers';
import { useMessageList } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { MessageParticipants, StackNavProp } from '../../types';
import { FIRST_POST_NUMBER } from '../../constants';

import { MessageCard } from './Components';

type MessageType = NonNullable<
  MessageQuery['privateMessage']['topicList']['topics']
>[number];

type MessageRenderItem = { item: MessageType; index: number };

export default function Messages() {
  const styles = useStyles();
  const { colors } = useTheme();

  const { navigate } = useNavigation<StackNavProp<'Profile'>>();

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [participants, setParticipants] = useState<Array<MessageParticipants>>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);

  const ios = Platform.OS === 'ios';

  const onPressNewMessage = () => {
    navigate('NewMessage', { users: [], listOfUser: [] });
  };

  const { error, refetch, fetchMore } = useMessageList(
    {
      variables: { username, page },
      onCompleted: (data) => {
        const allMessages = data.privateMessage.topicList.topics ?? [];
        const allUsers = data.privateMessage.users ?? [];

        const tempMessages = allMessages.map((item) => ({
          ...item,
          unseen:
            item.highestPostNumber - (item.lastReadPostNumber ?? 0) > 0 ||
            item.unseen,
        }));

        const tempParticipants = allMessages.map(
          ({ participants, lastPosterUsername }) => {
            let userIds: Array<number> =
              participants?.map(({ userId }, idx) => userId ?? idx) || [];
            return getParticipants(
              userIds,
              allUsers,
              username,
              lastPosterUsername ?? '',
            );
          },
        );

        const currentMessageIds = messages.map((topic) => topic.id);
        const incomingMessageIds = tempMessages.map((topic) => topic.id);
        if (
          JSON.stringify(currentMessageIds) ===
          JSON.stringify(incomingMessageIds)
        ) {
          setHasOlderMessages(false);
        } else if (incomingMessageIds.length > 0) {
          setHasOlderMessages(true);
        } else {
          setHasOlderMessages(false);
        }

        // Handle the edge case where messages.length > 0 but tempMessages.length < 1.
        // When this happens, the existing messages get cleared and replaced with nothing.
        // TODO: test this on a site with multiple pages of messages. This edge case
        // came up when there was less than one page.
        const shouldUpdateMessages =
          (messages.length > 0 && tempMessages.length > 0) ||
          (messages.length < 1 && tempMessages.length > 0);

        if (shouldUpdateMessages) {
          setMessages(tempMessages);
          setParticipants(tempParticipants);
        }
        setLoading(false);
      },
      fetchPolicy: 'network-only',
    },
    'HIDE_ALERT',
  );

  const onRefresh = () => {
    setLoading(true);
    refetch().then(() => setLoading(false));
  };

  const onEndReached = () => {
    if (!hasOlderMessages || loading) {
      return;
    }
    setLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMore({ variables: { username, page: nextPage } }).then(() =>
      setLoading(false),
    );
  };

  const getItem = (messages: Array<MessageType>, index: number) =>
    messages[index];

  const getItemCount = (messages: Array<MessageType>) => messages.length;

  const getItemLayout = (data: MessageType, index: number) => ({
    length: 85,
    offset: 85 * index,
    index,
  });

  const keyExtractor = ({ id }: MessageType) => `message-${id}`;

  const renderItem = ({ item, index }: MessageRenderItem) => (
    <MessageCard
      id={item.id}
      message={item.title}
      messageParticipants={participants[index]}
      allowedUserCount={item.allowedUserCount}
      postNumber={item.lastReadPostNumber ?? FIRST_POST_NUMBER}
      date={item.lastPostedAt || ''}
      seen={!item.unseen}
    />
  );

  let content;
  if (error) {
    content = <LoadingOrError message={errorHandler(error, true)} />;
  } else if (loading && messages.length < 1) {
    content = <LoadingOrError loading />;
  } else if (!loading && messages.length < 1) {
    content = <LoadingOrError message={t('You have no messages')} />;
  } else {
    content = (
      <VirtualizedList
        data={messages}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        getItem={getItem}
        getItemCount={getItemCount}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        ListFooterComponent={
          <FooterLoadingIndicator isHidden={!hasOlderMessages} />
        }
        style={styles.messageContainer}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {ios && (
        <CustomHeader
          title={t('Messages')}
          rightIcon="Add"
          onPressRight={onPressNewMessage}
        />
      )}
      {content}
      {!ios && (
        <FloatingButton onPress={onPressNewMessage} style={styles.fab} />
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  messageContainer: {
    flex: 1,
    width: '100%',
  },
  fab: {
    position: 'absolute',
    marginRight: spacing.xxl,
    marginBottom: spacing.xxl,
    right: 0,
    bottom: 0,
  },
}));
