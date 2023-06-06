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
  errorHandler,
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
  useMessageDetail,
  useLoadMorePost,
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
import { FIRST_POST_NUMBER, MAX_POST_COUNT_PER_REQUEST } from '../../constants';

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

/**
 * Index starts with 0, while count starts with 1,
 * so the max initial last index would be max count - 1,
 * assuming the server returns the maximum number of posts
 */
const MAX_INITIAL_LAST_INDEX = MAX_POST_COUNT_PER_REQUEST - 1;
const SYSTEM_USERNAME = 'system';

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
    params: { id, postNumber, emptied, hyperlinkUrl = '', hyperlinkTitle = '' },
  } = useRoute<StackRouteProp<'MessageDetail'>>();

  const [hasOlderMessages, setHasOlderMessages] = useState(true);
  const [hasNewerMessages, setHasNewerMessages] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [isInitialRequest, setIsInitialRequest] = useState(true);
  const [textInputFocused, setInputFocused] = useState(false);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [firstLoadedPostIndex, setFirstLoadedPostIndex] = useState(0);
  const [lastLoadedPostIndex, setLastLoadedPostIndex] = useState(0);
  const [initialHeight, setInitialHeight] = useState<number>();

  const [data, setData] = useState<Message>();
  // Members are all users who can read or send messages
  const [members, setMembers] = useState<Array<User>>([]);
  // Participants are users who have sent messages at least once
  const [participants, setParticipants] = useState<Array<User>>([]);
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
    error,
  } = useMessageDetail(
    {
      variables: { topicId: id, postNumber },
      onCompleted: ({ privateMessageDetail: result }) => {
        if (result) {
          setTitle(result.title || '');

          if (!result.details) {
            return;
          }
          const messageMembers = result.details.allowedUsers?.map(
            ({ avatarTemplate, __typename, ...otherProps }) => ({
              ...otherProps,
              avatar: getImage(avatarTemplate),
            }),
          );
          messageMembers && setMembers(messageMembers);
          let participants: Array<User> = result.details.participants.map(
            ({ avatar, __typename, ...otherProps }) => ({
              ...otherProps,
              avatar: getImage(avatar),
            }),
          );
          setParticipants(participants);
        }
      },
    },
    'HIDE_ALERT',
  );

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
      privateMessageDetail: { details, postStream },
    } = baseData;

    if (!details) {
      return;
    }

    const {
      data: tempData,
      hasNewerMessage: newMessage,
      hasOlderMessage: oldMessage,
      stream: baseStream,
      firstPostIndex,
      lastPostIndex,
    } = messageDetailHandler({ postStream, details });

    setData(tempData);
    setStream(baseStream);
    setHasNewerMessages(newMessage);
    setHasOlderMessages(oldMessage);
    if (firstPostIndex) {
      setFirstLoadedPostIndex(firstPostIndex);
    }

    if (lastPostIndex) {
      setLastLoadedPostIndex(lastPostIndex);
    }
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
      refetch({ postNumber: stream.length }).then(() => {
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

  useMessageTiming(id, firstLoadedPostIndex, data?.contents);

  const { loadMorePosts, isLoadingOlderPost } = useLoadMorePost(id);
  const loadMoreMessages = async (loadNewerMessages: boolean) => {
    if (messageDetailLoading) {
      return;
    }
    let newPostIndex = await loadMorePosts({
      fetchMore,
      firstLoadedPostIndex,
      lastLoadedPostIndex,
      stream,
      loadNewerPosts: loadNewerMessages,
      hasMorePost: loadNewerMessages ? hasNewerMessages : hasOlderMessages,
    });
    if (!newPostIndex) {
      return;
    }
    const { nextLastLoadedPostIndex, nextFirstLoadedPostIndex } = newPostIndex;
    if (loadNewerMessages) {
      setLastLoadedPostIndex(nextLastLoadedPostIndex);
      return;
    }
    setFirstLoadedPostIndex(nextFirstLoadedPostIndex);
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
      const currUser = data.contents[currIndex].username;
      const prevUser = data.contents[currIndex - 1].username;
      return currUser === prevUser;
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
      postNumber,
      prevScreen: 'MessageDetail',
    });
  };

  const onPressAvatar = (username: string) => {
    navigate('UserInformation', { username });
  };

  const renderItem = ({ item, index }: MessageDetailRenderItem) => {
    let user;

    /**
     *  System is only included in members.
     *  Other message senders are included in participants, but may not
     *  be included as members if they are removed.
     */
    if (item.username === SYSTEM_USERNAME) {
      user = members.find((member) => member.id === -1);
    } else {
      user = participants.find((member) => member.username === item.username);
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
          style={[
            styles.inputContainer,
            message.trim() !== '' && {
              paddingVertical: 6,
            },
          ]}
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
      let postIndex = postNumber - FIRST_POST_NUMBER;
      let postIndexInLoadedList = postIndex - firstLoadedPostIndex;
      let index = Math.min(MAX_INITIAL_LAST_INDEX, postIndexInLoadedList);
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

  const Header = ios ? (
    <CustomHeader title={t('Message')} />
  ) : (
    <Divider style={styles.divider} />
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {Header}
        <LoadingOrError message={errorHandler(error, true, t('message'))} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {Header}
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
            refreshing={refetching || isLoadingOlderPost}
            onRefresh={() => loadMoreMessages(false)}
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
        onEndReached={() => loadMoreMessages(true)}
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
      paddingVertical: spacing.m,
      paddingRight: spacing.s,
      backgroundColor: colors.background,
    },
  };
});
