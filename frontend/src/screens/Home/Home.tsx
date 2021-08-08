import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Animated, PixelRatio, Platform, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';

import {
  FooterLoadingIndicator,
  LoadingOrError,
  PostList,
  PostListRef,
  SegmentedControl,
} from '../../components';
import { DEFAULT_CHANNEL, NO_EXCERPT_WORDING } from '../../constants';
import { FloatingButton } from '../../core-ui';
import { TopicsSortEnum } from '../../generated/server/globalTypes';
import { Topics, TopicsVariables } from '../../generated/server/Topics';
import { client } from '../../graphql/client';
import { TOPICS } from '../../graphql/server/topics';
import {
  errorHandler,
  errorHandlerAlert,
  getImage,
  getToken,
  handleDuplicatePost,
  LoginError,
  removeToken,
  setToken,
  showLogoutAlert,
  useStorage,
} from '../../helpers';
import {
  useAbout,
  useChannels,
  useLazyActivity,
  useLazyTopicList,
  useRefreshToken,
  useSiteSettings,
} from '../../hooks';
import { makeStyles } from '../../theme';
import { Post, StackNavProp, TabNavProp, TabRouteProp } from '../../types';
import { usePost } from '../../utils';

import { HomeNavBar, SearchBar } from './components';

let sortTypes = {
  LATEST: { label: () => t('Latest') },
  TOP: { label: () => t('Top') },
};

let sortOptionsArray = Object.entries(
  sortTypes,
).map(([name, { label }], index) => ({ index, name, label }));

const NAV_BAR_TITLE_SIZE = 24;
const IOS_BAR = 60;
const ANDROID_BAR = 64;

const fontScale = PixelRatio.getFontScale();
const normalizedSize = NAV_BAR_TITLE_SIZE * (fontScale - 1);

const ios = Platform.OS === 'ios';
const statusBarHeight = Constants.statusBarHeight;
const actionBarHeight =
  statusBarHeight + (ios ? IOS_BAR : ANDROID_BAR) + normalizedSize;
const headerViewHeight = 92;

type SortOption = typeof sortOptionsArray[number];

