import { gql } from '@apollo/client';

export const POST_RAW = gql`
  query PostRaw($postId: Int!) {
    postRaw(postId: $postId)
      @rest(type: "PostRaw", path: "/posts/{args.postId}/raw.json") {
      raw
      cooked(postId: $postId)
        @rest(type: "PostCooked", path: "/posts/{args.postId}/cooked.json") {
        markdownContent
        mentions
      }
    }
  }
`;
