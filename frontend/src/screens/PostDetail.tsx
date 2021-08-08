import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  VirtualizedList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';

import {
  ActionSheet,
  ActionSheetProps,
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
  NestedComment,
  PostItem,
} from '../components';
import { DEFAULT_CHANNEL } from '../constants';
import { Text } from '../core-ui';
import { client } from '../graphql/client';
import {
  TOPIC_FRAGMENT,
  USER_FRAGMENT,
} from '../graphql/server/getTopicDetail';
import {
  errorHandler,
  errorHandlerAlert,
  getImage,
  handleSpecialMarkdown,
  LoginError,
  postDetailContentHandler,
  useStorage,
} from '../helpers';
import { usePostRaw, useTopicDetail, useTopicTiming } from '../hooks';
import { makeStyles, useTheme } from '../theme';
import { Post, StackNavProp, StackRouteProp } from '../types';
import { usePost } from '../utils';

// postNumber of the topic is 1
// scrollToIndex is postNumber -2 for replies because the postNumber will start at 2
// while the index in flatlist will start at 0

type PostReplyItem = { item: Post };

type OnScrollInfo = {
  index: number;
  highestMeasuredFrameIndex: number;
  averageItemLength: number;
};

const MAX_DEFAULT_LOADED_POST_COUNT = 19;

