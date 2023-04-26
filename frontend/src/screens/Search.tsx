import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Keyboard,
  Platform,
  ScrollViewProps,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import Constants from 'expo-constants';

import {
  FooterLoadingIndicator,
  LoadingOrError,
  PostList,
  SearchPostItem,
} from '../components';
import { DEFAULT_CHANNEL } from '../constants';
import { Icon, Text } from '../core-ui';
import { errorHandler, getImage, useStorage } from '../helpers';
import { useSearchPost, useSiteSettings } from '../hooks';
import { makeStyles, useTheme } from '../theme';
import { Post, StackNavProp } from '../types';

const ios = Platform.OS === 'ios';

export default function Search() {
  const styles = useStyles();
  const { colors } = useTheme();

  const storage = useStorage();
  const channels = storage.getItem('channels');

  const { minSearchLength = 3 } = useSiteSettings();
  const maxPostsPerPage = 50;

  const { navigate } = useNavigation<StackNavProp<'Search'>>();

  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [hasOlderPosts, setHasOlderPosts] = useState(false);
  const [loading, setLoading] = useState(false);

  const skipSearchStatus = searchValue.length < minSearchLength;

  const { getPosts, error, refetch, fetchMore } = useSearchPost({
    onCompleted: ({ search: result }) => {
      if (result) {
        let tempPosts: Array<Post> = [];
        let postsData = result.posts;
        let topicsData = result.topics;
        postsData.forEach(
          ({
            id,
            avatarTemplate,
            blurb,
            createdAt,
            username,
            likeCount,
            topicId,
          }) => {
            let tempTopicData = topicsData.find((item) => item.id === topicId);

            const channel = channels?.find(
              (channel) => channel.id === tempTopicData?.categoryId,
            );
            let tags: Array<string> = tempTopicData?.tags || [];

            tempPosts.push({
              id,
              topicId,
              title: tempTopicData?.title || '',
              content: blurb,
              username: username || '',
              avatar: getImage(avatarTemplate),
              replyCount: tempTopicData?.replyCount || 0,
              likeCount,
              viewCount: tempTopicData?.postsCount || 0,
              isLiked: tempTopicData?.liked || false,
              channel: channel || DEFAULT_CHANNEL,
              tags,
              createdAt,
              freqPosters: [],
            });
          },
        );
        const currentPostIds = posts.map((post) => post.id);
        const incomingPostIds = tempPosts.map((post) => post.id);
        if (
          JSON.stringify(currentPostIds) === JSON.stringify(incomingPostIds) ||
          incomingPostIds.length < page * maxPostsPerPage
        ) {
          setHasOlderPosts(false);
        } else {
          setHasOlderPosts(true);
        }
        setPosts(tempPosts);
      } else {
        setHasOlderPosts(false);
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    let fetchSearch: NodeJS.Timeout;
    if (!skipSearchStatus) {
      fetchSearch = setTimeout(() => {
        getPosts({
          variables: {
            search: searchValue,
            page,
            order: 'latest',
          },
        });
      }, 500);
    } else {
      setPosts([]);
      setLoading(false);
    }
    return () => clearTimeout(fetchSearch);
  }, [skipSearchStatus, getPosts, setPosts, page, searchValue]);

  const count = posts.length;

  const onRefresh = () => {
    refetch && refetch();
  };

  const loadMore = () => {
    if (!hasOlderPosts || loading) {
      return;
    }
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMore &&
      fetchMore({ variables: { search: searchValue, page: nextPage } });
  };

  const keyboardDismissProp: ScrollViewProps = ios
    ? { keyboardDismissMode: 'on-drag' }
    : {
        onScrollBeginDrag: Keyboard.dismiss,
        keyboardShouldPersistTaps: count > 1 ? 'never' : 'always',
      };

  const resultInfo = () => {
    let message = '';
    if (skipSearchStatus) {
      message = t('Your query must be at least {minLength} characters long', {
        minLength: minSearchLength,
      });
    } else {
      if (count === 0) {
        message = t('No results found for ');
      } else {
        message = t('Showing {count} {result} for ', {
          count,
          result: count === 1 ? 'result' : 'results',
        });
      }
    }

    return (
      <View style={styles.searchResult}>
        <Text>{message}</Text>
        {!skipSearchStatus && <Text variant="bold">{searchValue}</Text>}
      </View>
    );
  };

  const onChangeValue = useCallback(
    (text: string) => {
      setPage(1);
      setSearchValue(text);
    },
    [setPage, setSearchValue],
  );

  const onPressCancel = useCallback(() => setSearchValue(''), [setSearchValue]);

  const search = useMemo(
    () => (
      <View style={styles.searchContainer}>
        {ios && <Icon name="Search" color={colors.textLighter} />}
        <TextInput
          autoFocus={true}
          style={styles.searchTextInput}
          value={searchValue}
          onChangeText={onChangeValue}
          placeholder={t('Search for ...')}
          placeholderTextColor={colors.textLighter}
          keyboardType="visible-password" // To remove underline at every words on Android
        />
        {searchValue !== '' && (
          <TouchableOpacity
            onPress={onPressCancel}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="Cancel" size="m" color={colors.textLighter} />
          </TouchableOpacity>
        )}
      </View>
    ),
    [searchValue, onChangeValue, onPressCancel, colors, styles],
  );

  const content = error ? (
    <LoadingOrError message={errorHandler(error, true)} />
  ) : (
    <View style={styles.bodyContainer}>
      {searchValue !== '' && (
        <PostList
          data={posts}
          onRefresh={onRefresh}
          refreshing={loading}
          onEndReached={loadMore}
          ListHeaderComponent={loading ? undefined : resultInfo}
          ListFooterComponent={
            <FooterLoadingIndicator
              isHidden={!hasOlderPosts || posts.length < 1}
            />
          }
          renderItem={({ item }) => {
            return <SearchPostItem topicId={item.topicId} postId={item.id} />;
          }}
          {...keyboardDismissProp}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {ios ? (
          <>
            {search}
            <TouchableOpacity
              style={styles.iosCancelContainer}
              hitSlop={{ top: 15, bottom: 15, left: 0, right: 15 }}
              onPress={() => navigate('TabNav', { screen: 'Home' })}
            >
              <Text style={{ color: colors.primary }}>{t('Cancel')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <HeaderBackButton
              tintColor={colors.primary}
              style={styles.androidBackButton}
              onPress={() => navigate('TabNav', { screen: 'Home' })}
            />
            {search}
          </>
        )}
      </View>
      {content}
    </View>
  );
}

const useStyles = makeStyles(({ colors, fontSizes, shadow, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: ios
      ? Constants.statusBarHeight + spacing.m
      : Constants.statusBarHeight + spacing.l + spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    ...shadow,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ios ? colors.backgroundDarker : undefined,
    borderRadius: ios ? 4 : undefined,
    marginVertical: ios ? spacing.s : undefined,
    padding: ios ? spacing.m : undefined,
    paddingRight: ios ? undefined : spacing.l,
  },
  searchTextInput: {
    flex: 1,
    color: colors.textNormal,
    fontSize: fontSizes.m,
    padding: ios ? undefined : spacing.xs,
    paddingHorizontal: ios ? spacing.m : undefined,
    paddingBottom: ios ? undefined : spacing.m,
    paddingRight: ios ? undefined : spacing.xl,
  },
  bodyContainer: {
    flex: 1,
  },
  searchResult: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    flexWrap: 'wrap',
  },
  iosCancelContainer: {
    paddingLeft: spacing.xl,
  },
  androidBackButton: {
    marginHorizontal: 0,
    marginVertical: 0,
    paddingRight: spacing.s,
  },
}));
