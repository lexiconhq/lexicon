import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormContext } from 'react-hook-form';

import {
  ActionSheet,
  ActionSheetProps,
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
  NestedComment,
  CustomFlatList,
  CustomFlatlistRefType,
  RenderItemCustomOption,
  PressMoreParams,
  PressReplyParams,
  PostDetailHeaderItemProps,
  PostDetailHeaderItem,
} from '../../components';
import {
  MAX_POST_COUNT_PER_REQUEST,
  RESULTS_DROPDOWN_OPTIONS,
} from '../../constants';
import { Text } from '../../core-ui';
import {
  errorHandler,
  errorHandlerAlert,
  filterMarkdownContent,
  handleUnsupportedMarkdown,
  LoginError,
  postDetailContentHandler,
  privateTopicAlert,
  useStorage,
} from '../../helpers';
import {
  useLoadMorePost,
  usePostRaw,
  useTopicDetail,
  useTopicTiming,
} from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { Post, StackNavProp, StackRouteProp } from '../../types';
import { useInitialLoad } from '../../hooks/useInitialLoad';

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
  const { navigate, reset, setParams } = navigation;
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

  const channels = storage.getItem('channels');

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
  const [fromPost, setFromPost] = useState(false);
  const [author, setAuthor] = useState('');
  const [flaggedByCommunity, setFlaggedByCommunity] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [mentionedUsers, setMentionedUsers] = useState<Array<string>>([]);
  const [isHidden, setHidden] = useState(hidden ?? false);
  const [flatListReady, setFlatListReady] = useState(false);

  const postIdOnFocusRef = useRef<number>();
  const postIdOnFocus = postIdOnFocusRef.current;

  const { setValue, reset: resetForm } = useFormContext();

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
                {
                  name: 'Login',
                },
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
    onCompleted: ({ postRaw: { markdownContent, mentions } }) => {
      setContent(markdownContent);
      setMentionedUsers(mentions);
    },
  });

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

  const showOptions =
    false ||
    !!(firstPost && firstPost.canEdit) ||
    (!!firstPost && firstPost.canFlag && !firstPost.hidden);

  useEffect(() => {
    if (!firstPost) {
      return;
    }
    // TODO: Optimize this to fetch the query only when needed #847
    postRaw({ variables: { postId: firstPost.id } });
    setHidden(firstPost.hidden || false);
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
    const unsubscribe = navigation.addListener('focus', () => {
      if (focusedPostNumber != null && prevScreen === 'PostPreview') {
        setParams({ prevScreen: '' });
        setReplyLoading(true);
        refetchData();
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevScreen, focusedPostNumber]);

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

  const navToFlag = (
    postId = postIdOnFocus,
    isPost = fromPost,
    flaggedAuthor = author,
  ) => {
    if (postId) {
      navigate('FlagPost', { postId, isPost, flaggedAuthor });
    }
  };

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

      const newContentFilter = filterMarkdownContent(oldContent);

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
                title: data.title,
                minChoice: data.min,
                maxChoice: data.max,
                step: data.step,
                results: RESULTS_DROPDOWN_OPTIONS.findIndex(
                  ({ value }) => value === data.results,
                ),
                chartType: data.chartType === 'bar' ? 0 : 1,
                isPublic: data.public,
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
        fromPost = true,
        author,
      } = params ?? {};
      if (currentUserId && topic) {
        if (!id || typeof id !== 'number') {
          id = topic.firstPostId;
        }
        postIdOnFocusRef.current = id;
        setCanEditFocusPost(canEdit);
        setCanFlagFocusPost(canFlag);
        setFlaggedByCommunity(flaggedByCommunity);
        setShowActionSheet(true);
        if (author) {
          setAuthor(author);
        }
        setFromPost(fromPost);
      } else {
        errorHandlerAlert(LoginError, navigate);
      }
    },
    [currentUserId, navigate, firstPost, topic],
  );

  const actionItemOptions = () => {
    let options: ActionSheetProps['options'] = [];
    ios && options.push({ label: t('Cancel') });
    canEditFocusPost && options.push({ label: t('Edit Post') });
    !flaggedByCommunity &&
      options.push({
        label: canFlagFocusPost ? t('Flag') : t('Flagged'),
        disabled: !canFlagFocusPost,
      });
    return options;
  };

  const actionItemOnPress = (btnIndex: number) => {
    switch (btnIndex) {
      case 0: {
        return canEditFocusPost ? navToPost() : navToFlag();
      }
      case 1: {
        return canEditFocusPost && !flaggedByCommunity && navToFlag();
      }
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
    (params?: PressReplyParams) => {
      if (!currentUserId) {
        return errorHandlerAlert(LoginError, navigate);
      }
      if (!topic) {
        return;
      }
      navigate('PostReply', {
        topicId,
        title: topic.title,
        replyToPostId: params?.replyToPostId,
      });
    },
    [currentUserId, topic, topicId, navigate],
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
    const { replyToPostNumber, canEdit, canFlag, hidden, id } = item;

    const replyToPostId =
      replyToPostNumber && replyToPostNumber > 0
        ? stream?.[replyToPostNumber - 1]
        : undefined;

    let isItemValid = false;
    if (canEdit) {
      isItemValid = true;
    }
    if (canFlag && !hidden) {
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
          data={postComments ?? []}
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
              postId={firstPost?.id}
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
        />
        <TouchableOpacity
          style={styles.inputCommentContainer}
          onPress={() => onPressReply()}
        >
          <Text style={styles.inputComment}>{t('Write your reply here')}</Text>
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
  inputCommentContainer: {
    backgroundColor: colors.background,
    paddingTop: spacing.l,
    marginHorizontal: spacing.xxl,
  },
  androidModalContainer: {
    paddingHorizontal: spacing.xxxl,
  },
}));