export default function PostDetail() {
  const { topicsData } = usePost();
  const styles = useStyles();
  const { colors, spacing } = useTheme();

  const navigation = useNavigation<StackNavProp<'PostDetail'>>();
  const { navigate, goBack, setOptions, setParams } = navigation;

  const {
    params: {
      topicId,
      selectedChannelId = -1,
      postNumber = null,
      focusedPostNumber,
      prevScreen,
    },
  } = useRoute<StackRouteProp<'PostDetail'>>();

  const storage = useStorage();
  const currentUserId = storage.getItem('user')?.id;

  const channels = storage.getItem('channels');

  const virtualListRef = useRef<VirtualizedList<Post>>(null);

  const [hasOlderPost, setHasOlderPost] = useState(true);
  const [hasNewerPost, setHasNewerPost] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingOlderPost, setLoadingOlderPost] = useState(false);
  const [loadingNewerPost, setLoadingNewerPost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canFlagFocusPost, setCanFlagFocusPost] = useState(false);
  const [canEditFocusPost, setCanEditFocusPost] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [postIdOnFocus, setPostIdOnFocus] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [stream, setStream] = useState<Array<number>>();
  const [fromPost, setFromPost] = useState(false);
  const [author, setAuthor] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [flaggedByCommunity, setFlaggedByCommunity] = useState(false);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<Array<string>>();
  const [mentionedUsers, setmentionedUsers] = useState<Array<string>>();
  const [isHidden, setHidden] = useState(false);

  const ios = Platform.OS === 'ios';

  useEffect(() => {
    if (selectedChannelId !== -1) {
      setOptions({
        headerLeft: () => (
          <HeaderBackButton
            onPress={goBack}
            style={{
              paddingBottom: ios ? spacing.l : spacing.s,
            }}
            tintColor={colors.primary}
          />
        ),
      });
    }
  }, [colors, goBack, ios, selectedChannelId, setOptions, spacing]);

  const {
    data,
    loading: topicDetailLoading,
    error,
    refetch,
    fetchMore,
  } = useTopicDetail(
    {
      variables: { topicId, postPointer: postNumber },
    },
    'HIDE_ALERT',
  );

  const { postRaw } = usePostRaw({
    onCompleted: ({ postRaw: { raw, listOfCooked, listOfMention } }) => {
      setContent(raw);
      setImages(listOfCooked);
      setmentionedUsers(listOfMention);
    },
    onError: () => {},
  });

  let postDetailContentHandlerResult = useMemo(() => {
    if (!data) {
      return;
    }
    return postDetailContentHandler({
      topicDetailData: data.topicDetail,
      channels,
    });
  }, [data, channels]);

  let topic = postDetailContentHandlerResult?.topic;

  let posts = postDetailContentHandlerResult?.posts;

  useEffect(() => {
    let isItemValid = false;
    if (!!(topic && topic.canEditTopic)) {
      isItemValid = true;
    }
    if (!!(posts && posts[0].canFlag && !posts[0].hidden)) {
      isItemValid = true;
    }
    setShowOptions(isItemValid);
  }, [topic, posts]);

  useEffect(() => {
    const topicData = topicsData.find(
      (topicData) => topicData?.topicId === topicId,
    );
    setContent(topicData?.content || '');
    setHidden(topicData?.hidden || false);
    if (posts) {
      postRaw({ variables: { postId: posts[0].id } });
      setHidden(posts[0].hidden || false);
    }
  }, [posts, topicsData, topicId, postRaw]);

  const onPressViewIgnoredContent = () => {
    setHidden(false);
  };

  useEffect(() => {
    if (data) {
      let topicDetailData = data.topicDetail;
      let {
        stream: tempStream,
        firstPostIndex,
        lastPostIndex,
      } = postDetailContentHandler({ topicDetailData, channels });
      setStream(tempStream || []);
      setStartIndex(firstPostIndex);
      setEndIndex(lastPostIndex);
      setLoading(false);
      setReplyLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const refreshPost = async () => {
    setLoadingRefresh(true);

    refetch({ topicId }).then(({ data }) => {
      const {
        topicDetail: { postStream, title, categoryId, tags },
      } = data;
      const { stream, posts } = postStream;
      const [firstPostId] = stream ?? [0];
      const firstPost = posts.find(({ id }) => firstPostId === id);

      client.writeFragment({
        id: `Topic:${topicId}`,
        fragment: TOPIC_FRAGMENT,
        data: {
          title,
          excerpt: firstPost?.raw,
          imageUrl: firstPost?.listOfCooked || undefined,
          categoryId,
          tags,
        },
      });
      setLoadingRefresh(false);
    });
  };

  const loadOlderPost = async () => {
    if (loadingOlderPost || !hasOlderPost || !stream || topicDetailLoading) {
      return;
    }
    setLoadingOlderPost(true);
    let nextEndIndex = startIndex;
    let newDataCount = Math.min(10, stream.length - nextEndIndex);
    let nextStartIndex = Math.max(0, nextEndIndex - newDataCount);

    let nextPosts = stream.slice(nextStartIndex, nextEndIndex);
    if (!nextPosts.length) {
      return;
    }
    await fetchMore({
      variables: {
        topicId,
        posts: nextPosts,
      },
    });
    setStartIndex(nextStartIndex);
    setLoadingOlderPost(false);
  };

  const loadNewerPost = async () => {
    if (loadingNewerPost || !hasNewerPost || !stream || topicDetailLoading) {
      return;
    }
    setLoadingNewerPost(true);
    let nextStartIndex = endIndex + 1;
    let newDataCount = Math.min(10, stream.length - nextStartIndex);
    let nextEndIndex = nextStartIndex + newDataCount;

    let nextPosts = stream.slice(nextStartIndex, nextEndIndex);
    if (!nextPosts.length) {
      return;
    }
    await fetchMore({
      variables: {
        topicId,
        posts: nextPosts,
      },
    });
    setEndIndex(nextEndIndex - 1);
    setLoadingNewerPost(false);
  };

  useTopicTiming(topicId, startIndex, stream);

  useEffect(() => {
    if (!stream || !posts) {
      return;
    }
    setHasOlderPost(stream[0] !== posts[0].id);
    setHasNewerPost(stream[stream.length - 1] !== posts[posts.length - 1].id);
  }, [stream, topicId, posts]);

  useEffect(() => {
    async function refetchData() {
      let index = 0;
      if (focusedPostNumber === 1) {
        await refetch({ topicId });
      } else {
        const result = await refetch({
          topicId,
          postPointer: focusedPostNumber,
        });
        let {
          data: {
            topicDetail: { postStream },
          },
        } = result;
        const firstPostIndex =
          postStream.stream?.findIndex(
            (postId) => postId === postStream.posts[0].id,
          ) || 0;
        let pointerToIndex = focusedPostNumber
          ? focusedPostNumber - 1 - firstPostIndex
          : 0;
        index = Math.min(MAX_DEFAULT_LOADED_POST_COUNT, pointerToIndex);
      }
      setTimeout(() => {
        try {
          virtualListRef.current &&
            virtualListRef.current.scrollToIndex({
              index,
              animated: true,
            });
        } catch {
          virtualListRef.current && virtualListRef.current.scrollToEnd();
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

  useEffect(() => {
    if (virtualListRef.current && postNumber) {
      if (posts?.slice(1).length !== 0) {
        virtualListRef.current.scrollToIndex({
          animated: true,
          index: postNumber > 1 ? postNumber - 2 - startIndex : 0,
        });
      }
    }
  }, [virtualListRef.current?.state]); // eslint-disable-line

  if (error) {
    return <LoadingOrError message={errorHandler(error)} />;
  }

  const onPressAuthor = (username: string) => {
    navigate('UserInformation', { username });
  };

  const renderTopicFromCache = () => {
    const cacheTopic = client.readFragment({
      id: `Topic:${topicId}`,
      fragment: TOPIC_FRAGMENT,
    });

    if (cacheTopic) {
      const cacheUser = client.readFragment({
        id: `UserIcon:${cacheTopic.authorUserId}`,
        fragment: USER_FRAGMENT,
      });

      const cacheFreqPoster = cacheTopic.posters?.map(
        (item: { userId: number }) => {
          let user = client.readFragment({
            id: `UserIcon:${item.userId}`,
            fragment: USER_FRAGMENT,
          });
          const { id, username, avatar } = user;
          return {
            id,
            username,
            avatar: getImage(avatar),
          };
        },
      );

      const channels = storage.getItem('channels');
      const channel = channels?.find(
        (channel) => channel.id === cacheTopic.categoryId,
      );

      const { title, excerpt, hidden, imageUrl, tags } = cacheTopic;
      const { username, avatar } = cacheUser;
      let tempPost = {
        id: 0,
        topicId,
        title,
        content: excerpt,
        hidden,
        username,
        avatar: getImage(avatar),
        images: [imageUrl] ?? undefined,
        viewCount: 0,
        replyCount: 0,
        likeCount: 0,
        isLiked: false,
        channel: channel ?? DEFAULT_CHANNEL,
        tags,
        createdAt: '',
        freqPosters: cacheFreqPoster ?? [],
      };

      return (
        <PostItem
          data={tempPost}
          postList={false}
          nonclickable
          onPressAuthor={onPressAuthor}
          content={content}
          isHidden={isHidden}
        />
      );
    }
    return null;
  };

  if (!data || !topic) {
    if (loading) {
      return renderTopicFromCache() ?? <LoadingOrError loading />;
    }

    return <LoadingOrError message={t('Post is not available')} />;
  }

  if (replyLoading) {
    return <LoadingOrError message={t('Finishing your Reply')} loading />;
  }

  const navToFlag = (
    postId = postIdOnFocus,
    isPost = fromPost,
    flaggedAuthor = author,
  ) => {
    navigate('FlagPost', { postId, isPost, flaggedAuthor });
  };

  const navToPost = (postId = postIdOnFocus) => {
    if (!topic) {
      return;
    }
    const {
      firstPostId,
      id,
      title,
      selectedChanelId: selectedChannelId,
      selectedTag: selectedTagsIds,
    } = topic;
    if (stream && postId === stream[0]) {
      navigate('NewPost', {
        editPostId: firstPostId,
        editTopicId: id,
        selectedChannelId,
        selectedTagsIds,
        oldContent: getPost(firstPostId)?.content,
        oldTitle: title,
        oldChannel: selectedChannelId,
        oldTags: selectedTagsIds,
        editedUser: {
          username: getPost(postId)?.username || '',
          avatar: getPost(postId)?.avatar || '',
        },
      });
    } else {
      navigate('PostReply', {
        topicId,
        title,
        editPostId: postId,
        oldContent: getPost(postId)?.content,
        focusedPostNumber: (getPost(postId)?.postNumber || 2) - 1,
        editedUser: {
          username: getPost(postId)?.username || '',
          avatar: getPost(postId)?.avatar || '',
        },
      });
    }
  };

  const onPressMore = (
    id?: number,
    canFlag = !!(posts && posts[0].canFlag),
    canEdit = !!(topic && topic.canEditTopic),
    flaggedByCommunity = !!(posts && posts[0].hidden),
    fromPost = true,
    author?: string,
  ) => {
    if (currentUserId && topic) {
      if (!id || typeof id !== 'number') {
        id = topic.firstPostId;
      }
      setPostIdOnFocus(id);
      setCanEditFocusPost(canEdit);
      setCanFlagFocusPost(canFlag);
      setFlaggedByCommunity(flaggedByCommunity);
      setShowActionSheet(true);
      if (author) {
        setAuthor(author);
      }
      if (!fromPost) {
        setFromPost(false);
      } else {
        setFromPost(true);
      }
    } else {
      errorHandlerAlert(LoginError, navigate);
    }
  };

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

  const getPost = (postId?: number) => {
    if (!posts) {
      return;
    }
    return postId === -1 || postIdOnFocus === -1
      ? undefined
      : posts.find(({ id }) => id === (postId || postIdOnFocus)) || posts[0];
  };

  const getReplyPost = (postNumberReplied: number) => {
    if (!posts) {
      return;
    }
    return posts.find(({ postNumber }) => postNumberReplied === postNumber);
  };

  const onPressReply = (id = -1) => {
    if (currentUserId) {
      if (stream && topic) {
        navigate('PostReply', {
          topicId,
          title: topic.title,
          post: getPost(id),
          focusedPostNumber: stream.length,
        });
      }
    } else {
      errorHandlerAlert(LoginError, navigate);
    }
  };

  let arrayCommentLikeCount = posts
    ? posts.slice(1).map((val) => {
        return val.likeCount;
      })
    : [];

  let sumCommentLikeCount = arrayCommentLikeCount.reduce((a, b) => a + b, 0);

  let currentPost = topicsData.filter((val) => {
    return val.topicId === topicId;
  });

  const getItem = (data: Array<Post>, index: number) => data[index];

  const getItemCount = (data: Array<Post>) => data.length;

  const keyExtractor = ({ id }: Post) => `post-${id}`;

  const renderItem = ({ item }: PostReplyItem) => {
    const { replyToPostNumber, canEdit, canFlag, hidden, id, username } = item;
    const replyPost =
      replyToPostNumber !== -1
        ? getReplyPost(replyToPostNumber ?? 1)
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
        data={item}
        replyTo={replyPost}
        key={id}
        style={styles.lowerContainer}
        showOptions={isItemValid}
        onPressReply={() => onPressReply(id)}
        onPressMore={() =>
          onPressMore(id, canFlag, canEdit, hidden, false, username)
        }
        onPressAuthor={onPressAuthor}
      />
    );
  };

  const onScrollHandler = ({ index }: OnScrollInfo) => {
    setTimeout(
      () =>
        virtualListRef.current?.scrollToIndex({
          animated: true,
          index,
        }),
      50,
    );
  };

  return (
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
        <VirtualizedList
          ref={virtualListRef}
          refreshControl={
            <RefreshControl
              refreshing={
                (loadingRefresh || topicDetailLoading) && !loadingNewerPost
              }
              onRefresh={refreshPost}
              tintColor={colors.primary}
            />
          }
          data={posts && posts.slice(1)}
          getItem={getItem}
          getItemCount={getItemCount}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={5}
          maxToRenderPerBatch={7}
          windowSize={10}
          ListHeaderComponent={
            posts && stream && posts[0].id === stream[0] && topic ? (
              <PostItem
                data={{
                  ...posts[0],
                  likeCount:
                    currentPost.length !== 0
                      ? currentPost[0].likeCount - sumCommentLikeCount
                      : 0,
                  content: handleSpecialMarkdown(posts[0].content),
                  title: topic.title,
                  tags: topic.selectedTag,
                  viewCount: topic.viewCount,
                  replyCount: topic.replyCount,
                }}
                postList={false}
                nonclickable
                onPressAuthor={onPressAuthor}
                content={content}
                images={images}
                mentionedUsers={mentionedUsers}
                isHidden={isHidden}
                onPressViewIgnoredContent={onPressViewIgnoredContent}
              />
            ) : (
              renderTopicFromCache()
            )
          }
          onRefresh={hasOlderPost ? loadOlderPost : refreshPost}
          refreshing={
            (loadingRefresh || loadingOlderPost || topicDetailLoading) &&
            !loadingNewerPost
          }
          onEndReachedThreshold={0.1}
          onEndReached={loadNewerPost}
          ListFooterComponent={
            <FooterLoadingIndicator isHidden={!hasNewerPost} />
          }
          style={styles.scrollViewContainer}
          initialScrollIndex={0}
          onScrollToIndexFailed={onScrollHandler}
        />
        <TouchableOpacity
          style={styles.inputCommentContainer}
          onPress={() => onPressReply(-1)}
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
