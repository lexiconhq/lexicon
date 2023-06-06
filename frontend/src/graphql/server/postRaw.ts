import { gql } from '@apollo/client';

export const POST_RAW = gql`
  query PostRaw($postId: Int!) {
    postRaw(postId: $postId) {
      markdownContent
      mentions
    }
  }
`;
