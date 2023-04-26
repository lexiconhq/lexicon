import React from 'react';
import { OperationVariables, useFragment_experimental } from '@apollo/client';

import { findChannelByCategoryId, getImage, useStorage } from '../../helpers';
import {
  SearchPostFragment,
  SearchPostFragmentDoc,
  SearchTopicFragment,
  SearchTopicFragmentDoc,
} from '../../generated/server';
import { LoadingOrError } from '../LoadingOrError';

import { PostItem, PostItemProps } from './PostItem';

type Props = Pick<PostItemProps, 'topicId'> & {
  postId: number;
};

function BaseSearchPostItem(props: Props) {
  const storage = useStorage();

  const { topicId, postId } = props;

  const cachedSearchTopicResult = useFragment_experimental<
    SearchTopicFragment,
    OperationVariables
  >({
    fragment: SearchTopicFragmentDoc,
    fragmentName: 'SearchTopicFragment',
    from: {
      __typename: 'SearchTopic',
      id: topicId,
    },
  });
  const cacheSearchPostResult = useFragment_experimental<
    SearchPostFragment,
    OperationVariables
  >({
    fragment: SearchPostFragmentDoc,
    fragmentName: 'SearchPostFragment',
    from: {
      __typename: 'SearchPost',
      id: postId,
    },
  });
  let cachedSearchTopic = cachedSearchTopicResult.data;
  let cacheSearchPost = cacheSearchPostResult.data;

  if (
    !cachedSearchTopicResult.complete ||
    !cacheSearchPostResult.complete ||
    !cachedSearchTopic ||
    !cacheSearchPost
  ) {
    /**
     * This shouldn't ever happen since SearchTopic and SearchPost already
     * fetched in SearchScreen
     */
    return <LoadingOrError message="Post not found" />;
  }
  let channels = storage.getItem('channels');
  const channel = findChannelByCategoryId({
    categoryId: cachedSearchTopic.categoryId,
    channels,
  });

  return (
    <PostItem
      topicId={topicId}
      title={cachedSearchTopic.title}
      content={cacheSearchPost.blurb}
      avatar={getImage(cacheSearchPost.avatarTemplate)}
      channel={channel}
      tags={cachedSearchTopic.tags ?? []}
      createdAt={cacheSearchPost.createdAt}
      username={cacheSearchPost.username}
      isLiked={cachedSearchTopic.liked ?? false}
      numberOfLines={5}
    />
  );
}

let SearchPostItem = React.memo(BaseSearchPostItem);
export { Props as SearchPostItemProps, SearchPostItem };
