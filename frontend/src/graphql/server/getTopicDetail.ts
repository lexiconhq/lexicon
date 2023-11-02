import { gql } from '@apollo/client';

import { USER_STATUS_FRAGMENT } from './userStatus';
import { POLL_FRAGMENT } from './poll';

export const USER_FRAGMENT = gql`
  fragment UserFragment on UserIcon {
    id
    username
    name
    avatar: avatarTemplate
  }
`;

export const TOPIC_FRAGMENT = gql`
  fragment TopicFragment on Topic {
    id
    title
    imageUrl
    postsCount
    replyCount
    createdAt
    bumpedAt
    excerpt
    visible
    liked
    tags
    views
    likeCount
    categoryId
    posters {
      ... on TopicPoster {
        userId
        description
        user {
          id
          username
          name
          avatar: avatarTemplate
        }
      }
      ... on SuggestionTopicPoster {
        description
        user {
          id
          username
          name
          avatar: avatarTemplate
        }
      }
    }
    authorUserId
    pinned
  }
`;

export const TOPIC_DETAIL_FRAGMENT = gql`
  fragment TopicDetailFragment on TopicDetailOutput {
    postStream {
      posts {
        id
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

export const POST_FRAGMENT = gql`
  ${USER_STATUS_FRAGMENT}
  ${POLL_FRAGMENT}
  fragment PostFragment on Post {
    id
    topicId
    username
    actionCode
    actionCodeWho
    avatar: avatarTemplate
    hidden
    canEdit
    markdownContent
    mentions
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
    userStatus {
      ...UserStatusFragment
    }
    polls {
      ...PollFragment
    }
    pollsVotes {
      pollName
      pollOptionIds
    }
  }
`;

export const GET_TOPIC_DETAIL = gql`
  ${POST_FRAGMENT}
  query GetTopicDetail(
    $topicId: Int!
    $postIds: [Int!]
    $postNumber: Int
    $includeFirstPost: Boolean
  ) {
    topicDetail(
      topicId: $topicId
      postIds: $postIds
      postNumber: $postNumber
      includeFirstPost: $includeFirstPost
    ) {
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
          ...PostFragment
        }
        stream
        firstPost {
          ...PostFragment
        }
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

export const REPLIED_POST = gql`
  ${POST_FRAGMENT}
  query repliedPost($postId: Int!, $replyToPostId: Int) {
    replyingTo(postId: $postId, replyToPostId: $replyToPostId) {
      ...PostFragment
    }
  }
`;
