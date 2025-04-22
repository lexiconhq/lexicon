import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  VirtualizedList,
} from 'react-native';

import { FooterLoadingIndicator, LoadingOrError } from '../../components';
import { CHAT_CHANNEL_DETAIL_PAGE_SIZE } from '../../constants';
import { TextInputType } from '../../core-ui';
import {
  DirectionPagination,
  GetThreadMessagesQueryVariables,
} from '../../generatedAPI/server';
import {
  compareTime,
  errorHandlerAlert,
  fetchPaginatedMessages,
  shouldDisplayTimestamp,
} from '../../helpers';
import {
  useLazyGetThreadDetail,
  useLazyGetThreadMessages,
  usePolling,
  useReplyChat,
} from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { ChatMessageContent, StackNavProp, StackRouteProp } from '../../types';
import {} from '../../types/api';

import {
  ChatList,
  ChatMessageItem,
  FooterReplyChat,
  ThreadDetailsHeader,
} from './components';

type OnScrollInfo = {
  index: number;
  highestMeasuredFrameIndex: number;
  averageItemLength: number;
};

export default function ThreadDetails() {
  const styles = useStyles();
  const screen = Dimensions.get('screen');
  const { colors } = useTheme();

  const {
    params: {
      channelId,
      threadId,
      threadFirstMessageId,
      threadTargetMessageId,
    },
  } = useRoute<StackRouteProp<'ThreadDetail'>>();
  const { navigate, addListener } =
    useNavigation<StackNavProp<'ThreadDetail'>>();

  const [textInputFocused, setInputFocused] = useState(false);
  const [hasNewThreads, setHasNewThreads] = useState(true);
  const [hasOlderThreads, setHasOlderThreads] = useState(false);
  const [threadMessages, setThreadMessages] = useState<
    Array<ChatMessageContent>
  >([]);
  const [isInitialRequest, setIsInitialRequest] = useState(true);
  const [message, setMessage] = useState('');
  const [isLoadingOldThread, setIsLoadingOldThread] = useState(false);

  const [isListRead, setIsListRead] = useState(false);

  const virtualListRef = useRef<VirtualizedList<ChatMessageContent>>(null);
  const textInputRef = useRef<TextInputType>(null);
  const hasScrolledRef = useRef(false);

  const targetThreadMessageId = useRef(
    threadFirstMessageId || threadTargetMessageId,
  );

  const {
    getThreadDetail,
    loading: threadDetailLoading,
    data: threadDetailData,
  } = useLazyGetThreadDetail({
    onError: (error) => {
      errorHandlerAlert(error);
    },
    onCompleted: () => {
      setInitialLoad(false);
    },
  });

  const {
    getThreadMessages,
    loading: threadMessagesLoading,
    fetchMore,
    refetch,
    data: threadMessagesData,
  } = useLazyGetThreadMessages({
    variables: {
      limit: CHAT_CHANNEL_DETAIL_PAGE_SIZE,
      threadId,
      channelId,
    },
    onCompleted: ({ getThreadMessages }) => {
      let { messages, meta } = getThreadMessages;
      if (messages.length) {
        if (messages[0].id === threadFirstMessageId) {
          messages = messages.slice(1);
        }
        setThreadMessages(messages);
        targetThreadMessageId.current =
          messages[messages.length - 1]?.id || threadFirstMessageId;
      }

      // When polling get newest message direction future it will return null for canLoadMorePast
      if (meta.canLoadMorePast != null) {
        setHasOlderThreads(meta.canLoadMorePast);
      }
      setHasNewThreads(meta.canLoadMoreFuture);
      setInitialLoad(false);
    },
  });

  // check is this threadId already cache or not if not we want load until threadDetail and messages complete
  const [initialLoad, setInitialLoad] = useState(
    !threadMessagesData?.getThreadMessages?.messages?.length,
  );

  const getData = useCallback(
    (variables: GetThreadMessagesQueryVariables) => {
      getThreadMessages({
        variables: { ...variables, limit: CHAT_CHANNEL_DETAIL_PAGE_SIZE },
      });
    },
    [getThreadMessages],
  );

  const loadMoreMessages = () => {
    if (!targetThreadMessageId.current) {
      return;
    }
    fetchPaginatedMessages({
      loadingState: threadMessagesLoading,
      hasMoreMessages: hasNewThreads,
      isInitialRequest,
      fetchMore,
      channelId,
      pageSize: CHAT_CHANNEL_DETAIL_PAGE_SIZE,
      targetMessageId: targetThreadMessageId.current,
      direction: DirectionPagination.Future,
    });
  };

  // run polling threadDetail to check new chat after at scene there are no new thread
  usePolling({
    fetchFn: () => {
      fetchMore({
        variables: {
          targetMessageId: targetThreadMessageId.current,
          direction: DirectionPagination.Future,
        },
      });
    },
    interval: 5000,
    shouldPoll: !hasNewThreads,
  });

  useEffect(() => {
    if (isInitialRequest) {
      setTimeout(() => setIsInitialRequest(false), 1000);
    }
  }, [isInitialRequest, threadTargetMessageId]);

  useEffect(() => {
    // hasScrolledRef to make sure only run 1 time when first load scene to scroll from push notifications ot notifications
    if (
      isListRead &&
      !threadFirstMessageId &&
      threadTargetMessageId &&
      !hasScrolledRef.current
    ) {
      hasScrolledRef.current = true;
      const findIndexTarget = threadMessages.findIndex(
        ({ id }) => id === threadTargetMessageId,
      );
      try {
        virtualListRef.current?.scrollToIndex({
          animated: true,
          index: findIndexTarget,
        });
      } catch {
        virtualListRef.current?.scrollToEnd({
          animated: true,
        });
      }
    }
  }, [isListRead, threadFirstMessageId, threadMessages, threadTargetMessageId]);

  useEffect(() => {
    let unsubscribe;
    unsubscribe = addListener('focus', () => {
      if (targetThreadMessageId.current) {
        getData({
          channelId,
          threadId,
          targetMessageId: targetThreadMessageId.current,
        });
      }
      if (!threadFirstMessageId) {
        getThreadDetail({
          variables: {
            channelId,
            threadId,
          },
        });
      }
    });

    return unsubscribe;
  }, [
    addListener,
    getData,
    channelId,
    threadId,
    threadFirstMessageId,
    getThreadDetail,
  ]);

  const { replyChat, loading: LoadingReplyChat } = useReplyChat({
    onCompleted: async ({ replyChat }) => {
      const { messageId } = replyChat;
      setMessage('');
      let { data } = await refetch({
        threadId,
        channelId,
        targetMessageId: messageId,
      });
      if (textInputFocused && data.getThreadMessages.messages.length) {
        setTimeout(() => {
          virtualListRef.current?.scrollToIndex({
            index:
              data.getThreadMessages.messages.length -
              (hasOlderThreads ? 1 : 2),
            animated: true,
          });
        }, 500);
      }
    },
  });

  const keyExtractor = ({ id }: { id: number }) => `thread-${id}`;

  const renderItem = ({
    item,
    index,
  }: {
    item: ChatMessageContent;
    index: number;
  }) => {
    const onPressAvatar = (username: string) => {
      navigate('UserInformation', { username });
    };

    const newTimestamp = compareTime({
      data: threadMessages,
      currIndex: index,
    }).isNewDay;

    return (
      <ChatMessageItem
        testID={`ThreadDetail:ChatItem:${item.id}`}
        content={item}
        sender={item.user}
        newTimestamp={newTimestamp}
        onPressAvatar={() => onPressAvatar(item.user.username)}
        firstChatBubbleStyle={styles.chatBubble}
        unread={false}
        settings={shouldDisplayTimestamp(threadMessages, index)}
      />
    );
  };

  const onReply = (message: string) => {
    if (message.trim() !== '') {
      replyChat({
        variables: {
          channelId,
          replyChatInput: {
            message,
            threadId,
          },
        },
      });
    }
  };

  const onMessageScrollHandler = ({ index }: OnScrollInfo) => {
    if (index) {
      setTimeout(
        () =>
          virtualListRef.current?.scrollToIndex({
            animated: true,
            index,
          }),
        150,
      );
    }
  };

  const onLoadPastMessages = async () => {
    if (!hasOlderThreads) {
      return;
    }

    setIsLoadingOldThread(true);
    await fetchMore({
      variables: {
        direction: DirectionPagination.Past,
        threadId,
        channelId,
        targetMessageId: threadMessages[0].id,
      },
    });
    setIsLoadingOldThread(false);
  };

  if (threadMessagesLoading || threadDetailLoading || initialLoad) {
    return <LoadingOrError loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ChatList
        testID="ThreadDetail:Chat:List"
        onLayout={() => {
          setIsListRead(true);
        }}
        ref={virtualListRef}
        data={threadMessages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <ThreadDetailsHeader
            threadId={
              threadFirstMessageId ||
              threadDetailData?.getThreadDetail.thread.originalMessage?.id
            }
            threadData={
              threadDetailData?.getThreadDetail.thread.originalMessage ||
              undefined
            }
          />
        }
        refreshControl={
          <RefreshControl
            enabled={hasOlderThreads}
            refreshing={isLoadingOldThread}
            onRefresh={hasOlderThreads ? onLoadPastMessages : undefined}
            tintColor={colors.loading}
          />
        }
        style={styles.scrollViewContainer}
        textInputFocused={textInputFocused}
        screen={screen}
        onEndReached={() => loadMoreMessages()}
        ListFooterComponent={
          <FooterLoadingIndicator isHidden={!hasNewThreads} />
        }
        onScrollToIndexFailed={onMessageScrollHandler}
      />
      <FooterReplyChat
        message={message}
        setMessage={setMessage}
        listRef={virtualListRef}
        ref={textInputRef}
        setInputFocused={setInputFocused}
        onReply={onReply}
        replyLoading={LoadingReplyChat}
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContainer: {
    backgroundColor: colors.backgroundDarker,
    flex: 1,
  },
  chatBubble: {
    backgroundColor: colors.backgroundDarker,
    marginTop: spacing.m,
  },
}));
