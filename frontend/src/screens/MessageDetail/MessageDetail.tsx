import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  SafeAreaView,
  View,
  VirtualizedList,
} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  AvatarRow,
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
  MentionList,
} from '../../components';
import { Divider, Icon, TextInputType } from '../../core-ui';
import {
  errorHandlerAlert,
  formatExtensions,
  getHyperlink,
  getImage,
  imagePickerHandler,
  insertHyperlink,
  mentionHelper,
  messageDetailHandler,
  useStorage,
} from '../../helpers';
import {
  useMention,
  useMessageTiming,
  useReplyPost,
  useSiteSettings,
  useTopicDetail,
} from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import {
  CursorPosition,
  Message,
  MessageContent,
  StackNavProp,
  StackRouteProp,
  User,
} from '../../types';

import { MessageItem, ReplyInputField } from './components';

type MessageDetailRenderItem = {
  item: MessageContent;
  index: number;
};

type OnScrollInfo = {
  index: number;
  highestMeasuredFrameIndex: number;
  averageItemLength: number;
};

enum Operation {
  'USER',
  'CHAT',
}

export default function MessageDetail() {
  const styles = useStyles();
  const { colors } = useTheme();

  const storage = useStorage();
  const user = storage.getItem('user');

  const { authorizedExtensions } = useSiteSettings();
  const extensions = authorizedExtensions?.split('|');
  const normalizedExtensions = formatExtensions(extensions);

  const ios = Platform.OS === 'ios';
  const screen = Dimensions.get('screen');

  const { navigate } = useNavigation<StackNavProp<'MessageDetail'>>();

  const {
    params: {
      id,
      postPointer,
      emptied,
      hyperlinkUrl = '',
      hyperlinkTitle = '',
    },
  } = useRoute<StackRouteProp<'MessageDetail'>>();

  const [hasOlderMessages, setHasOlderMessages] = useState(true);
  const [hasNewerMessages, setHasNewerMessages] = useState(true);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [loadingNewerMessages, setLoadingNewerMessages] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [isInitialRequest, setIsInitialRequest] = useState(true);
  const [textInputFocused, setInputFocused] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [initialHeight, setInitialHeight] = useState<number>();

  const [data, setData] = useState<Message>();
  const [members, setMembers] = useState<Array<User>>([]);
  const [userWhoComment, setUserWhoComment] = useState<Array<User>>([]);
  const [stream, setStream] = useState<Array<number>>([]);
  const virtualListRef = useRef<VirtualizedList<MessageContent>>(null);

  const [showUserList, setShowUserList] = useState(false);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [mentionKeyword, setMentionKeyword] = useState('');
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    start: 0,
    end: 0,
  });

  let contentHeight = initialHeight ? initialHeight : 0;

  const messageRef = useRef<TextInputType>(null);

  const { mentionMembers } = useMention(
    mentionKeyword,
    showUserList,
    setMentionLoading,
  );

  const {
    data: baseData,
    loading: messageDetailLoading,
    refetch,
    fetchMore,
  } = useTopicDetail({
    variables: {
      topicId: id,
      postPointer,
    },
    onCompleted: ({ topicDetail: result }) => {
      if (result) {
        setIsInitialRequest(true);
        setTitle(result.title || '');

        const tempParticipants: Array<User> = [];
        result.details?.allowedUsers?.forEach((allowedUser) =>
          tempParticipants.push({
            id: allowedUser.id,
            username: allowedUser.username,
            avatar: getImage(allowedUser.avatarTemplate),
          }),
        );
        setMembers(tempParticipants);
        let userWhoComment: Array<User> = [];
        result.details?.participants.forEach((user) => {
          userWhoComment.push({
            id: user.id,
            username: user.username,
            avatar: getImage(user.avatar),
          });
        });
        setUserWhoComment(userWhoComment);
      }
    },
    onError: (error) => {
      loadingOlderMessages && setLoadingOlderMessages(false);
      errorHandlerAlert(error);
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (emptied) {
      setMessage('');
    }
  }, [emptied]);

  useEffect(() => {
    if (!baseData) {
      return;
    }

    const {
      topicDetail: { postStream, details },
    } = baseData;

    if (!details) {
      return;
    }

    const {
      data: tempData,
      hasNewerMessage: newMessage,
      hasOlderMessage: oldMessage,
      baseStream,
      firstPostIndex,
      lastPostIndex,
    } = messageDetailHandler({ postStream, details });

    setData(tempData);
    setStream(baseStream);
    setHasNewerMessages(newMessage);
    setHasOlderMessages(oldMessage);
    setStartIndex(firstPostIndex);
    setEndIndex(lastPostIndex);
  }, [baseData]);

  useEffect(() => {
    if (!refetching) {
      return;
    }
    virtualListRef.current?.scrollToEnd({ animated: false });
    setRefetching(false);
  }, [refetching]);

  useEffect(() => {
    if (!hyperlinkUrl) {
      return;
    }
    const { newUrl, newTitle } = getHyperlink(hyperlinkUrl, hyperlinkTitle);
    const result = insertHyperlink(message, newTitle, newUrl);
    setMessage(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hyperlinkTitle, hyperlinkUrl]);

  const { reply, loading: replyLoading } = useReplyPost({
    onCompleted: () => {
      setMessage('');
      refetch({ postPointer: stream.length || 1 }).then(() => {
        if (textInputFocused && data?.contents.length) {
          if (ios) {
            virtualListRef.current?.scrollToIndex({
              index: data.contents.length,
              animated: true,
            });
          } else {
            setTimeout(() => {
              virtualListRef.current?.scrollToIndex({
                index: data.contents.length,
                animated: true,
              });
            }, 500);
          }
        }
        setRefetching(true);
      });
    },
  });

  useMessageTiming(id, startIndex, data?.contents);

  const loadStartMore = async () => {
    if (
      loadingOlderMessages ||
      !hasOlderMessages ||
      !stream ||
      messageDetailLoading
    ) {
      return;
    }
    setLoadingOlderMessages(true);
    let nextEndIndex = startIndex;
    let newDataCount = Math.min(10, stream.length - nextEndIndex);
    let nextStartIndex = Math.max(0, nextEndIndex - newDataCount);

    let nextPosts = stream.slice(nextStartIndex, nextEndIndex);
    if (!nextPosts.length) {
      return;
    }
    await fetchMore({
      variables: {
        topicId: id,
        posts: nextPosts,
      },
    }).then(() => {
      setStartIndex(nextStartIndex);
      setLoadingOlderMessages(false);
    });
  };

  const loadEndMore = async () => {
    if (
      loadingNewerMessages ||
      !hasNewerMessages ||
      !stream ||
      messageDetailLoading
    ) {
      return;
    }
    setLoadingNewerMessages(true);
    let nextStartIndex = endIndex + 1;
    let newDataCount = Math.min(10, stream.length - nextStartIndex);
    let nextEndIndex = nextStartIndex + newDataCount;

    let nextPosts = stream.slice(nextStartIndex, nextEndIndex);
    if (!nextPosts.length) {
      return;
    }
    await fetchMore({
      variables: {
        topicId: id,
        posts: nextPosts,
      },
    });
    setEndIndex(nextEndIndex - 1);
    setLoadingNewerMessages(false);
  };

  const onPressSend = (message: string) => {
    setShowUserList(false);
    if (message.trim() !== '') {
      reply({
        variables: {
          replyInput: {
            topicId: id,
            raw: message,
          },
        },
      });
    }
  };

  const onPressImage = async () => {
    try {
      let result = await imagePickerHandler(normalizedExtensions);
      if (!user || !result || !result.uri) {
        return;
      }
      let imageUri = result.uri;
      Keyboard.dismiss();
      navigate('ImagePreview', {
        topicId: id,
        imageUri,
        postPointer: stream.length,
        message,
      });
    } catch (unknownError) {
      // TODO: Eventually fix this so the type can resolve to ApolloError as well
      errorHandlerAlert(unknownError as string);
    }
    return;
  };

  const compareTime = (currIndex: number) => {
    if (currIndex === 0) {
      return true;
    }
    const currContentTime = data
      ? data.contents[currIndex].time
      : new Date().toDateString();
    const prevContentTime = data
      ? data.contents[currIndex - 1].time
      : new Date().toDateString();

    const time = new Date(currContentTime);
    const prevTime = new Date(prevContentTime);

    return (time.getTime() - prevTime.getTime()) / (1000 * 60) > 15;
  };

  const isPrev = (currIndex: number) => {
    if (data) {
      if (currIndex === 0) {
        return;
      }
      const currUserId = data.contents[currIndex].userId;
      const prevUserId = data.contents[currIndex - 1].userId;

      return currUserId === prevUserId;
    }
    return false;
  };

  const settings = (operation: Operation, currIndex: number) => {
    if (currIndex === -1) {
      return operation === Operation.USER;
    }
    const isPrevUser = isPrev(currIndex);
    if (!isPrevUser) {
      return operation === Operation.USER;
    }
    if (isPrevUser) {
      return operation === Operation.USER
        ? compareTime(currIndex)
        : !compareTime(currIndex);
    }
    return false;
  };

  const onPressLink = () => {
    navigate('HyperLink', {
      id,
      postPointer,
      prevScreen: 'MessageDetail',
    });
  };

  const onPressAvatar = (username: string) => {
    navigate('UserInformation', { username });
  };

  const renderItem = ({ item, index }: MessageDetailRenderItem) => {
    let user;

    if (item.userId === 0) {
      user = members.find((member) => member.id === -1);
    } else {
      user = userWhoComment.find((member) => member.id === item.userId);
    }

    const newTimestamp = compareTime(index);
    const isPrevUser = isPrev(index);
    const currSettings = settings(Operation.USER, index);
    const senderUsername = user?.username || '';

    return (
      <MessageItem
        content={item}
        sender={user}
        newTimestamp={newTimestamp}
        isPrev={isPrevUser}
        settings={currSettings}
        onPressAvatar={() => onPressAvatar(senderUsername)}
      />
    );
  };

  const keyExtractor = ({ id }: MessageContent) => `message-${id}`;
  const getItem = (data: Array<MessageContent>, index: number) => data[index];
  const getItemCount = (data: Array<MessageContent>) => data?.length;

  const renderFooter = (
    <KeyboardAccessoryView
      androidAdjustResize
      inSafeAreaView
      hideBorder
      alwaysVisible
      style={styles.keyboardAcc}
    >
      <MentionList
        showUserList={showUserList}
        members={mentionMembers}
        mentionLoading={mentionLoading}
        rawText={message}
        textRef={messageRef}
        setRawText={setMessage}
        setShowUserList={setShowUserList}
      />
      <View style={styles.footerContainer}>
        <Icon
          name="Photo"
          style={styles.footerIcon}
          onPress={onPressImage}
          color={colors.textLighter}
        />
        <Icon
          name="Link"
          style={styles.footerIcon}
          onPress={onPressLink}
          color={colors.textLighter}
        />
        <ReplyInputField
          inputRef={messageRef}
          loading={replyLoading}
          onPressSend={onPressSend}
          style={styles.inputContainer}
          message={message}
          setMessage={setMessage}
          onSelectedChange={(cursor) => {
            setCursorPosition(cursor);
          }}
          onChangeValue={(message: string) => {
            mentionHelper(
              message,
              cursorPosition,
              setShowUserList,
              setMentionLoading,
              setMentionKeyword,
            );
            setMessage(message);
          }}
          onFocus={() => {
            setInputFocused(true);
            if (contentHeight) {
              setTimeout(() => {
                virtualListRef.current?.scrollToOffset({
                  offset: contentHeight + (37 * screen.height) / 100,
                });
              }, 50);
            }
          }}
          onBlur={() => {
            setInputFocused(false);
            if (contentHeight) {
              setTimeout(() => {
                virtualListRef.current?.scrollToOffset({
                  offset: contentHeight - (37 * screen.height) / 100,
                });
              }, 50);
            }
          }}
        />
      </View>
    </KeyboardAccessoryView>
  );

  const onMessageScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!initialHeight) {
      setInitialHeight(
        Math.round(
          event.nativeEvent.contentSize.height -
            event.nativeEvent.layoutMeasurement.height,
        ),
      );
    }
    contentHeight = event.nativeEvent.contentOffset.y;
  };

  const onMessageScrollHandler = ({ index }: OnScrollInfo) => {
    if (index) {
      setTimeout(
        () =>
          virtualListRef.current?.scrollToIndex({
            animated: true,
            index,
          }),
        ios ? 50 : 150,
      );
    }
  };

  const onContentSizeChange = () => {
    if (isInitialRequest) {
      let pointerToIndex = postPointer - 1 - startIndex;
      let index = Math.min(19, pointerToIndex);
      try {
        virtualListRef.current?.scrollToIndex({
          animated: true,
          index,
        });
      } catch {
        virtualListRef.current?.scrollToEnd();
      }
      setTimeout(() => setIsInitialRequest(false), 1000);
    }
  };

  if (messageDetailLoading && title === '') {
    return <LoadingOrError loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {ios ? (
        <CustomHeader title={t('Message')} />
      ) : (
        <Divider style={styles.divider} />
      )}
      <AvatarRow
        title={title}
        posters={members}
        style={styles.participants}
        extended
      />
      <VirtualizedList
        ref={virtualListRef}
        refreshControl={
          <RefreshControl
            refreshing={refetching || loadingOlderMessages}
            onRefresh={loadStartMore}
            tintColor={colors.primary}
          />
        }
        data={data?.contents}
        getItem={getItem}
        getItemCount={getItemCount}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentInset={{
          bottom: textInputFocused ? (35 * screen.height) / 100 : 0,
          top: contentHeight ? ((5 * screen.height) / 100) * -1 : 0,
        }}
        onEndReachedThreshold={0.1}
        onEndReached={loadEndMore}
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={styles.messages}
        ListFooterComponent={
          <FooterLoadingIndicator isHidden={!hasNewerMessages} />
        }
        onScroll={onMessageScroll}
        onScrollToIndexFailed={onMessageScrollHandler}
      />
      {renderFooter}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, shadow, spacing }) => {
  return {
    container: {
      flex: 1,
      backgroundColor: colors.backgroundDarker,
    },
    divider: {
      flexGrow: 0,
      borderBottomWidth: 0.7,
    },
    participants: {
      backgroundColor: colors.background,
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.xxl,
      ...shadow,
    },
    messages: {
      paddingBottom: spacing.xxl,
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingTop: spacing.l,
      paddingHorizontal: spacing.xxl,
      paddingBottom: spacing.l,
      ...shadow,
    },
    keyboardAcc: {
      backgroundColor: colors.background,
    },
    footerIcon: {
      paddingRight: spacing.xl,
    },
    inputContainer: {
      flex: 1,
      paddingLeft: spacing.xl,
      paddingVertical: spacing.s,
      paddingRight: spacing.s,
      backgroundColor: colors.background,
    },
  };
});
