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
    likeTopicOrPost(postId: $postId, unlike: $unlike, topicId: $topicId) {
      ... on LikedTopic {
        __typename
        topicId
        liked
        likeCount
        postId
      }
      ... on Post {
        __typename
        ...PostLikeFragment
      }
    }
  }
`;
