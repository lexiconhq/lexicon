import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment TempUsers on UserIcon {
    id
    username
    name
    avatar: avatarTemplate
  }
`;

export const TOPIC_FRAGMENT = gql`
  fragment TempTopic on Topic {
    id
    title
    excerpt
    categoryId
    tags
    imageUrl
    authorUserId
    posters {
      userId
    }
    likeCount
  }
`;

export const GET_TOPIC_DETAIL = gql`
  query GetTopicDetail($topicId: Int!, $posts: [Int!], $postPointer: Int) {
    topicDetail(topicId: $topicId, posts: $posts, postPointer: $postPointer) {
      id
      title
      views
      likeCount
      postsCount
      liked
      categoryId
      tags
      createdAt
      postStream {
        posts {
          id
          topicId
          username
          actionCode
          actionCodeWho
          avatar: avatarTemplate
          raw
          hidden
          canEdit
          listOfCooked
          listOfMention
          createdAt
          replyCount
          actionsSummary {
            id
            count
            acted
            __typename @skip(if: true)
          }
          postNumber
          replyToPostNumber
        }
        stream
      }
      details {
        canEdit
        allowedUsers {
          id
          username
          avatarTemplate
        }
        participants {
          id
          username
          avatar: avatarTemplate
          name
        }
      }
    }
  }
`;

export const EDIT_TOPIC = gql`
  mutation EditTopic($topicInput: EditTopicInput!, $topicId: Int!) {
    editTopic(topicInput: $topicInput, topicId: $topicId) {
      id
    }
  }
`;

export const EDIT_POST = gql`
  mutation EditPost($postInput: EditPostInput!, $postId: Int!) {
    editPost(postInput: $postInput, postId: $postId) {
      id
      postNumber
    }
  }
`;
