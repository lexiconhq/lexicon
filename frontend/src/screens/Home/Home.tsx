import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { Dimensions, PixelRatio, Platform, View } from 'react-native';
import { DrawerLayout } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { client } from '../../api/client';
import {
  FooterLoadingIndicator,
  LoadingOrError,
  PostList,
  PostListRef,
  SegmentedControl,
} from '../../components';
import { HomePostItem } from '../../components/PostItem/HomePostItem';
import {
  NO_CHANNEL_FILTER,
  isChannelFilter,
  isNoChannelFilter,
} from '../../constants';
import { FloatingButton } from '../../core-ui';
import {
  TopicFragment,
  TopicFragmentDoc,
  TopicsQuery,
  TopicsQueryVariables,
  TopicsSortEnum,
} from '../../generatedAPI/server';
import {
  LoginError,
  checkDraftAlert,
  clamp,
  errorHandler,
  errorHandlerAlert,
  transformTopicToPost,
  useStorage,
} from '../../helpers';
import {
  useAbout,
  useChannels,
  useDeletePostDraft,
  useLazyCheckPostDraft,
  useLazyTopicList,
  useSiteSettings,
} from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import {
  NewPostForm,
  PostWithoutId,
  StackNavProp,
  TabNavProp,
  TabRouteProp,
} from '../../types';
import { useDevice } from '../../utils';
import { ChannelSideBarContent, ChannelSideBarDrawer } from '../Channels';

import { HomeNavBar, HomeTabletNavBar, SearchBar } from './components';

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

const SIDE_BAR_WIDTH = 320;

/**
 * Ensure that the minimum scroll value is not greater than the minimum y value from the scroll when refreshing.
 * In this case, we set the minimum scroll value to be half of the device height to account for situations where users may pull the scroll forcefully.
 * if dimensions height is 0 we will set min scroll to be 400
 */

const MIN_SCROLL = -((Dimensions.get('screen').height || 800) / 2);

const fontScale = PixelRatio.getFontScale();
const normalizedSize = NAV_BAR_TITLE_SIZE * (fontScale - 1);

const ios = Platform.OS === 'ios';
const statusBarHeight = Constants.statusBarHeight;
const actionBarHeight =
  statusBarHeight + (ios ? IOS_BAR : ANDROID_BAR) + normalizedSize;
const headerViewHeight = actionBarHeight + (ios ? 0 : 24);

type SortOption = typeof sortOptionsArray[number];

