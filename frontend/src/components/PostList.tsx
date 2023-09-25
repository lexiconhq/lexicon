import React, { MutableRefObject } from 'react';
import { FlatListProps, RefreshControl, ListRenderItem } from 'react-native';
import Animated from 'react-native-reanimated';

import { UserActionFragment } from '../generated/server';
import { makeStyles, useTheme } from '../theme';
import { Post, PostWithoutId } from '../types';

// TODO: Avoid prop drilling #775
type Props<T> = Omit<FlatListProps<T>, 'data' | 'renderItem'> & {
  refreshing: boolean;
  renderItem: ListRenderItem<T>;
  data?: Array<T>;
  onRefresh?: () => void;
  postListRef?: MutableRefObject<PostListRef<T> | null>;
};

type PostListRef<T> = Animated.FlatList<T>;
type ItemType = PostWithoutId | Post | UserActionFragment;
function PostList<T extends ItemType>(props: Props<T>) {
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    data,
    postListRef,
    style,
    refreshing,
    progressViewOffset = 0,
    onRefresh,
    ...otherProps
  } = props;

  const keyExtractor = (item: ItemType) => {
    if ('actionType' in item) {
      return `post-${item.postId}-topic-${item.topicId}-actionType-${item.actionType}}`;
    }
    if ('id' in item) {
      return `post-${item.id}`;
    }
    return `topic-${item.topicId}`;
  };

  return (
    /**
     * Migrated to animated.flatlist to fix onEndReached not triggered when we still use
     * VirtualizedList with injected Animated.ScrollView on renderScrollComponent props.
     * https://github.com/kodefox/lexicon/pull/923#issuecomment-1408529189
     */
    <Animated.FlatList
      ref={postListRef}
      data={data}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          progressViewOffset={progressViewOffset}
        />
      }
      keyExtractor={keyExtractor}
      initialNumToRender={5}
      maxToRenderPerBatch={7}
      windowSize={10}
      style={[styles.container, style]}
      {...otherProps}
    />
  );
}
export { PostList, PostListRef };
const useStyles = makeStyles(() => ({
  container: {
    flexGrow: 1,
  },
}));
