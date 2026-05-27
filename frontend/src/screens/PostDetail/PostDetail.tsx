import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert, Platform, SafeAreaView, TouchableOpacity } from 'react-native';

import {
  ActionSheet,
  ActionSheetProps,
  BlockedUserContent,
  HiddenWordsContent,
  CustomFlatList,
  CustomFlatlistRefType,
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
  NestedComment,
  PostDetailHeaderItem,
  PostDetailHeaderItemProps,
  PressMoreParams,
  PressReplyParams,
  RenderItemCustomOption,
} from '../../components';
import {
  FORM_DEFAULT_VALUES,
  MAX_POST_COUNT_PER_REQUEST,
  RESULTS_DROPDOWN_OPTIONS,
} from '../../constants';
import { Text } from '../../core-ui';
import {
  canShowReportOption,
  checkDraftAlert,
  errorHandler,
  errorHandlerAlert,
  filterMarkdownContentPoll,
  filterPostsByBlockedUsernames,
  filterPostsByHiddenWords,
  shouldHidePostByHiddenWords,
  textContainsHiddenWord,
  handleUnsupportedMarkdown,
  LoginError,
  postDetailContentHandler,
  privateTopicAlert,
  reportOptionLabel,
  useBlockUserActions,
  useStorage,
} from '../../helpers';
import { navigate as rootNavigate } from '../../navigation/NavigationService';
import { useBlockedUsers, useHiddenWords } from '../../utils';
import {
  useDeletePostDraft,
  useLazyCheckPostDraft,
  useLoadMorePost,
  usePostRaw,
  useTopicDetail,
  useTopicTiming,
} from '../../hooks';
import { useInitialLoad } from '../../hooks/useInitialLoad';
import { makeStyles, useTheme } from '../../theme';
import { NewPostForm, Post, StackNavProp, StackRouteProp } from '../../types';

import { useNotificationScroll } from './hooks';
import PostDetailSkeletonLoading from './PostDetailSkeletonLoading';

// postNumber of the topic is 1
// scrollToIndex is postNumber -2 for replies because the postNumber will start at 2
// while the index in flatlist will start at 0

type PostReplyItem = { item: Post };

type OnScrollInfo = {
  index: number;
  highestMeasuredFrameIndex: number;
  averageItemLength: number;
};

const MAX_DEFAULT_LOADED_POST_INDEX = MAX_POST_COUNT_PER_REQUEST - 1;

