import { ApolloQueryResult, FetchMoreQueryOptions } from '@apollo/client';
import { useCallback, useState } from 'react';

import {
  GetMessageDetailQuery,
  GetMessageDetailQueryVariables,
  GetTopicDetailQuery,
  GetTopicDetailQueryVariables,
} from '../generatedAPI/server';
import { getFetchMorePostIds } from '../helpers';

type FetchData = GetTopicDetailQuery | GetMessageDetailQuery;
type FetchVariables =
  | GetTopicDetailQueryVariables
  | GetMessageDetailQueryVariables;

export type LoadMorePostsParams = {
  stream?: Array<number>;
  loadNewerPosts: boolean;
  hasMorePost: boolean;
  lastLoadedPostIndex?: number;
  firstLoadedPostIndex?: number;
  fetchMoreVariables?: Partial<FetchVariables>;
  fetchMore: (
    fetchMoreOptions: FetchMoreQueryOptions<FetchVariables, FetchData>,
  ) => Promise<ApolloQueryResult<FetchData>>;
};

export function useLoadMorePost(topicId: number) {
  const [isLoadingOlderPost, setIsLoadingOlderPost] = useState(false);
  const [isLoadingNewerPost, setIsLoadingNewerPost] = useState(false);

  const loadMorePosts = useCallback(
    async (params: LoadMorePostsParams) => {
      const {
        stream,
        fetchMore,
        firstLoadedPostIndex,
        hasMorePost,
        lastLoadedPostIndex,
        loadNewerPosts,
        fetchMoreVariables,
      } = params;
      if (
        !stream ||
        !hasMorePost ||
        !firstLoadedPostIndex ||
        !lastLoadedPostIndex ||
        (loadNewerPosts ? isLoadingNewerPost : isLoadingOlderPost)
      ) {
        return;
      }

      if (loadNewerPosts) {
        setIsLoadingNewerPost(true);
      } else {
        setIsLoadingOlderPost(true);
      }

      const { nextFirstLoadedPostIndex, nextLastLoadedPostIndex, postIds } =
        getFetchMorePostIds({
          stream,
          ...(loadNewerPosts
            ? { type: 'newer', lastLoadedPostIndex }
            : { type: 'older', firstLoadedPostIndex }),
        });

      if (!postIds?.length) {
        return;
      }

      let { error } = await fetchMore({
        variables: {
          topicId,
          postIds,
          postNumber: undefined,
          ...fetchMoreVariables,
        },
      });

      setIsLoadingNewerPost(false);
      setIsLoadingOlderPost(false);

      if (error) {
        return;
      }

      return { nextLastLoadedPostIndex, nextFirstLoadedPostIndex };
    },
    [isLoadingNewerPost, isLoadingOlderPost, topicId],
  );

  return { loadMorePosts, isLoadingNewerPost, isLoadingOlderPost };
}
