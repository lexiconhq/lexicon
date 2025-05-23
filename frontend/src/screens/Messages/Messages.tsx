import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  VirtualizedList,
} from 'react-native';

import {
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
} from '../../components';
import { FIRST_POST_NUMBER, FORM_DEFAULT_VALUES } from '../../constants';
import { FloatingButton } from '../../core-ui';
import { MessageQuery } from '../../generatedAPI/server';
import { errorHandler, getParticipants, useStorage } from '../../helpers';
import { useMessageList } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { MessageParticipants, StackNavProp } from '../../types';
import { useDevice } from '../../utils';

import { MessageCard } from './Components';

type MessageType = NonNullable<
  MessageQuery['privateMessageQuery']['topicList']['topics']
>[number];

type MessageRenderItem = { item: MessageType; index: number };

export default function Messages() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { isTabletLandscape } = useDevice();
  const { reset } = useFormContext();

  const { navigate } = useNavigation<StackNavProp<'Messages'>>();

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';
  const currentUserId = storage.getItem('user')?.id || '';

  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [participants, setParticipants] = useState<Array<MessageParticipants>>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);

  const ios = Platform.OS === 'ios';

  const conditionHiddenFooterLoading =
    !hasOlderMessages || messages.length <= 20;
  const { error, refetch, fetchMore } = useMessageList(
    {
      variables: { username, page },
      onCompleted: (data) => {
        const allMessages = data.privateMessageList.topicList.topics ?? [];
        const allUsers = data.privateMessageList.users ?? [];

        const tempMessages = allMessages.map((item) => ({
          ...item,
          unseen:
            item.highestPostNumber - (item.lastReadPostNumber ?? 0) > 0 ||
            item.unseen,
        }));

        const tempParticipants = allMessages.map(
          ({ participants, lastPosterUsername, posters }) => {
            let userIds: Array<number> = participants?.length
              ? participants?.map(({ userId }, idx) => userId ?? idx)
              : // This condition only happen when the only participant has left the message
                posters
                  // Filter out current user ID
                  .filter(({ userId }) => userId && userId !== currentUserId)
                  .map(({ userId }, idx) => userId ?? idx);
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
          (messages.length > 0 && tempMessages.length >= 0) ||
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

  const onPressNewMessage = async () => {
    reset(FORM_DEFAULT_VALUES);
    navigate('NewMessage');
  };

  const onRefresh = () => {
    setLoading(true);
    refetch().then(() => setLoading(false));
  };

  const onEndReached = () => {
    // The `messages.length` condition prevents unnecessary fetching when the onEndReachedThreshold is triggered,
    // but the layout does not require more data to be loaded.
    // This issue occurs, for example, when there is only 1 message, and the scroll detects it has reached the threshold.
    // In such cases, the `onEndReached` function is called, causing a loading indicator to appear despite there being no additional data.
    // By default, we set the messages per page to 30. To solve this issue, we add a condition to check `messages.length`.
    if (conditionHiddenFooterLoading || loading) {
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
      testID={`MessageList:MessageCard:${item.id}`}
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
            tintColor={colors.loading}
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
          <FooterLoadingIndicator isHidden={conditionHiddenFooterLoading} />
        }
        style={styles.messageContainer}
        testID="Messages:List"
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
          hideHeaderLeft={isTabletLandscape}
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
