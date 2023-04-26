import {
  MutationUpdaterFunction,
  DefaultContext,
  ApolloCache,
  OnQueryUpdated,
  FetchResult,
  InternalRefetchQueriesInclude,
  ApolloError,
} from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';

import { DEFAULT_POST_ID, FIRST_POST_NUMBER } from '../../constants';
import {
  LikeTopicOrPostMutation,
  LikeTopicOrPostMutationVariables as BaseLikeTopicOrPostVariables,
  TopicDetailFragment,
  GetTopicDetailDocument,
  TopicDetailFragmentDoc,
  LikeTopicOrPostDocument,
  PostLikeFragmentDoc,
  TopicLikeFragmentDoc,
} from '../../generated/server';
import { client } from '../../graphql/client';
import { TOPICS } from '../../graphql/server/topics';
import {
  errorHandlerAlert,
  getLikeActionSummary,
  getUpdatedLikeCount,
  getUpdatedSummaryOnToggleLike,
} from '../../helpers';
import { StackNavProp } from '../../types';
import { useOngoingLikedTopic, useMutation } from '../../utils';

type LikeTopicOrPostVariables = BaseLikeTopicOrPostVariables & {
  likeCount: number;
};

type MutationOnError = (error: ApolloError) => void;
type MutationOptimisticResponse = (
  vars: LikeTopicOrPostVariables,
) => LikeTopicOrPostMutation;
type MutationRefetchQueries = (
  result: FetchResult<LikeTopicOrPostMutation>,
) => InternalRefetchQueriesInclude;
type MutationUpdate = MutationUpdaterFunction<
  LikeTopicOrPostMutation,
  LikeTopicOrPostVariables,
  DefaultContext,
  ApolloCache<unknown>
>;

const optimisticResponse: MutationOptimisticResponse = ({
  unlike,
  topicId,
  postId,
  likeCount: previousCount,
}) => {
  const liked = !unlike;

  // Liking Post from Topic List
  if (topicId) {
    const likeCount = getUpdatedLikeCount({ liked, previousCount });
    // Get first post ID of the topic
    const cachedTopicDetail = client.readFragment<TopicDetailFragment>(
      {
        id: `TopicDetailOutput:${topicId}`,
        fragment: TopicDetailFragmentDoc,
      },
      true,
    );
    const firstPost = cachedTopicDetail?.postStream.posts.find(
      ({ postNumber }) => postNumber === FIRST_POST_NUMBER,
    );

    return {
      __typename: 'Mutation',
      likeTopicOrPost: {
        __typename: 'LikedTopic',
        postId: firstPost?.id ?? DEFAULT_POST_ID,
        topicId,
        likeCount,
        liked,
      },
    };
  }

  // Liking Post from Post Detail
  const cachedPost = client.readFragment(
    { id: `Post:${postId}`, fragment: PostLikeFragmentDoc },
    true,
  );

  const actionsSummary = getUpdatedSummaryOnToggleLike({
    cachedActionsSummary: cachedPost?.actionsSummary,
    liked,
    previousCount,
  });
  return {
    __typename: 'Mutation',
    likeTopicOrPost: {
      __typename: 'Post',
      ...cachedPost,
      actionsSummary,
    },
  };
};

const refetchQueries: MutationRefetchQueries = ({ data }) => {
  const topicDetailQuery = {
    query: GetTopicDetailDocument,
    variables: { topicId: data?.likeTopicOrPost.topicId },
  };
  return [TOPICS, topicDetailQuery];
};

const onQueryUpdated: OnQueryUpdated<unknown> = async (observableQuery) => {
  // Ensuring topics list query is being refetched
  if (observableQuery.queryName === 'Topics') {
    observableQuery.setOptions({
      context: { queryDeduplication: false },
    });
  }
  return observableQuery.refetch();
};

export function useLikeTopicOrPost() {
  const { navigate } = useNavigation<StackNavProp<'PostDetail' | 'TabNav'>>();
  const { removeOngoingLikedTopic, addOngoingLikedTopic } =
    useOngoingLikedTopic();
  let topicIdRef = useRef<number>();

  const update: MutationUpdate = (cache, { data }) => {
    if (!data) {
      return;
    }
    topicIdRef.current = data.likeTopicOrPost.topicId;

    // Liking post from Post Detail Scene
    // eslint-disable-next-line no-underscore-dangle
    if (data.likeTopicOrPost.__typename !== 'LikedTopic') {
      const { actionsSummary, topicId, postNumber } = data.likeTopicOrPost;
      const { liked } = getLikeActionSummary(actionsSummary);

      // Updating topic cache
      cache.updateFragment(
        { id: `Topic:${topicId}`, fragment: TopicLikeFragmentDoc },
        (data) => {
          if (!data) {
            return;
          }

          const { likeCount: previousCount, liked: previousLiked } = data;
          const isFirstPost = postNumber === FIRST_POST_NUMBER;
          const likeCount = getUpdatedLikeCount({ liked, previousCount });

          /**
           * If it's not the first post, then the new liked value
           * doesn't resemble the liked value for topic,
           * so we only update the likeCount
           */
          const likedData = {
            likeCount,
            liked: isFirstPost ? liked : previousLiked,
          };
          addOngoingLikedTopic(topicId, likedData);
          return { ...data, ...likedData };
        },
      );
      // Updating post cache
      return data;
    }

    // Liking post from Home Scene
    const { liked, likeCount, topicId, postId } = data.likeTopicOrPost;
    // Updating post cache
    cache.updateFragment(
      { id: `Post:${postId}`, fragment: PostLikeFragmentDoc },
      (data) => {
        if (!data) {
          return;
        }
        const actionsSummary = getUpdatedSummaryOnToggleLike({
          cachedActionsSummary: data.actionsSummary,
          liked,
        });
        return { ...data, actionsSummary };
      },
    );

    // Updating topic cache
    addOngoingLikedTopic(topicId, { liked, likeCount });
    cache.updateFragment(
      { id: `Topic:${topicId}`, fragment: TopicLikeFragmentDoc },
      (data) => ({ ...data, liked, likeCount }),
    );
  };

  const removeTopicFromOngoingLikedTopic = () => {
    if (topicIdRef.current) {
      removeOngoingLikedTopic(topicIdRef.current);
    }
  };

  const onError: MutationOnError = (e) => {
    removeTopicFromOngoingLikedTopic();
    // TODO: add navigation #800
    errorHandlerAlert(e, navigate, false);
  };

  const mutation = useMutation<
    LikeTopicOrPostMutation,
    LikeTopicOrPostVariables
  >(LikeTopicOrPostDocument, {
    update,
    optimisticResponse,
    onError,
    onCompleted: removeTopicFromOngoingLikedTopic,
    refetchQueries,
    onQueryUpdated,
  });

  return mutation;
}
