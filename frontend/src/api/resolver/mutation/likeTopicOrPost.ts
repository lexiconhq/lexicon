import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { LIKE_ACTION_ID } from '../../../constants';
import {
  GetTopicDetailDocument,
  GetTopicDetailQueryVariables,
  GetTopicDetailQuery as GetTopicDetailType,
  LikeTopicOrPostMutationVariables,
  LikeTopicOrPostRestDocument,
  LikeTopicOrPostRestMutationVariables,
  LikeTopicOrPostRestMutation as LikeTopicOrPostRestType,
  PostQueryDocument,
  PostQueryVariables,
  PostQuery as PostType,
  UnlikeTopicOrPostDocument,
  UnlikeTopicOrPostMutationVariables,
  UnlikeTopicOrPostMutation as UnlikeTopicOrPostType,
} from '../../../generatedAPI/server';
import { ApolloErrorSchema } from '../../../types';
import { ActionsSummary, LikedTopic } from '../../../types/api';
import {
  topicsDetailPathBuilder,
  unlikeTopicOrPostPathBuilder,
} from '../../pathBuilder';
import { getUpdatedLikedTopic } from '../helper/getUpdatedLikedTopic';
import { likeErrorHandler } from '../helper/likeErrorHandler';

type LikableEntity = 'post' | 'topic';

export let likeTopicOrPostResolver = async (
  _: Record<string, unknown>,
  { postId, topicId, unlike }: LikeTopicOrPostMutationVariables,
  { client }: { client: ApolloClient<NormalizedCacheObject> },
) => {
  if ((!postId && !topicId) || (postId && topicId)) {
    throw new Error('Please provide either only the post ID or the topic ID');
  }

  let likableEntity: LikableEntity = 'post';
  let currentLikedTopicResponse: LikedTopic | null = null;
  let actionsSummary: ActionsSummary | null | undefined = null;

  // Get the first post actions summary and ID of the topic
  if (topicId) {
    let { data: topicDetailData } = await client.query<
      GetTopicDetailType,
      GetTopicDetailQueryVariables
    >({
      query: GetTopicDetailDocument,
      variables: {
        topicId,
        includeFirstPost: true,
        topicDetailPath: topicsDetailPathBuilder,
      },
    });
    let { likeCount, postStream } = topicDetailData.topicDetail;

    likableEntity = 'topic';
    const post = postStream.firstPost;
    postId = post?.id;
    if (!postId) {
      throw new Error('Unable to find the first post of this topic');
    }
    actionsSummary = post?.actionsSummary;
    currentLikedTopicResponse = {
      postId,
      topicId,
      likeCount,
      id: postId,
      liked: !unlike,
    };
  }

  // Try-catch block to handle like mutation error
  try {
    // Unliking topic or post
    if (unlike) {
      let { data } = await client.mutate<
        UnlikeTopicOrPostType,
        UnlikeTopicOrPostMutationVariables
      >({
        mutation: UnlikeTopicOrPostDocument,
        variables: {
          postId,
          unlikeTopicOrPostPath: unlikeTopicOrPostPathBuilder,
        },
      });

      if (topicId && currentLikedTopicResponse) {
        return getUpdatedLikedTopic({
          currentLikedTopicResponse,
          isLiked: false,
        });
      }
      return data?.unlikeTopicOrPost;
    }

    // Liking topic or post
    if (postId) {
      let { data } = await client.mutate<
        LikeTopicOrPostRestType,
        LikeTopicOrPostRestMutationVariables
      >({
        mutation: LikeTopicOrPostRestDocument,
        variables: {
          likePostInput: {
            id: postId,
            postActionTypeId: LIKE_ACTION_ID,
          },
        },
      });

      if (topicId && currentLikedTopicResponse) {
        return getUpdatedLikedTopic({
          currentLikedTopicResponse,
          isLiked: true,
        });
      }
      return data?.likeTopicOrPostRest;
    }
  } catch (unknownError) {
    const errorResult = ApolloErrorSchema.safeParse(unknownError);

    if (errorResult.success) {
      /**
       * Get actions summary from the specified post ID
       * only when content type is post, because we already have
       * the actionsSummary from topic detail when content
       * type is topic
       */
      if (likableEntity === 'post' && postId) {
        let { data } = await client.query<PostType, PostQueryVariables>({
          query: PostQueryDocument,
          variables: {
            postId,
          },
          fetchPolicy: 'no-cache',
        });
        actionsSummary = data.postQuery.actionsSummary;
      }
      likeErrorHandler(errorResult.data, {
        actionsSummary,
        likableEntity,
        like: !unlike,
      });
    }
  }
};