export default function PostDetail() {
  const styles = useStyles();
  const { colors } = useTheme();

  const navigation = useNavigation<StackNavProp<'PostDetail'>>();
  const { navigate, reset, setParams, goBack } = navigation;
  const useInitialLoadResult = useInitialLoad();

  const {
    params: {
      topicId,
      postNumber = null,
      focusedPostNumber,
      prevScreen,
      hidden,
      content: initialContent,
    },
  } = useRoute<StackRouteProp<'PostDetail'>>();

  const storage = useStorage();
  const currentUserId = storage.getItem('user')?.id;
  const currentUsername = storage.getItem('user')?.username;

  const channels = storage.getItem('channels');
  const { blockedUsernames, isBlocked } = useBlockedUsers();
  const { hiddenWords } = useHiddenWords();
  const {
    canBlockUsername,
    toggleBlock,
    promptUnblock,
    isUpdating: isBlockUpdating,
  } = useBlockUserActions();

  const customFlatListRef = useRef<CustomFlatlistRefType>(null);

  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canFlagFocusPost, setCanFlagFocusPost] = useState(false);
  const [canEditFocusPost, setCanEditFocusPost] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [firstLoadedCommentIndex, setFirstLoadedCommentIndex] =
    useState<number>();
  const [lastLoadedCommentIndex, setLastLoadedCommentIndex] =
    useState<number>();
  const [author, setAuthor] = useState('');
  const [flaggedByCommunity, setFlaggedByCommunity] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [firstPostId, setFirstPostId] = useState<number>(0);
  const [mentionedUsers, setMentionedUsers] = useState<Array<string>>([]);
  const [isHidden, setHidden] = useState(hidden ?? false);
  const [flatListReady, setFlatListReady] = useState(false);

  const postIdOnFocusRef = useRef<number>();
  const postIdOnFocus = postIdOnFocusRef.current;

  const { setValue, reset: resetForm } = useFormContext<NewPostForm>();

  const ios = Platform.OS === 'ios';

  const {
    data,
    loading: topicDetailLoading,
    error,
    refetch,
    fetchMore,
  } = useTopicDetail(
    {
      variables: { topicId, postNumber, includeFirstPost: true },
      onCompleted: ({ topicDetail }) => {
        if (topicDetail.deletedAt) {
          Alert.alert(t('Error'), t('This topic has been deleted.'), [
            {
              text: t('Got it'),
              onPress: () => {
                goBack();
              },
            },
          ]);
        }
      },
      onError: (error) => {
        /**
         * if we get error about private post which cannot be access.
         * we need check first it is because user haven't login or because post it self only open to specific group
         * if user not login we will redirect to login scene.
         * But if user already login still get same error will redirect to home scene and show private post alert
         */

        const isAccessDenied =
          error.message.includes('Invalid Access') ||
          error.message.includes('403') ||
          (error.networkError &&
            'statusCode' in error.networkError &&
            error.networkError.statusCode === 403);

        if (isAccessDenied) {
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
            privateTopicAlert();
          }
        }
      },
    },
    'HIDE_ALERT',
  );

  const { postRaw } = usePostRaw({
    onCompleted: ({ postRaw: { cooked } }) => {
      setContent(cooked.markdownContent);
      setMentionedUsers(cooked.mentions);
    },
  });

  const { deletePostDraft } = useDeletePostDraft();

  const { checkPostDraft } = useLazyCheckPostDraft();

  let postDetailContent = useMemo(() => {
    if (!data) {
      return;
    }
    return postDetailContentHandler({
      topicDetailData: data.topicDetail,
      channels,
    });
  }, [data, channels]);

  const { topic, postComments, firstPost, stream } = postDetailContent ?? {};

  const visiblePostComments = useMemo(
    () =>
      filterPostsByHiddenWords(
        filterPostsByBlockedUsernames(postComments ?? [], blockedUsernames),
        hiddenWords,
      ),
    [blockedUsernames, hiddenWords, postComments],
  );

  const topicAuthorBlocked = firstPost
    ? isBlocked(firstPost.username)
    : false;

  const topicHiddenByWords = useMemo(() => {
    if (!hiddenWords.length) {
      return false;
    }
    if (firstPost && shouldHidePostByHiddenWords(firstPost, hiddenWords)) {
      return true;
    }
    return textContainsHiddenWord(topic?.title, hiddenWords);
  }, [firstPost, hiddenWords, topic?.title]);

  const firstPostAuthor = firstPost?.username;
  const canBlockFirstPostAuthor = firstPostAuthor
    ? canBlockUsername(firstPostAuthor)
    : false;

  const canReportFirstPost =
    !!firstPost &&
    canShowReportOption({
      hidden: firstPost.hidden,
      authorUsername: firstPost.username,
      currentUsername,
      canFlag: firstPost.canFlag,
      isLoggedIn: !!currentUserId,
    });

  const showOptions =
    canBlockFirstPostAuthor ||
    !!(firstPost && firstPost.canEdit) ||
    canReportFirstPost;

  useEffect(() => {
    if (!firstPost) {
      return;
    }
    setHidden(firstPost.hidden || false);
    setFirstPostId(firstPost.id);

    if (firstPost.content?.trim()) {
      setContent(firstPost.content);
      if (firstPost.mentionedUsers?.length) {
        setMentionedUsers(firstPost.mentionedUsers);
      }
      return;
    }

    // Fallback when topic detail did not include raw body (see #847).
    postRaw({ variables: { postId: firstPost.id } });
  }, [firstPost, postRaw]);

  useEffect(() => {
    if (postDetailContent) {
      let { firstLoadedCommentIndex, lastLoadedCommentIndex } =
        postDetailContent;
      if (firstLoadedCommentIndex && lastLoadedCommentIndex) {
        setFirstLoadedCommentIndex(firstLoadedCommentIndex);
        setLastLoadedCommentIndex(lastLoadedCommentIndex);
      }
      setLoading(false);
      setReplyLoading(false);
    }
  }, [postDetailContent]);

  const onPressViewIgnoredContent = () => {
    setHidden(false);
  };

  const refreshPost = async () => {
    setLoadingRefresh(true);
    /**
     * unset postNumber since refetching when we have postNumber will
     * preserve the postNumber (which might not return firstPost)
     */
    refetch({ topicId, postNumber: undefined }).then(() => {
      setLoadingRefresh(false);
    });
  };
  const { loadMorePosts, isLoadingOlderPost, isLoadingNewerPost } =
    useLoadMorePost(topicId);
  const loadMoreComments = async (loadNewerPosts: boolean) => {
    if (topicDetailLoading) {
      return;
    }
    let newPostIndex = await loadMorePosts({
      fetchMore,
      firstLoadedPostIndex: firstLoadedCommentIndex,
      lastLoadedPostIndex: lastLoadedCommentIndex,
      stream: stream ?? undefined,
      loadNewerPosts,
      fetchMoreVariables: { includeFirstPost: undefined },
      hasMorePost: loadNewerPosts ? hasNewerPost : hasOlderPost,
    });
    if (!newPostIndex) {
      return;
    }
    const { nextLastLoadedPostIndex, nextFirstLoadedPostIndex } = newPostIndex;
    if (loadNewerPosts) {
      setLastLoadedCommentIndex(nextLastLoadedPostIndex);
      return;
    }
    setFirstLoadedCommentIndex(nextFirstLoadedPostIndex);
  };

  useTopicTiming(topicId, firstLoadedCommentIndex, stream ?? undefined);

  let firstCommentId = stream?.[1];
  let hasOlderPost =
    stream && postComments?.length
      ? firstCommentId !== postComments[0].id
      : false;
  let hasNewerPost =
    stream && postComments?.length
      ? stream[stream.length - 1] !== postComments[postComments.length - 1].id
      : false;

  useEffect(() => {
    async function refetchData() {
      let index = 0;
      if (focusedPostNumber === 1) {
        await refetch({ topicId });
      } else {
        await refetch({
          topicId,
          postNumber: focusedPostNumber,
        });

        const firstCommentPostNumber = postComments?.[0].postNumber ?? 0;
        const pointerToIndex = focusedPostNumber
          ? focusedPostNumber - firstCommentPostNumber
          : 0;
        index = Math.min(MAX_DEFAULT_LOADED_POST_INDEX, pointerToIndex);
      }
      setTimeout(() => {
        try {
          customFlatListRef.current?.scrollToIndex({
            index,
            animated: true,
          });
        } catch {
          customFlatListRef.current?.scrollToEnd();
        }
      }, 500);
    }

    if (
      focusedPostNumber != null &&
      prevScreen === 'PostPreview' &&
      !topicDetailLoading
    ) {
      setParams({ prevScreen: '' });
      setReplyLoading(true);
      refetchData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevScreen, focusedPostNumber, topicDetailLoading]);

  let scrollIndex = postComments?.findIndex(
    ({ postNumber: itemPostNumber }) => postNumber === itemPostNumber,
  );

  useNotificationScroll({
    index: scrollIndex,
    virtualizedListRef: customFlatListRef,
    shouldScroll: !!postNumber && scrollIndex !== -1 && flatListReady,
  });

  const onPressAuthor = useCallback(
    (username: string) => {
      navigate('UserInformation', { username });
    },
    [navigate],
  );

  const navigateToReport = useCallback(() => {
    if (!currentUserId) {
      errorHandlerAlert(LoginError, navigate);
      return;
    }

    const reportPostId = postIdOnFocusRef.current ?? topic?.firstPostId;
    if (!reportPostId || !topic) {
      return;
    }

    const isTopicFlag = reportPostId === topic.firstPostId;

    navigate('FlagPost', {
      postId: reportPostId,
      topicId,
      isPost: isTopicFlag,
      flaggedAuthor: author || firstPost?.username,
    });
  }, [
    author,
    currentUserId,
    firstPost?.username,
    navigate,
    topic,
    topicId,
  ]);

  const navToPost = () => {
    if (!topic || !postIdOnFocus || !firstPost) {
      return;
    }
    const {
      firstPostId,
      id,
      title,
      selectedChannelId,
      selectedTag: selectedTagsIds,
    } = topic;

    const { polls } = firstPost;
    const focusedPost = getPost(postIdOnFocus);
    if (!focusedPost) {
      return;
    }
    const {
      content: oldContent,
      postNumber: focusedPostNumber,
      username,
      avatar,
    } = focusedPost;

    if (postIdOnFocus === firstPostId) {
      /**
       * Here, we set the default value of the form context before navigating to edit a post.
       * This is done to check if the value has changed compared to the initial value of the post before editing, using `react-hook-form`'s `isDirty` feature.
       */

      const newContentFilter = filterMarkdownContentPoll(oldContent);

      /**
       * Add polls reset from based on PollFormContextValues type for default value if polls not null
       * which mean if not empty array the post already has poll
       */

      resetForm({
        title: title,
        raw: newContentFilter.filteredMarkdown,
        tags: selectedTagsIds,
        channelId: selectedChannelId,
        editPostId: firstPostId,
        editTopicId: id,
        polls:
          (polls &&
            newContentFilter.pollMarkdowns.length &&
            polls.map((data, index) => {
              return {
                title: data.title || '',
                minChoice: data.min || 0,
                maxChoice: data.max || 0,
                step: data.step || 0,
                results: RESULTS_DROPDOWN_OPTIONS.findIndex(
                  ({ value }) => value === data.results,
                ),
                chartType: data.chartType === 'bar' ? 0 : 1,
                isPublic: data.public ?? false,
                pollOptions: data.options.map(({ html }) => ({
                  option: html,
                })),
                groups: data.groups?.split(',') || [],
                pollChoiceType: data.type,
                closeDate: data.close ? new Date(data.close) : undefined,
                pollContent: newContentFilter.pollMarkdowns[index],
              };
            })) ||
          [],
      });

      setValue('oldContent', newContentFilter.filteredMarkdown);
      setValue('oldTitle', title);

      navigate('NewPost', {
        editedUser: { username, avatar },
      });
      return;
    }
    navigate('PostReply', {
      topicId,
      title,
      replyToPostId: postIdOnFocus,
      editPostId: postIdOnFocus,
      oldContent,
      focusedPostNumber,
      editedUser: { username, avatar },
    });
  };

  const onPressMore = useCallback(
    (params?: PressMoreParams) => {
      let {
        id,
        canFlag = !!(firstPost && firstPost.canFlag),
        canEdit = !!(firstPost && firstPost.canEdit),
        flaggedByCommunity = !!(firstPost && firstPost.hidden),
        author: postAuthor,
      } = params ?? {};

      const blockTargetUsername = postAuthor ?? firstPost?.username;
      if (!blockTargetUsername) {
        return;
      }

      const canBlockTarget = canBlockUsername(blockTargetUsername);

      if (!currentUserId) {
        if (!canBlockTarget) {
          errorHandlerAlert(LoginError, navigate);
          return;
        }
        postIdOnFocusRef.current = undefined;
        setCanEditFocusPost(false);
        setCanFlagFocusPost(false);
        setFlaggedByCommunity(false);
        setAuthor(blockTargetUsername);
        setShowActionSheet(true);
        return;
      }

      if (!topic) {
        return;
      }

      if (!id || typeof id !== 'number') {
        id = topic.firstPostId;
      }
      postIdOnFocusRef.current = id;
      setCanEditFocusPost(canEdit);
      setCanFlagFocusPost(canFlag);
      setFlaggedByCommunity(flaggedByCommunity);
      setAuthor(blockTargetUsername);
      setShowActionSheet(true);
    },
    [
      canBlockUsername,
      currentUserId,
      currentUsername,
      firstPost,
      navigate,
      topic,
    ],
  );

  const actionItemOptions = () => {
    let options: ActionSheetProps['options'] = [];
    const blockTargetUsername = author || firstPost?.username;

    ios && options.push({ label: t('Cancel'), variant: 'cancel' });
    if (currentUserId && canEditFocusPost) {
      options.push({ label: t('Edit Post'), variant: 'default' });
    }
    if (
      blockTargetUsername &&
      canShowReportOption({
        hidden: flaggedByCommunity,
        authorUsername: blockTargetUsername,
        currentUsername,
        canFlag: canFlagFocusPost,
        isLoggedIn: !!currentUserId,
      })
    ) {
      const { label, disabled } = reportOptionLabel({
        isLoggedIn: !!currentUserId,
        canFlag: canFlagFocusPost,
      });
      options.push({
        label,
        disabled,
        variant: 'default',
      });
    }
    if (blockTargetUsername && canBlockUsername(blockTargetUsername)) {
      const blocked = isBlocked(blockTargetUsername);
      options.push({
        label: blocked ? t('Unblock user') : t('Block user'),
        variant: blocked ? 'default' : 'destructive',
      });
    }
    return options;
  };

  const actionItemOnPress = (_btnIndex: number, label: string) => {
    const blockTargetUsername = author || firstPost?.username;

    if (label === t('Edit Post')) {
      return navToPost();
    }
    if (label === t('Report') || label === t('Reported')) {
      return navigateToReport();
    }
    if (
      blockTargetUsername &&
      (label === t('Block user') || label === t('Unblock user'))
    ) {
      return toggleBlock(blockTargetUsername);
    }
  };

  const getPost = useCallback(
    (postId: number) => {
      if (!postComments) {
        return;
      }
      return postComments.find(({ id }) => id === postId) ?? firstPost;
    },
    [postComments, firstPost],
  );

  const onPressReply = useCallback(
    async (params?: PressReplyParams) => {
      if (!currentUserId) {
        return errorHandlerAlert(LoginError, navigate);
      }
      if (!topic) {
        return;
      }
      const draftKey = `topic_${topicId}`;
      let { data, error } = await checkPostDraft({
        variables: { draftKey },
      });

      if (data && !error) {
        const { checkPostDraft } = data;
        const { selectedChannelId, selectedTag } = topic;

        setValue('sequence', checkPostDraft.sequence);
        setValue('channelId', selectedChannelId);
        setValue('tags', selectedTag);

        if (
          checkPostDraft.draft &&
          // eslint-disable-next-line no-underscore-dangle
          checkPostDraft.draft.__typename === 'PostReplyDraft'
        ) {
          return checkDraftAlert({
            navigate,
            setValue,
            resetForm,
            checkPostDraft,
            deletePostDraft,
            replyToPostId: params?.replyToPostId,
            titleTopic: topic.title,
            topicId,
            channelId: selectedChannelId,
          });
        }
      } else {
        resetForm(FORM_DEFAULT_VALUES);
      }
      navigate('PostReply', {
        topicId,
        title: topic.title,
        replyToPostId: params?.replyToPostId,
      });
    },
    [
      currentUserId,
      topic,
      checkPostDraft,
      topicId,
      navigate,
      setValue,
      resetForm,
      deletePostDraft,
    ],
  );

  let onPressReplyProps: PostDetailHeaderItemProps['onPressReply'] = ({
    postId,
  }) => {
    postId && onPressReply({ replyToPostId: postId });
  };

  const keyExtractor = ({ id }: Post) => `post-${id}`;

  const renderItem = (
    { item }: PostReplyItem,
    { isItemLoading, onLayout }: RenderItemCustomOption,
  ) => {
    if (
      isBlocked(item.username) ||
      shouldHidePostByHiddenWords(item, hiddenWords)
    ) {
      return null;
    }

    const { replyToPostNumber, canEdit, canFlag, hidden, id } = item;

    const replyToPostId =
      replyToPostNumber && replyToPostNumber > 0
        ? stream?.[replyToPostNumber - 1]
        : undefined;

    let isItemValid = false;
    if (canEdit) {
      isItemValid = true;
    }
    if (
      canShowReportOption({
        hidden,
        authorUsername: item.username,
        currentUsername,
        canFlag,
        isLoggedIn: !!currentUserId,
      })
    ) {
      isItemValid = true;
    }
    if (canBlockUsername(item.username)) {
      isItemValid = true;
    }
    return (
      <NestedComment
        {...item}
        key={id}
        isLoading={isItemLoading}
        replyToPostId={replyToPostId}
        showOptions={isItemValid}
        style={styles.lowerContainer}
        onLayout={onLayout}
        onPressReply={onPressReply}
        onPressMore={onPressMore}
        onPressAuthor={onPressAuthor}
        testIDStatus={`PostDetail:NestedComment:Author:EmojiStatus`}
      />
    );
  };

  const onScrollToIndexFailedHandler = ({ index: _ }: OnScrollInfo) => {
    // TODO: Add error report here
    // The setTimeout behavior removed as this will create infinite loop
  };

  let isLoading = (loading || replyLoading) && !error;
  if (error) {
    return (
      <LoadingOrError
        message={
          error
            ? errorHandler(error, true, t('topic'))
            : isLoading
            ? replyLoading
              ? t('Finishing your Reply')
              : undefined
            : t('Post is not available')
        }
      />
    );
  }
  if (topicAuthorBlocked && firstPost) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="" noShadow />
        <BlockedUserContent
          username={firstPost.username}
          showUnblock={canBlockFirstPostAuthor}
          onUnblock={() => promptUnblock(firstPost.username)}
          isUpdating={isBlockUpdating}
        />
      </SafeAreaView>
    );
  }

  if (topicHiddenByWords) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="" noShadow />
        <HiddenWordsContent />
      </SafeAreaView>
    );
  }

  return isLoading ? (
    <PostDetailSkeletonLoading isLoading={isLoading} />
  ) : (
    <>
      <SafeAreaView style={styles.container}>
        {showOptions && (
          <CustomHeader
            title=""
            rightIcon="More"
            onPressRight={onPressMore}
            noShadow
          />
        )}

        <CustomFlatList
          onLayout={() => {
            setFlatListReady(true);
          }}
          ref={customFlatListRef}
          data={visiblePostComments}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={5}
          maxToRenderPerBatch={7}
          windowSize={10}
          ListHeaderComponent={
            <PostDetailHeaderItem
              topicId={topicId}
              postDetailContent={postDetailContent}
              content={handleUnsupportedMarkdown(firstPost?.content || content)}
              mentionedUsers={mentionedUsers}
              isHidden={isHidden}
              onPressViewIgnoredContent={onPressViewIgnoredContent}
              onPressReply={onPressReplyProps}
              polls={firstPost?.polls}
              pollsVotes={firstPost?.pollsVotes}
              postId={firstPost?.id ?? firstPostId}
            />
          }
          onRefresh={hasOlderPost ? () => loadMoreComments(false) : refreshPost}
          refreshing={
            (loadingRefresh || isLoadingOlderPost) && !isLoadingNewerPost
          }
          refreshControlTintColor={colors.loading}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadMoreComments(true)}
          ListFooterComponent={
            <FooterLoadingIndicator isHidden={!hasNewerPost} />
          }
          style={styles.scrollViewContainer}
          initialScrollIndex={0}
          onScrollToIndexFailed={onScrollToIndexFailedHandler}
          testID="PostDetail:List"
        />
        <TouchableOpacity
          style={styles.inputCommentContainer}
          onPress={() =>
            currentUserId ? onPressReply() : rootNavigate('Welcome')
          }
          testID="PostDetail:Button:Reply"
        >
          <Text
            style={[
              styles.inputComment,
              !currentUserId && styles.inputCommentSignIn,
            ]}
          >
            {currentUserId
              ? t('Write your reply here')
              : t('Sign in to reply')}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <TouchableOpacity>
        {stream && (
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
        )}
      </TouchableOpacity>
    </>
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
  lowerContainer: {
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.backgroundDarker,
  },
  inputComment: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: colors.textLighter,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.s,
    marginBottom: spacing.xxl,
    backgroundColor: colors.backgroundDarker,
    borderRadius: 4,
    padding: spacing.m,
  },
  inputCommentSignIn: {
    color: colors.primary,
    fontWeight: '600',
  },
  inputCommentContainer: {
    backgroundColor: colors.background,
    paddingTop: spacing.l,
    marginHorizontal: spacing.xxl,
  },
  androidModalContainer: {
    paddingHorizontal: spacing.xxxl,
  },
}));
