import { gql } from '@apollo/client';

export const POST_LIKE_FRAGMENT = gql`
  fragment PostLikeFragment on Post {
    id
    topicId
    postNumber
    actionsSummary {
      id
      count
      acted
      __typename @skip(if: true)
    }
  }
`;

export const TOPIC_LIKE_FRAGMENT = gql`
  fragment TopicLikeFragment on Topic {
    id
    liked
    likeCount
  }
`;

export const LIKE_TOPIC_OR_POST = gql`
  ${POST_LIKE_FRAGMENT}
  mutation likeTopicOrPost($postId: Int, $topicId: Int, $unlike: Boolean) {
    likeTopicOrPost(postId: $postId, unlike: $unlike, topicId: $topicId)
      @client {
      ... on LikedTopic {
        __typename
        topicId
        liked
        likeCount
        postId
      }
      ... on Post {
        __typename
        id
        topicId
        postNumber
        actionsSummary {
          id
          count
          acted
          __typename @skip(if: true)
        }
      }
    }
  }
`;

export const UNLIKE_TOPIC_OR_POST = gql`
  mutation unlikeTopicOrPost(
    $postId: Int
    $unlikeTopicOrPostPath: PathBuilder
  ) {
    unlikeTopicOrPost(postId: $postId)
      @rest(
        type: "Post"
        path: ""
        method: "DELETE"
        pathBuilder: $unlikeTopicOrPostPath
      ) {
      id
      topicId
      postNumber
      actionsSummary {
        id
        count
        acted
      }
    }
  }
`;

export const LIKE_TOPIC_OR_POST_REST = gql`
  mutation likeTopicOrPostRest($likePostInput: LikePostInput!) {
    likeTopicOrPostRest(likePostInput: $likePostInput)
      @rest(
        type: "Post"
        path: "/post_actions.json"
        method: "POST"
        bodyKey: "likePostInput"
      ) {
      id
      topicId
      postNumber
      actionsSummary {
        id
        count
        acted
      }
    }
  }
`;