export default function Home() {
  const { refetch: siteRefetch } = useSiteSettings();
  const { isTablet, isPortrait } = useDevice();
  const styles = useStyles();
  const { setValue, reset: resetForm } = useFormContext<NewPostForm>();
  const [openSideBar, setOpenSideBar] = useState(false);

  const tabNavigation = useNavigation<TabNavProp<'Home'>>();
  const { addListener, navigate } = useNavigation<StackNavProp<'TabNav'>>();

  const { params } = useRoute<TabRouteProp<'Home'>>();

  const routeParams = params === undefined ? false : params.backToTop;

  const FIRST_PAGE = 0;

  const { colors } = useTheme();

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
    loading: channelsLoading,
    error: channelsError,
    refetch: channelsRefetch,
  } = useChannels(
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
      onError: () => {
        setRefreshing(false);
        setLoading(false);
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
    data: topicDataList,
  } = useLazyTopicList({
    variables: isNoChannelFilter(selectedChannelId)
      ? { sort: sortState, page, username }
      : { sort: sortState, categoryId: selectedChannelId, page, username },
    onError: () => {
      setRefreshing(false);
      setLoading(false);
    },
    onCompleted: () => {
      setLoading(false);
    },
  });

  const { deletePostDraft } = useDeletePostDraft();
  const { checkPostDraft } = useLazyCheckPostDraft();

  const getData = useCallback(
    (variables: TopicsQueryVariables) => {
      getTopicList({ variables });
    },
    [getTopicList],
  );

  useEffect(() => {
    /**
     * This useEffect is used to set data if there are changes in the result query.
     * If the topics list is cached, it will show the result in `topicDataList`.
     * But if the topics list is not in the cache, it will show `undefined` until it finishes getting data from the query.
     *
     */

    if (topicDataList) {
      setData(topicDataList);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [setData, topicDataList]);

  useLayoutEffect(() => {
    postListRef.current?.scrollToIndex({
      index: 0,
      viewOffset: headerViewHeight,
    });
  }, [selectedChannelId]);

  useEffect(() => {
    const unsubscribe = addListener('focus', () => {
      /**
       * We need to call `getHomeChannelId` to retrieve the initial value because this function will only be called once during the first render.
       *
       * During the first render, the value of `receivedChannelId` has not changed outside of the `useEffect`. This can result in the function using the previously selected channel's value.
       *
       * In the previous code, we utilized param screen or `watch` from `react-hook-form`, ensuring that the value had already changed during the initial render or before calling this function.
       */

      const receivedChannelId = storage.getItem('homeChannelId');
      let channels = storage.getItem('channels');
      if (channels && receivedChannelId) {
        setSelectedChannelId(receivedChannelId);
      } else if (channels) {
        setSelectedChannelId(NO_CHANNEL_FILTER.id);
      }

      let categoryId = receivedChannelId;
      if (receivedChannelId) {
        categoryId = isNoChannelFilter(receivedChannelId)
          ? null
          : receivedChannelId;
      }
      let currentPage = page;

      if (receivedChannelId && receivedChannelId !== selectedChannelId) {
        currentPage = 0;
      }

      const variables: TopicsQueryVariables = {
        sort: sortState,
        categoryId,
        page: currentPage,
      };
      setPage(currentPage);
      getData(variables);

      getAbout();
    });

    return unsubscribe;
  }, [
    selectedChannelId,
    getAbout,
    username,
    storage,
    sortState,
    page,
    getData,
    addListener,
  ]);

  /**
   * this function used when select channel using tablet side bar
   *
   * @param id id of selected channel from sidebar
   */

  const onPressSideBarSelectedChannel = (id: number) => {
    let currentPage = page;

    let categoryId: number | null = id;
    categoryId = isNoChannelFilter(id) ? null : id;

    if (id !== selectedChannelId) {
      currentPage = 0;
    }

    setSelectedChannelId(id);

    const variables: TopicsQueryVariables = {
      sort: sortState,
      categoryId,
      page: currentPage,
    };
    setPage(currentPage);
    getData(variables);

    isPortrait && setTimeout(() => drawerRef.current?.closeDrawer(), 300);
  };

  const toggleSideBar = () => {
    isPortrait &&
      setTimeout(
        () =>
          !openSideBar
            ? drawerRef.current?.openDrawer()
            : drawerRef.current?.closeDrawer(),
        200,
      );
    setOpenSideBar(!openSideBar);
  };

  const drawerRef = useRef<DrawerLayout>(null);
  const postListRef = useRef<PostListRef<PostWithoutId>>(null);
  if (routeParams) {
    postListRef.current?.scrollToIndex({
      index: 0,
      viewOffset: headerViewHeight,
    });
  }

  const onPressTitle = () => {
    navigate('Channels', { prevScreen: 'Home' });
  };

  const onPressAdd = async () => {
    const currentUserId = storage.getItem('user')?.id;
    if (currentUserId) {
      /**
       * Set the channel ID in a new post to use the same channel as the home channel.
       */
      setValue(
        'channelId',
        storage.getItem('homeChannelId') || NO_CHANNEL_FILTER.id,
        {
          shouldDirty: true,
        },
      );
      setValue('isDraft', false);
      setValue('draftKey', '');
      navigate('NewPost');
    } else {
      errorHandlerAlert(LoginError, navigate);
    }
  };

  const onPressSearch = () => {
    navigate('Search');
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (refetchTopics) {
      setPage(FIRST_PAGE);
      refetchTopics().finally(() => setRefreshing(false));
    }
  };

  const onRefreshError = () => {
    channelsRefetch();
    onRefresh();
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
    async (param: { topicId: number }) => {
      let { topicId } = param;
      const cacheTopic = client.readFragment<TopicFragment>({
        id: `Topic:${topicId}`,
        fragment: TopicFragmentDoc,
      });
      if (!cacheTopic) {
        return null;
      }
      let { title, replyCount } = transformTopicToPost(cacheTopic);

      const draftKey = `topic_${topicId}`;
      let { data, error } = await checkPostDraft({
        variables: { draftKey },
      });

      if (data && !error) {
        const { checkPostDraft } = data;

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
            titleTopic: title,
            topicId,
            channelId: selectedChannelId,
            focusedPostNumber: replyCount,
          });
        }
      }

      navigate('PostReply', {
        topicId,
        title,
        focusedPostNumber: replyCount,
      });
    },
    [
      checkPostDraft,
      deletePostDraft,
      navigate,
      resetForm,
      selectedChannelId,
      setValue,
    ],
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

  const postContent = () => {
    if (channelsError) {
      return (
        <LoadingOrError
          message={errorHandler(channelsError, true)}
          refreshing={refreshing}
          progressViewOffset={headerViewHeight}
          onRefresh={() => {
            channelsRefetch();
            onRefresh();
          }}
        />
      );
    }
    if (topicsError) {
      return (
        <LoadingOrError
          message={errorHandler(topicsError, true)}
          refreshing={refreshing}
          progressViewOffset={headerViewHeight}
          onRefresh={onRefreshError}
        />
      );
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
        contentInset={{
          // statusBarHeight ios phone device value from expo is bigger than tablet and android. when check android and tablet around 25-30 but ios phone show result 54
          top: headerViewHeight - (ios && !isTablet ? statusBarHeight / 3 : 0),
        }}
        contentOffset={{
          x: 0,
          y: Platform.OS === 'ios' ? -headerViewHeight : 0,
        }}
        progressViewOffset={headerViewHeight}
        automaticallyAdjustContentInsets={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        style={styles.fill}
        contentContainerStyle={[
          styles.postListContent,
          isTablet ? styles.postListContentTablet : undefined,
        ]}
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
              style={isTablet ? styles.postItemCardTablet : undefined}
            />
          );
        }}
        ListFooterComponent={
          <FooterLoadingIndicator isHidden={!hasMoreTopics || !topicsData} />
        }
        testID="Home:PostList"
      />
    );
  };

  const homeContent = () => (
    <>
      <View
        style={styles.container}
        onLayout={(event) => {
          let { width } = event.nativeEvent.layout;
          setWidth(width);
        }}
      >
        {isTablet ? (
          <HomeTabletNavBar
            title={getChannelName()}
            onPressAdd={onPressAdd}
            onPressIconSideBar={toggleSideBar}
            style={styles.navBar}
            isShowIcon={!openSideBar}
          />
        ) : (
          <HomeNavBar
            title={getChannelName()}
            onPressTitle={onPressTitle}
            onPressAdd={onPressAdd}
            style={styles.navBar}
          />
        )}
        <Animated.View style={[styles.header, headerTranslateY]}>
          <SearchBar
            placeholder={t('Search posts, categories, etc.')}
            onPressSearch={onPressSearch}
            testID="Home:Button:SearchTopic"
          />
          <SegmentedControl
            values={sortOptionsArray}
            labelExtractor={(item: SortOption) => item.label()}
            width={width}
            onItemPress={onSegmentedControlItemPress}
            selectedIndex={selectedIndex()}
          />
        </Animated.View>
        {postContent()}
        {!ios && <FloatingButton onPress={onPressAdd} style={styles.fab} />}
      </View>
    </>
  );

  return isTablet ? (
    !isPortrait ? (
      <ChannelSideBarDrawer
        isShow={openSideBar}
        setSelectedChannelId={onPressSideBarSelectedChannel}
        hideSideBar={toggleSideBar}
      >
        {homeContent()}
      </ChannelSideBarDrawer>
    ) : (
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={SIDE_BAR_WIDTH}
        drawerPosition={'left'}
        drawerType="front"
        drawerBackgroundColor={colors.background}
        overlayColor={colors.backDrop}
        onDrawerClose={() => {
          setOpenSideBar(false);
        }}
        onDrawerOpen={() => {
          setOpenSideBar(true);
        }}
        renderNavigationView={() => (
          <ChannelSideBarContent
            setSelectedChannelId={onPressSideBarSelectedChannel}
            hideSideBar={toggleSideBar}
          />
        )}
      >
        {homeContent()}
      </DrawerLayout>
    )
  ) : (
    homeContent()
  );
}

const useStyles = makeStyles(({ colors, shadow, spacing }) => ({
  container: {
    flex: 1,
    width: '100%',
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
  postListContentTablet: {
    marginHorizontal: spacing.xxxxxl,
  },
  postItemCardTablet: {
    marginTop: spacing.l,
  },
  fill: {
    width: '100%',
  },
}));
