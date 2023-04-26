import { ApolloQueryResult, FetchMoreQueryOptions } from '@apollo/client';
import { useCallback, useState } from 'react';

import {
  GetTopicDetailQuery,
  GetTopicDetailQueryVariables,
  GetMessageDetailQuery,
  GetMessageDetailQueryVariables,
} from '../../generated/server';
import { getFetchMorePostIds } from '../../helpers';

type FetchData = GetTopicDetailQuery | GetMessageDetailQuery;
type FetchVariables =
  | GetTopicDetailQueryVariables
  | GetMessageDetailQueryVariables;

export type LoadMorePostsParams<
  TFetchVars extends FetchVariables,
  TFetchData extends FetchData,
> = {
  stream?: Array<number>;
  loadNewerPosts: boolean;
  hasMorePost: boolean;
  lastLoadedPostIndex?: number;
  firstLoadedPostIndex?: number;
  fetchMoreVariables?: Partial<TFetchVars>;
  fetchMore: (
    fetchMoreOptions: FetchMoreQueryOptions<TFetchVars, TFetchData>,
  ) => Promise<ApolloQueryResult<TFetchData>>;
};

export function useLoadMorePost(topicId: number) {
  const [isLoadingOlderPost, setisLoadingOlderPost] = useState(false);
  const [isLoadingNewerPost, setisLoadingNewerPost] = useState(false);

  const loadMorePosts = useCallback(
    async <V extends FetchVariables, D extends FetchData>(
      params: LoadMorePostsParams<V, D>,
    ) => {
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
        setisLoadingNewerPost(true);
      } else {
        setisLoadingOlderPost(true);
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
        } as Partial<V>,
      });

      setisLoadingNewerPost(false);
      setisLoadingOlderPost(false);

      if (error) {
        return;
      }

      return { nextLastLoadedPostIndex, nextFirstLoadedPostIndex };
    },
    [isLoadingNewerPost, isLoadingOlderPost, topicId],
  );

  return { loadMorePosts, isLoadingNewerPost, isLoadingOlderPost };
}