export default function Home() {
  const { topicsData, likedTopic, setTopicsData, setLikedTopic } = usePost();
  const { refetch: siteRefetch, error: siteError } = useSiteSettings();
  const styles = useStyles();

  const tabNavigation = useNavigation<TabNavProp<'Home'>>();
  const stackNavigation = useNavigation<StackNavProp<'TabNav'>>();

  const { params } = useRoute<TabRouteProp<'Home'>>();
  const receivedChannelId = params === undefined ? 0 : params.selectedChannelId;
  const routeParams = params === undefined ? false : params.backToTop;

  const FIRST_PAGE = 0;

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const headerY = useRef(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(headerY, -200, 500);
  const headerTranslateY = diffClamp.interpolate({
    inputRange: [0, 500],
    outputRange: [actionBarHeight, -(actionBarHeight + headerViewHeight)],
    extrapolateLeft: 'clamp',
  });

  useEffect(() => {
    if (siteError) {
      if (siteError.message === 'Not found or private.') {
        stackNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } else if (siteRefetch) {
      siteRefetch();
    }
  }, [siteError, stackNavigation, siteRefetch]);

  useEffect(() => {
    if (routeParams === true) {
      tabNavigation.setParams({ backToTop: false });
    }
  }, [routeParams, tabNavigation]);

  const [sortState, setSortState] = useState<TopicsSortEnum>(
    TopicsSortEnum.LATEST,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(999);
  const [slide, setSlide] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [page, setPage] = useState(FIRST_PAGE);
  const [hasOlderTopics, setHasOlderTopics] = useState(false);
  const [allTopicCount, setAllTopicCount] = useState(0);
  const [width, setWidth] = useState(0);

  const {
    getRefreshToken,
    data: tokenResponse,
    error: tokenError,
  } = useRefreshToken({ fetchPolicy: 'network-only' }, 'HIDE_ALERT');

  useEffect(() => {
    const currentUserId = storage.getItem('user')?.id;
    if (tokenResponse && tokenResponse.refreshToken.id === currentUserId) {
      setToken(tokenResponse.refreshToken.token);
    } else if (tokenError && currentUserId) {
      removeToken();
      storage.removeItem('user');
      showLogoutAlert();
    }
  }, [tokenResponse, tokenError, stackNavigation.reset, storage]);

  const { loading: channelsLoading, error: channelsError } = useChannels(
    {
      onCompleted: (data) => {
        if (data && data.category.categories) {
          let channels = data.category.categories.map((channel) => {
            let { id, color, name, descriptionText } = channel;
            return { id, color, name, description: descriptionText };
          });
          storage.setItem('channels', channels);
        }
      },
    },
    'HIDE_ALERT',
  );

  const { getAbout, error: aboutError } = useAbout(
    {
      onCompleted: (data) => {
        if (data) {
          const { topicCount } = data.about;
          setAllTopicCount(topicCount);
        }
      },
    },
    'HIDE_ALERT',
  );

  const {
    getActivity,
    data: activityData,
    error: activityError,
  } = useLazyActivity(
    {
      variables: { username, offset: 0, filter: '1' },
      onCompleted: ({ userActivity }) => {
        let likedTopic = userActivity.filter(
          (topic) => topic.actionType === 1 && topic.postNumber === 1,
        );
        let tempTopic: Array<number> = [];
        likedTopic.forEach((topic) => {
          tempTopic.push(topic.topicId ? topic.topicId : 0);
        });
        setLikedTopic(tempTopic);
        setActivityLoading(false);
      },
      onError: () => setActivityLoading(false),
    },
    'HIDE_ALERT',
  );

  const {
    getTopicList,
    loading: topicsLoading,
    error: topicsError,
    refetch: refetchTopics,
    fetchMore: fetchMoreTopics,
  } = useLazyTopicList({
    variables:
      selectedChannelId === 999
        ? { sort: sortState, page }
        : { sort: sortState, categoryId: selectedChannelId, page },
    onError: () => {
      setRefreshing(false);
      setLoading(false);
    },
    onCompleted: (data) => {
      if (data) {
        setData(data);
        setLoading(false);
      }
    },
  });

  const setData = useCallback(
    ({ topics }: Topics) => {
      let rawTopicsData = topics?.topicList?.topics
        ? topics.topicList.topics
        : [];
      let usersData = topics?.users || [];
      let channelsData = storage.getItem('channels');
      let normalizedTopicsData: Array<Post> = rawTopicsData.map(
        ({
          posters,
          id,
          title,
          excerpt,
          visible,
          authorUserId,
          pinned,
          liked,
          likeCount,
          postsCount,
          imageUrl,
          tags,
          bumpedAt: createdAt,
          views,
          categoryId,
        }) => {
          let authorUser = usersData.find(({ id }) => id === authorUserId);
          let frequentUser = posters.map(({ userId, user }) => {
            let userData = usersData.find(
              ({ id }) => id === userId || user?.id === id,
            );
            return {
              id: userData?.id || 0,
              username: userData?.username || '',
              avatar: getImage(userData?.avatar ?? ''),
            };
          });
          let channel = channelsData?.find(
            (channel) => channel.id === categoryId,
          );

          return {
            id,
            topicId: id,
            title,
            content: excerpt || NO_EXCERPT_WORDING,
            hidden: !visible,
            username: authorUser?.username || '',
            postId: authorUserId || 0,
            images: imageUrl ? [imageUrl] : undefined,
            avatar: authorUser ? getImage(authorUser.avatar) : '',
            pinned,
            replyCount: postsCount - 1,
            likeCount,
            viewCount: views,
            isLiked: liked || false,
            channel: channel || DEFAULT_CHANNEL,
            tags: tags || [],
            createdAt,
            freqPosters: frequentUser,
          };
        },
      );
      if (normalizedTopicsData.length === allTopicCount) {
        setHasOlderTopics(false);
      } else {
        setHasOlderTopics(true);
      }
      if (sortState === 'LATEST') {
        let sortedDuplicatePost = handleDuplicatePost(
          topicsData,
          normalizedTopicsData,
        ).sort((a, b) => {
          if (a.createdAt === b.createdAt) {
            return 0;
          }
          if (a.pinned === true) {
            return -1;
          }
          if (b.pinned === true) {
            return 1;
          }

          if (a.createdAt > b.createdAt) {
            return -1;
          }
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          return 0;
        });
        setTopicsData(sortedDuplicatePost);
      } else {
        setTopicsData(handleDuplicatePost(topicsData, normalizedTopicsData));
      }
      setDataReady(true);
    },
    [allTopicCount, setTopicsData, storage, topicsData, sortState],
  );

  const getData = useCallback(
    (variables: TopicsVariables) => {
      try {
        const data: Topics | null = client.readQuery({
          query: TOPICS,
          variables,
        });
        data && setData(data);
      } catch (e) {
        setLoading(true);
      }
      getTopicList({ variables });
    },
    [getTopicList, setData],
  );

  useLayoutEffect(() => {
    postListRef.current?.scrollToIndex({ index: 0, viewOffset: 80 });
  }, [selectedChannelId]);

  useEffect(() => {
    let channels = storage.getItem('channels');
    if (channels && receivedChannelId) {
      setSelectedChannelId(receivedChannelId);
      setPage(0);
    } else if (channels) {
      setSelectedChannelId(999);
    }

    const unsubscribe = stackNavigation.addListener('focus', () => {
      const variables: TopicsVariables = {
        sort: sortState,
        categoryId: receivedChannelId === 999 ? 0 : receivedChannelId,
        page: FIRST_PAGE,
      };
      setPage(FIRST_PAGE);
      getData(variables);
      getToken().then((token) => {
        if (token) {
          return getRefreshToken();
        }
      });
      getAbout();
      if (username) {
        getActivity();
      }
    });

    return unsubscribe;
  }, [
    setTopicsData,
    getRefreshToken,
    getAbout,
    getActivity,
    stackNavigation,
    receivedChannelId,
    username,
    storage,
    sortState,
    page,
    getData,
  ]);

  useEffect(() => {
    if (!aboutError) {
      return;
    }
    stackNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [aboutError, stackNavigation]);

  const postListRef = useRef<PostListRef>(null);
  if (routeParams) {
    postListRef.current?.scrollToIndex({ index: 0, viewOffset: 80 });
  }

  const onPressTitle = () => {
    stackNavigation.navigate('Channels', {
      prevScreen: 'Home',
      selectedChannelId: selectedChannelId,
    });
  };

  const onPressAdd = () => {
    const currentUserId = storage.getItem('user')?.id;
    if (currentUserId) {
      stackNavigation.navigate('NewPost', {
        selectedChannelId,
        selectedTagsIds: [],
      });
    } else {
      errorHandlerAlert(LoginError, stackNavigation.navigate);
    }
  };

  const onPressSearch = () => {
    stackNavigation.navigate('Search');
  };

  const onRefresh = () => {
    setRefreshing(true);
    let { cache } = client;
    cache.evict({ id: 'ROOT_QUERY', fieldName: 'topics' });
    cache.gc();
    if (refetchTopics) {
      setPage(FIRST_PAGE);
      refetchTopics().then(() => setRefreshing(false));
    }
  };

  const onSegmentedControlItemPress = ({ name }: SortOption) => {
    const sortState: TopicsSortEnum =
      name === 'LATEST' ? TopicsSortEnum.LATEST : TopicsSortEnum.TOP;
    setSortState(sortState);
    const variables: TopicsVariables =
      selectedChannelId === 999
        ? { sort: sortState, page: FIRST_PAGE }
        : {
            sort: sortState,
            categoryId: selectedChannelId,
            page: FIRST_PAGE,
          };
    setTopicsData([]);
    setPage(FIRST_PAGE);
    getData(variables);
  };

  const onPressReply = (postId: number) => {
    let clickedPost = topicsData.filter((post) => post.id === postId);
    stackNavigation.navigate('PostReply', {
      topicId: postId,
      title: clickedPost[0].title,
      focusedPostNumber: clickedPost[0].replyCount,
    });
  };

  const onEndReached = async () => {
    if (!hasOlderTopics) {
      return;
    }
    const nextPage = page + 1;
    if (fetchMoreTopics) {
      let result = await fetchMoreTopics({
        variables:
          selectedChannelId === 999
            ? { sort: sortState, page: nextPage }
            : {
                sort: sortState,
                categoryId: selectedChannelId,
                page: nextPage,
              },
      });
      if (result.data.topics.topicList?.topics?.length === 0) {
        setHasOlderTopics(false);
      } else {
        setData(result.data);
        setPage(nextPage);
      }
      setLoading(false);
    }
  };

  const selectedIndex = () => {
    let index = sortOptionsArray.findIndex((item) => item.name === sortState);
    return index !== -1 ? index : 0;
  };

  let getChannelName = (): string => {
    let channels = storage.getItem('channels');
    if (channels) {
      if (selectedChannelId !== 999) {
        let channel = channels.find(
          (channel) => channel.id === selectedChannelId,
        );
        return channel ? channel.name : '';
      }
      return t('All Channels');
    }

    return t('All Channels');
  };

  const content = () => {
    if (channelsError) {
      return <LoadingOrError message={errorHandler(channelsError, true)} />;
    }
    if (activityError) {
      return <LoadingOrError message={errorHandler(activityError, true)} />;
    }
    if (topicsError) {
      return <LoadingOrError message={errorHandler(topicsError, true)} />;
    }
    if (
      (((topicsLoading && topicsData.length < 1) ||
        channelsLoading ||
        (activityLoading && !activityData)) &&
        !refreshing) ||
      loading
    ) {
      return <LoadingOrError loading />;
    }
    if (topicsData.length < 1 && dataReady) {
      return <LoadingOrError message={t('No Posts available')} />;
    }
    return (
      <PostList
        ref={postListRef}
        data={topicsData}
        onPressReply={onPressReply}
        showImageRow
        contentInset={{ top: headerViewHeight }}
        contentOffset={{
          x: 0,
          y: Platform.OS === 'ios' ? -headerViewHeight : 0,
        }}
        progressViewOffset={headerViewHeight}
        automaticallyAdjustContentInsets={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        style={styles.fill}
        contentContainerStyle={styles.postListContent}
        numberOfLines={5}
        prevScreen={'Home'}
        likedTopic={likedTopic}
        slide={slide}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setSlide(true)}
        onScrollEndDrag={() => setSlide(false)}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: headerY } } }],
          { useNativeDriver: false },
        )}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        ListFooterComponent={
          <FooterLoadingIndicator isHidden={!hasOlderTopics || !dataReady} />
        }
      />
    );
  };

  return (
    <>
      <View
        style={styles.container}
        onLayout={(event) => {
          let { width } = event.nativeEvent.layout;
          setWidth(width);
        }}
      >
        <HomeNavBar
          title={getChannelName()}
          onPressTitle={onPressTitle}
          onPressAdd={onPressAdd}
          style={styles.navBar}
        />
        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <SearchBar
            placeholder={t('Search by posts, category, etc.')}
            onPressSearch={onPressSearch}
          />
          <SegmentedControl
            values={sortOptionsArray}
            labelExtractor={(item: SortOption) => item.label()}
            width={width}
            onItemPress={onSegmentedControlItemPress}
            selectedIndex={selectedIndex()}
          />
        </Animated.View>
        {content()}
        {!ios && <FloatingButton onPress={onPressAdd} style={styles.fab} />}
      </View>
    </>
  );
}

const useStyles = makeStyles(({ colors, shadow, spacing }) => ({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: colors.backgroundDarker,
  },
  navBar: {
    paddingTop: statusBarHeight + spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
    elevation: 2,
    zIndex: 3,
  },
  header: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.background,
    zIndex: 2,
    ...shadow,
  },
  fab: {
    position: 'absolute',
    marginRight: spacing.xxl,
    marginBottom: spacing.xxl,
    right: 0,
    bottom: 0,
  },
  postListContent: {
    paddingTop: Platform.OS === 'ios' ? 0 : headerViewHeight,
  },
  fill: {
    width: '100%',
  },
}));
