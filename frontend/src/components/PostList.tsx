import React, { forwardRef } from 'react';
import {
  RefreshControl,
  VirtualizedList,
  VirtualizedListProps,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { makeStyles, useTheme } from '../theme';
import { Post } from '../types';

import { PostItem } from './PostItem';

type Props = Omit<VirtualizedListProps<Post>, 'data' | 'renderItem'> & {
  data?: Array<Post>;
  hasFooter?: boolean;
  numberOfLines?: number;
  showImageRow?: boolean;
  prevScreen?: string;
  onPressReply?: (postId: number) => void;
  likedTopic?: Array<number>;
  slide?: boolean;
  showLabel?: boolean;
  currentUser?: string;
  onRefresh?: () => void;
  refreshing: boolean;
};

type Ref = VirtualizedList<Post>;

export { Ref as PostListRef };

export const PostList = forwardRef<Ref, Props>((props, ref) => {
  const { navigate } = useNavigation();
  const styles = useStyles();
  const { colors } = useTheme();

  const {
    data,
    showLabel,
    currentUser,
    hasFooter = true,
    numberOfLines = 0,
    showImageRow = false,
    style,
    prevScreen,
    onPressReply,
    refreshing,
    onRefresh,
    slide,
    likedTopic,
    progressViewOffset = 0,
    ...otherProps
  } = props;

  const onPressAuthor = (username: string) => {
    navigate('UserInformation', { username });
  };

  const getItem = (data: Array<Post>, index: number) => data[index];

  const getItemCount = (data: Array<Post>) => data.length;

  const keyExtractor = ({ id, topicId }: Post) =>
    `post-${id === 0 ? topicId : id}`;

  const renderItem = ({ item }: { item: Post }) => (
    <PostItem
      data={item}
      postList={true}
      showLabel={showLabel}
      currentUser={currentUser}
      hasFooter={hasFooter}
      showImageRow={showImageRow}
      style={styles.item}
      slide={slide}
      numberOfLines={numberOfLines}
      prevScreen={prevScreen}
      onPressReply={onPressReply}
      onPressAuthor={onPressAuthor}
      likedTopic={likedTopic}
    />
  );

  return (
    <VirtualizedList
      ref={ref}
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
      getItem={getItem}
      getItemCount={getItemCount}
      renderItem={renderItem}
      initialNumToRender={5}
      maxToRenderPerBatch={7}
      windowSize={10}
      style={[styles.container, style]}
      {...otherProps}
    />
  );
});

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flexGrow: 1,
  },
  item: {
    marginBottom: spacing.m,
  },
}));
