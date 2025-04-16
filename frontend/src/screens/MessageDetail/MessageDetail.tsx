import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Alert,
  Dimensions,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  VirtualizedList,
} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

import {
  ActionSheet,
  ActionSheetProps,
  AvatarRow,
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
  MentionList,
  PollChoiceCard,
} from '../../components';
import {
  ERROR_UNEXPECTED,
  FIRST_POST_NUMBER,
  FORM_DEFAULT_VALUES,
  MAX_POST_COUNT_PER_REQUEST,
  refetchQueriesPostDraft,
} from '../../constants';
import { Divider, Icon, Text, TextInputType } from '../../core-ui';
import {
  MessageListDocument,
  PostDraftType,
  UploadTypeEnum,
} from '../../generatedAPI/server';
import {
  LeaveMessageError,
  combineDataMarkdownPollAndImageList,
  convertResultUploadIntoImageFormContext,
  createReactNativeFile,
  deletePoll,
  errorHandler,
  errorHandlerAlert,
  formatExtensions,
  getHyperlink,
  getImage,
  getPollChoiceLabel,
  imagePickerHandler,
  insertHyperlink,
  mentionHelper,
  messageDetailHandler,
  messageInvalidAccessAlert,
  saveAndDiscardPostDraftAlert,
  sortImageUrl,
  useStorage,
} from '../../helpers';
import {
  useAutoSaveManager,
  useAutoSavePostDraft,
  useCreateAndUpdatePostDraft,
  useDeletePostDraft,
  useLeaveMessage,
  useLoadMorePost,
  useLookupUrls,
  useMention,
  useMessageDetail,
  useMessageTiming,
  useReplyTopic,
  useSiteSettings,
  useStatelessUpload,
} from '../../hooks';
import { useInitialLoad } from '../../hooks/useInitialLoad';
import { IconName } from '../../icons';
import { makeStyles, useTheme } from '../../theme';
import {
  CursorPosition,
  ErrorHandlerAlertSchema,
  Message,
  MessageContent,
  NewPostForm,
  StackNavProp,
  StackRouteProp,
  User,
} from '../../types';

