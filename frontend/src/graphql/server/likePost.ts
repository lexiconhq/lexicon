import { gql } from '@apollo/client';

export const likePost = gql`
  mutation LikePost($postId: Int!, $unlike: Boolean, $postList: Boolean) {
    likePost(postId: $postId, unlike: $unlike, postList: $postList) {
      actionsSummary {
        id
        acted
        count
      }
    }
  }
`;
