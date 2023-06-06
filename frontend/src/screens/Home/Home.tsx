import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { PixelRatio, Platform, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {
  FooterLoadingIndicator,
  LoadingOrError,
  PostList,
  PostListRef,
  SegmentedControl,
} from '../../components';
import {
  NO_CHANNEL_FILTER,
  isNoChannelFilter,
  isChannelFilter,
} from '../../constants';
import { FloatingButton } from '../../core-ui';
import {
  TopicsSortEnum,
  TopicsQuery,
  TopicsQueryVariables,
  TopicsDocument,
  TopicFragmentDoc,
  TopicFragment,
} from '../../generated/server';
import { client } from '../../graphql/client';
import {
  clamp,
  errorHandler,
  errorHandlerAlert,
  getToken,
  isFlatList,
  LoginError,
  removeToken,
  setToken,
  showLogoutAlert,
  transformTopicToPost,
  useStorage,
} from '../../helpers';
import {
  useAbout,
  useChannels,
  useLazyTopicList,
  useRefreshToken,
  useSiteSettings,
} from '../../hooks';
import { makeStyles } from '../../theme';
import {
  PostWithoutId,
  StackNavProp,
  TabNavProp,
  TabRouteProp,
} from '../../types';
import { HomePostItem } from '../../components/PostItem/HomePostItem';

import { HomeNavBar, SearchBar } from './components';

let sortTypes = {
  LATEST: { label: () => t('Latest') },
  TOP: { label: () => t('Top') },
};

let sortOptionsArray = Object.entries(sortTypes).map(
  ([name, { label }], index) => ({ index, name, label }),
);

const NAV_BAR_TITLE_SIZE = 24;
const IOS_BAR = 60;
const ANDROID_BAR = 64;
const MAX_SCROLL = 300; // at maximum 300 unit will be calculated for interpolation
const MIN_SCROLL = -200; // at minimum scroll 200 unit before starting hide animation

const fontScale = PixelRatio.getFontScale();
const normalizedSize = NAV_BAR_TITLE_SIZE * (fontScale - 1);

const ios = Platform.OS === 'ios';
const statusBarHeight = Constants.statusBarHeight;
const actionBarHeight =
  statusBarHeight + (ios ? IOS_BAR : ANDROID_BAR) + normalizedSize;
const headerViewHeight = 92;

type SortOption = typeof sortOptionsArray[number];

export default function Home() {
  const { refetch: siteRefetch } = useSiteSettings();
  const styles = useStyles();

  const tabNavigation = useNavigation<TabNavProp<'Home'>>();
  const { reset, addListener, navigate } =
    useNavigation<StackNavProp<'TabNav'>>();

  const { params } = useRoute<TabRouteProp<'Home'>>();
  const receivedChannelId = params === undefined ? 0 : params.selectedChannelId;
  const routeParams = params === undefined ? false : params.backToTop;

  const FIRST_PAGE = 0;

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler<{ prevY?: number }>({
    onScroll: (event, ctx) => {
      const { y } = event.contentOffset;
      const diff = y - (ctx?.prevY ?? 0);
      scrollOffset.value = clamp(
        scrollOffset.value + diff,
        MIN_SCROLL,
        MAX_SCROLL,
      );
      ctx.prevY = event.contentOffset.y;
    },
    onBeginDrag: (event, ctx) => {
      ctx.prevY = event.contentOffset.y;
    },
  });
  const headerTranslateY = useAnimatedStyle(() => {
    const interpolateY = interpolate(
      scrollOffset.value,
      [0, MAX_SCROLL],
      [actionBarHeight, -(actionBarHeight + headerViewHeight)],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ translateY: interpolateY }],
    };
  });

  useEffect(() => {
    siteRefetch?.();
  }, [siteRefetch]);

  useEffect(() => {
    if (routeParams === true) {
      tabNavigation.setParams({ backToTop: false });
    }
  }, [routeParams, tabNavigation]);

  const [sortState, setSortState] = useState<TopicsSortEnum>(
    TopicsSortEnum.Latest,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(
    NO_CHANNEL_FILTER.id,
  );
  const [topicsData, setTopicsData] = useState<Array<PostWithoutId> | null>(
    null,
  );
  const [page, setPage] = useState(FIRST_PAGE);
  const [hasMoreTopics, setHasMoreTopics] = useState(false);
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
  }, [tokenResponse, tokenError, reset, storage]);

  const { loading: channelsLoading, error: channelsError } = useChannels(
    {
      onCompleted: (data) => {
        if (data && data.category.categories) {
          let channels = data.category.categories.map((channel) => {
            let { id, color, name, descriptionText } = channel;
            return { id, color, name, description: descriptionText ?? null };
          });
          storage.setItem('channels', channels);
        }
      },
    },
    'HIDE_ALERT',
  );

  const { getAbout } = useAbout(
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

  const setData = useCallback(
    ({ topics }: TopicsQuery) => {
      let rawTopicsData = topics?.topicList?.topics
        ? topics.topicList.topics
        : [];
      let channelsData = storage.getItem('channels');
      let normalizedTopicsData: Array<PostWithoutId> = rawTopicsData.map(
        (topic) => {
          return transformTopicToPost({
            ...topic,
            channels: channelsData ?? [],
          });
        },
      );
      if (normalizedTopicsData.length === allTopicCount) {
        setHasMoreTopics(false);
      } else {
        setHasMoreTopics(true);
      }
      setTopicsData(normalizedTopicsData);
    },
    [allTopicCount, storage],
  );

  const {
    getTopicList,
    error: topicsError,
    refetch: refetchTopics,
    fetchMore: fetchMoreTopics,
  } = useLazyTopicList({
    variables: isNoChannelFilter(selectedChannelId)
      ? { sort: sortState, page, username }
      : { sort: sortState, categoryId: selectedChannelId, page, username },
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

  const getData = useCallback(
    (variables: TopicsQueryVariables) => {
      try {
        const data: TopicsQuery | null = client.readQuery({
          query: TopicsDocument,
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
    if (!isFlatList(postListRef.current)) {
      return;
    }
    postListRef.current.scrollToIndex({
      index: 0,
      viewOffset: headerViewHeight,
    });
  }, [selectedChannelId]);

  useEffect(() => {
    let channels = storage.getItem('channels');
    if (channels && receivedChannelId) {
      setSelectedChannelId(receivedChannelId);
      setPage(0);
    } else if (channels) {
      setSelectedChannelId(NO_CHANNEL_FILTER.id);
    }

    const unsubscribe = addListener('focus', () => {
      let categoryId = receivedChannelId;
      if (receivedChannelId) {
        categoryId = isNoChannelFilter(receivedChannelId)
          ? 0
          : receivedChannelId;
      }

      const variables: TopicsQueryVariables = {
        sort: sortState,
        categoryId,
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
    });

    return unsubscribe;
  }, [
    getRefreshToken,
    getAbout,
    receivedChannelId,
    username,
    storage,
    sortState,
    page,
    getData,
    addListener,
  ]);

  const postListRef = useRef<PostListRef<PostWithoutId>>(null);
  if (routeParams && isFlatList(postListRef.current)) {
    postListRef.current.scrollToIndex({
      index: 0,
      viewOffset: headerViewHeight,
    });
  }

  const onPressTitle = () => {
    navigate('Channels', {
      prevScreen: 'Home',
      selectedChannelId: selectedChannelId,
    });
  };

  const onPressAdd = () => {
    const currentUserId = storage.getItem('user')?.id;
    if (currentUserId) {
      navigate('NewPost', {
        selectedChannelId,
        selectedTagsIds: [],
      });
    } else {
      errorHandlerAlert(LoginError, navigate);
    }
  };

  const onPressSearch = () => {
    navigate('Search');
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
      name === 'LATEST' ? TopicsSortEnum.Latest : TopicsSortEnum.Top;
    setSortState(sortState);
    const variables: TopicsQueryVariables = isNoChannelFilter(selectedChannelId)
      ? { sort: sortState, page: FIRST_PAGE }
      : {
          sort: sortState,
          categoryId: selectedChannelId,
          page: FIRST_PAGE,
        };
    setTopicsData(null);
    setPage(FIRST_PAGE);
    getData(variables);
  };

  const onPressReply = useCallback(
    (param: { topicId: number }) => {
      let { topicId } = param;
      const cacheTopic = client.readFragment<TopicFragment>({
        id: `Topic:${topicId}`,
        fragment: TopicFragmentDoc,
      });
      if (!cacheTopic) {
        return null;
      }
      let { title, replyCount } = transformTopicToPost(cacheTopic);
      navigate('PostReply', {
        topicId,
        title,
        focusedPostNumber: replyCount,
      });
    },
    [navigate],
  );

  let isFetchingMoreTopics = useRef(false);

  const onEndReached = async () => {
    if (!hasMoreTopics || isFetchingMoreTopics.current || !fetchMoreTopics) {
      return;
    }
    const nextPage = page + 1;
    let variables: TopicsQueryVariables;
    if (isNoChannelFilter(selectedChannelId)) {
      variables = { sort: sortState, page: nextPage };
    } else {
      variables = {
        sort: sortState,
        page: nextPage,
        categoryId: selectedChannelId,
      };
    }
    try {
      isFetchingMoreTopics.current = true;
      let result = await fetchMoreTopics({ variables });
      isFetchingMoreTopics.current = false;
      if (result.data.topics.topicList?.topics?.length === 0) {
        setHasMoreTopics(false);
      } else {
        setPage(nextPage);
      }
      setLoading(false);
    } catch (error) {
      isFetchingMoreTopics.current = false;
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
      if (isChannelFilter(selectedChannelId)) {
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
    if (topicsError) {
      return <LoadingOrError message={errorHandler(topicsError, true)} />;
    }
    if (!topicsData || channelsLoading || loading) {
      return <LoadingOrError loading />;
    }
    if (topicsData && topicsData.length < 1) {
      return <LoadingOrError message={t('No Posts available')} />;
    }
    return (
      <PostList
        postListRef={postListRef}
        data={topicsData}
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
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        renderItem={({ item }) => {
          return (
            <HomePostItem
              topicId={item.topicId}
              prevScreen={'Home'}
              onPressReply={onPressReply}
            />
          );
        }}
        ListFooterComponent={
          <FooterLoadingIndicator isHidden={!hasMoreTopics || !topicsData} />
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
        <Animated.View style={[styles.header, headerTranslateY]}>
          <SearchBar
            placeholder={t('Search posts, categories, etc.')}
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
    paddingTop: Platform.OS === 'ios' ? 0 : spacing.xl,
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