import {
  ListImageSelected,
  MessageItem,
  ReplyInputField,
  ToolTip,
} from './components';

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
  const useInitialLoadResult = useInitialLoad();

  const storage = useStorage();
  const user = storage.getItem('user');

  const { authorizedExtensions } = useSiteSettings();
  const extensions = authorizedExtensions?.split('|');
  const normalizedExtensions = formatExtensions(extensions);

  const ios = Platform.OS === 'ios';
  const screen = Dimensions.get('screen');

  const navigation = useNavigation<StackNavProp<'MessageDetail'>>();

  const { navigate, goBack, reset } = navigation;

  const {
    params: { id, postNumber, emptied, hyperlinkUrl = '', hyperlinkTitle = '' },
  } = useRoute<StackRouteProp<'MessageDetail'>>();

  const [hasOlderMessages, setHasOlderMessages] = useState(true);
  const [hasNewerMessages, setHasNewerMessages] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [isInitialRequest, setIsInitialRequest] = useState(true);
  const [textInputFocused, setInputFocused] = useState(false);

  const [title, setTitle] = useState('');

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
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [canLeaveMessage, setCanLeaveMessage] = useState(false);

  const [visibleToolTip, setVisibleToolTip] = useState(false);

  let contentHeight = initialHeight ? initialHeight : 0;

  const messageRef = useRef<TextInputType>(null);

  const {
    control,
    getValues,
    setValue,
    formState: { dirtyFields },
    reset: resetForm,
    watch,
  } = useFormContext<NewPostForm>();

  const { raw: message, isDraft, draftKey } = getValues();
  const imageList = watch('imageMessageReplyList');
  const polls = watch('polls');

  const shortUrls = imageList?.map(({ shortUrl }) => shortUrl) || [];

  const { mentionMembers } = useMention(
    mentionKeyword,
    showUserList,
    setMentionLoading,
  );

  const canSendMessage =
    !!imageList?.length || !!message.trim() || !!polls?.length;
  const {
    data: baseData,
    loading: messageDetailLoading,
    refetch,
    fetchMore,
    error,
  } = useMessageDetail(
    {
      variables: { topicId: id, postNumber },
      onCompleted: ({ privateMessageDetailQuery: result }) => {
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
          setCanLeaveMessage(
            result.details.allowedUsers
              ? result.details.allowedUsers.length > 1
              : false,
          );
        }
      },
      onError: (error) => {
        /**
         * if we get error about private post which cannot be access.
         * we need check first it is because user haven't login or because post it self only open to specific group
         * if user not login we will redirect to login scene.
         * But if user already login still get same error will redirect to home scene and show private post alert
         */

        if (error.message.includes('Invalid Access')) {
          if (
            !useInitialLoadResult.loading &&
            !useInitialLoadResult.isLoggedIn
          ) {
            reset({
              index: 1,
              routes: [
                { name: 'TabNav', state: { routes: [{ name: 'Home' }] } },
                { name: 'Welcome' },
              ],
            });
          } else {
            navigate('TabNav', { state: { routes: [{ name: 'Home' }] } });
            messageInvalidAccessAlert();
          }
        }
      },
    },
    'HIDE_ALERT',
  );

  const { createPostDraft, loading: loadingCreateAndUpdatePostDraft } =
    useCreateAndUpdatePostDraft({
      onError: (error) => {
        errorHandlerAlert(error);
      },
      onCompleted: ({ createAndUpdatePostDraft }) => {
        setValue('draftKey', createAndUpdatePostDraft?.draftKey);
        setValue('sequence', createAndUpdatePostDraft?.draftSequence);
        setValue('isDraft', true);
      },
    });
  const { deletePostDraft } = useDeletePostDraft();

  const { getImageUrls, loading: LoadingLookupUrls } = useLookupUrls({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: { lookupUrlInput: { shortUrls } },
    onCompleted: ({ lookupUrls }) => {
      const imageUrls = sortImageUrl(shortUrls, lookupUrls);

      setValue(
        'imageMessageReplyList',
        imageList?.map((data, index) => {
          return { ...data, url: imageUrls[index] };
        }),
      );
    },
  });

  const { debounceSaveDraft } = useAutoSavePostDraft({
    createPostDraft,
    getValues,
    type: PostDraftType.PrivateMessageReply,
    topicId: id,
  });

  useAutoSaveManager();

  useEffect(() => {
    const isImageUrlEmpty = imageList?.find(({ url }) => url === '');

    if (shortUrls.length > 0 && !!isImageUrlEmpty) {
      getImageUrls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getImageUrls, shortUrls.length]);

  useEffect(() => {
    if (emptied) {
      setValue('raw', '');
    }
  }, [emptied, setValue]);

  useEffect(() => {
    if (!baseData) {
      return;
    }

    const {
      privateMessageDetailQuery: { details, postStream },
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

  /**
   * Handle scroll to end after finish reply with image or poll
   */

  useEffect(() => {
    if (!isInitialRequest) {
      virtualListRef.current?.scrollToEnd({ animated: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postNumber]);

  useEffect(() => {
    if (!hyperlinkUrl) {
      return;
    }
    const { newUrl, newTitle } = getHyperlink(hyperlinkUrl, hyperlinkTitle);
    const result = insertHyperlink(message, newTitle, newUrl);
    setValue('raw', result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hyperlinkTitle, hyperlinkUrl]);

  const { reply, loading: replyLoading } = useReplyTopic({
    onCompleted: () => {
      resetForm(FORM_DEFAULT_VALUES);
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
    refetchQueries: isDraft ? refetchQueriesPostDraft : [],
  });

  useMessageTiming(id, firstLoadedPostIndex, data?.contents);

  const { leaveMessage, loading: loadingLeaveMessage } = useLeaveMessage({
    onCompleted: ({ leaveMessage }) => {
      if (leaveMessage === 'success') {
        goBack();
      }
    },
    onError: () => {
      errorHandlerAlert(LeaveMessageError);
    },
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: MessageListDocument,
        variables: { username: user?.username },
      },
    ],
  });

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

  const { upload, loading: uploadLoading } = useStatelessUpload({
    onCompleted: ({ upload: result }) => {
      const listOldImageList = getValues('imageMessageReplyList') || [];

      const convertResult = convertResultUploadIntoImageFormContext(result);
      setValue('imageMessageReplyList', [...listOldImageList, convertResult], {
        shouldDirty: true,
      });

      navToImagePreview();
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
  });

  const navToImagePreview = () => {
    Keyboard.dismiss();
    navigate('ImagePreview', {
      topicId: id,
    });
  };

  const toggleToolTip = () => {
    setVisibleToolTip(!visibleToolTip);
  };

  const onPressSend = () => {
    const { raw } = getValues();

    debounceSaveDraft.cancel();
    setShowUserList(false);
    if (canSendMessage) {
      const newRaw = combineDataMarkdownPollAndImageList({
        content: raw,
        imageList,
        polls,
      });
      reply({
        variables: {
          replyInput: {
            topicId: id,
            raw: newRaw,
            draftKey,
          },
        },
      });
    }
  };

  const onPressImage = async ({ isShowPicker }: { isShowPicker?: boolean }) => {
    if (isShowPicker) {
      try {
        let result = await imagePickerHandler(normalizedExtensions);
        if (!user || !result || !result.uri) {
          return;
        }
        let imageUri = result.uri;
        const reactNativeFile = createReactNativeFile(imageUri);
        if (reactNativeFile) {
          upload({
            variables: {
              input: {
                file: reactNativeFile,
                userId: user.id,
                type: UploadTypeEnum.Composer,
              },
            },
          });
        } else {
          Alert.alert(t('Failed Upload!'), t(`Please Try Again`), [
            { text: t('Got it') },
          ]);
        }
      } catch (unknownError) {
        const errorResult = ErrorHandlerAlertSchema.safeParse(unknownError);
        if (errorResult.success) {
          errorHandlerAlert(errorResult.data);
        } else {
          Alert.alert(ERROR_UNEXPECTED);
        }
      }
    } else {
      navToImagePreview();
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

  const onPressPoll = () => {
    navigate('NewPoll', {
      prevScreen: 'MessageDetail',
      messageTopicId: id,
    });
  };

  const setMentionRawText = (text: string) => {
    setValue('raw', text);
  };

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        /**
         * Add condition only when change title or content we show alert
         */
        if (
          !dirtyFields.raw &&
          !dirtyFields.polls &&
          !dirtyFields.imageMessageReplyList
        ) {
          resetForm(FORM_DEFAULT_VALUES);
          return;
        }
        e.preventDefault();

        saveAndDiscardPostDraftAlert({
          deletePostDraft,
          createPostDraft,
          event: e,
          navigation,
          getValues,
          resetForm,
          draftType: PostDraftType.PrivateMessageReply,
          topicId: id,
        });
      }),
    [
      createPostDraft,
      deletePostDraft,
      dirtyFields.polls,
      dirtyFields.raw,
      getValues,
      navigation,
      resetForm,
      id,
      dirtyFields.imageMessageReplyList,
    ],
  );

  useEffect(() => {
    /**
     * To set InitialRequest into true for able run onContentSizeChange to handle scroll
     */
    const unsubscribe = navigation.addListener('focus', () => {
      setIsInitialRequest(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    onContentSizeChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialRequest]);

  const MenuItem = ({
    iconName,
    text,
    onPress,
    style,
    testID,
  }: {
    iconName: IconName;
    text: string;
    onPress: () => void | Promise<void>;
    style?: StyleProp<ViewStyle>;
    testID?: string;
  }) => (
    <TouchableOpacity
      style={[styles.toolTipMenuButton, style]}
      onPress={async () => {
        await onPress();
        setVisibleToolTip(false);
      }}
      testID={testID}
    >
      <Icon
        name={iconName}
        color={colors.textLighter}
        style={styles.iconMenuToolTip}
      />
      <Text size="s">{text}</Text>
    </TouchableOpacity>
  );
  const menuToolTip = () => {
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <MenuItem
          iconName="Link"
          text={t('Add Link')}
          onPress={onPressLink}
          testID="ToolTip:MenuItem:Link"
        />
        <MenuItem
          iconName="Photo"
          text={t('Add Image')}
          onPress={() => {
            onPressImage({ isShowPicker: true });
          }}
          style={styles.menuContainer}
        />
        <MenuItem
          iconName="Chart"
          text={t('Add Poll')}
          onPress={onPressPoll}
          testID="ToolTip:MenuItem:Poll"
        />
      </ScrollView>
    );
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
        topicId={id}
      />
    );
  };

  const keyExtractor = ({ id }: MessageContent) => `message-${id}`;
  const getItem = (data: Array<MessageContent>, index: number) => data[index];
  const getItemCount = (data: Array<MessageContent>) => data?.length;

  const renderFooter = (
    <>
      <KeyboardAccessoryView
        androidAdjustResize
        inSafeAreaView
        hideBorder
        alwaysVisible
        style={styles.keyboardAcc}
        bumperHeight={2}
      >
        {!!imageList?.length && (
          <ListImageSelected
            style={styles.listImageContainer}
            imageUrls={imageList.map(({ url }) => url)}
            onPressEdit={() => onPressImage({ isShowPicker: false })}
            disableEdit={
              replyLoading || loadingCreateAndUpdatePostDraft || uploadLoading
            }
            isEdit
          />
        )}

        {!!polls?.length && (
          <PollChoiceCard
            choice={getPollChoiceLabel({
              title: polls[0].title,
              pollType: polls[0].pollChoiceType,
            })}
            totalOption={polls[0].pollOptions.length}
            onEdit={() => {
              if (polls.length > 1) {
                navigate('EditPollsList', { messageTopicId: id });
              } else {
                navigate('NewPoll', {
                  prevScreen: 'MessageDetail',
                  messageTopicId: id,
                  pollIndex: 0,
                });
              }
            }}
            onDelete={() => {
              /**
               * Only show delete when there only 1 poll
               */
              deletePoll({ polls, setValue, index: 0 });
            }}
            totalPoll={polls.length > 1 ? polls.length : undefined}
            style={styles.pollCardContainer}
          />
        )}
        <MentionList
          showUserList={showUserList}
          members={mentionMembers}
          mentionLoading={mentionLoading}
          rawText={message}
          textRef={messageRef}
          setRawText={setMentionRawText}
          setShowUserList={setShowUserList}
        />
        <View style={styles.footerContainer}>
          <ToolTip
            anchorIconName="Add"
            anchorStyle={styles.footerIcon}
            menu={menuToolTip()}
            visible={visibleToolTip}
            onDismiss={toggleToolTip}
            anchorOnPress={toggleToolTip}
          />
          <Controller
            name="raw"
            defaultValue={message}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ReplyInputField
                showButton={canSendMessage}
                inputRef={messageRef}
                loading={
                  replyLoading ||
                  loadingCreateAndUpdatePostDraft ||
                  uploadLoading
                }
                onPressSend={onPressSend}
                style={[
                  styles.inputContainer,
                  message.trim() !== '' && {
                    paddingVertical: 6,
                  },
                ]}
                message={value}
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
                  onChange(message);
                  // make sure after send and reset form not run debounce
                  if (message.trim()) {
                    debounceSaveDraft();
                  }
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
            )}
          />
        </View>
      </KeyboardAccessoryView>
    </>
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
      /** If we didn't get postNumber value it will scroll to end of list */
      if (!postNumber) {
        virtualListRef.current?.scrollToEnd({ animated: true });
      } else {
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
      }
      setTimeout(() => setIsInitialRequest(false), 1000);
    }
  };

  const onPressMore = () => {
    setShowActionSheet(true);
  };

  const onLeaveMessage = () => {
    leaveMessage({
      variables: {
        leaveMessageInput: {
          username: user?.username || '',
        },
        topicId: id,
      },
    });
  };

  const actionItemOptions = () => {
    let options: ActionSheetProps['options'] = [];

    if (ios) {
      options.push({ label: t('Cancel') });
    }
    options.push({ label: t('Leave Message') });

    return options;
  };

  const actionItemOnPress = (btnIndex: number) => {
    if (btnIndex === 0) {
      return Alert.alert(
        t('Leave Message?'),
        t('Are you sure you want to leave this message?'),
        [
          { text: t('Cancel') },
          {
            text: t('Leave'),
            onPress: onLeaveMessage,
          },
        ],
      );
    }
  };

  if ((messageDetailLoading || LoadingLookupUrls) && title === '') {
    return <LoadingOrError loading />;
  }

  const Header = canLeaveMessage ? (
    <CustomHeader
      title={t('Message')}
      rightIcon="More"
      onPressRight={onPressMore}
      disabled={
        loadingLeaveMessage || loadingCreateAndUpdatePostDraft || uploadLoading
      }
    />
  ) : (
    !ios && <Divider style={styles.divider} />
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {Header}
        <LoadingOrError message={errorHandler(error, true, t('message'))} />
      </SafeAreaView>
    );
  }

  return loadingLeaveMessage ? (
    <LoadingOrError loading />
  ) : (
    <>
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
              onRefresh={() => refetch()}
              tintColor={colors.loading}
            />
          }
          data={data?.contents ?? []}
          getItem={getItem}
          getItemCount={getItemCount}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentInset={{
            bottom: textInputFocused ? (35 * screen.height) / 100 : 0,
            top: contentHeight ? ((2 * screen.height) / 100) * -1 : 0,
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
      <ActionSheet
        visible={showActionSheet}
        options={actionItemOptions()}
        cancelButtonIndex={ios ? 0 : undefined}
        actionItemOnPress={actionItemOnPress}
        onClose={() => {
          setShowActionSheet(false);
        }}
        style={!ios && styles.androidModalContainer}
      />
    </>
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
    listImageContainer: {
      paddingVertical: spacing.l,
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.m,
      paddingRight: spacing.xxl,
    },
    pollCardContainer: {
      flexGrow: 1,
      flex: 0, // override style flex 1 inside PollChoiceCard. It require to make height card correct
      marginHorizontal: spacing.xl,
      marginBottom: spacing.m,
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
    androidModalContainer: {
      paddingHorizontal: spacing.xxxl,
    },
    toolTipMenuButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconMenuToolTip: {
      marginRight: spacing.m,
    },
    menuContainer: {
      marginVertical: spacing.xl,
    },
  };
});
