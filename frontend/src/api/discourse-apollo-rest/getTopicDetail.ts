import { gql } from '@apollo/client';

import { POLL_FRAGMENT } from './poll';
import { USER_STATUS_FRAGMENT } from './userStatus';

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
      userId
      description
      user {
        id
        username
        name
        avatar: avatarTemplate
      }
    }
    authorUserId
    pinned
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
      canUndo
      __typename @skip(if: true)
    }
    postNumber
    replyToPostNumber
    userStatus @type(name: "UserStatus") {
      ...UserStatusFragment
    }
    polls @type(name: "Poll") {
      ...PollFragment
    }
    pollsVotes {
      pollName
      pollOptionIds
    }
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

export const GET_TOPIC_DETAIL = gql`
  ${POST_FRAGMENT}
  query GetTopicDetail(
    $topicId: Int!
    $postIds: [Int!]
    $postNumber: Int
    $includeFirstPost: Boolean
    $topicDetailPath: PathBuilder
  ) {
    topicDetail(
      topicId: $topicId
      postIds: $postIds
      postNumber: $postNumber
      includeFirstPost: $includeFirstPost
    )
      @rest(
        type: "TopicDetailOutput"
        path: ""
        pathBuilder: $topicDetailPath
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
      deletedAt
      postStream @type(name: "PostStream") {
        posts @type(name: "Post") {
          ...PostFragment
        }
        stream
        firstPost @type(name: "Post") {
          ...PostFragment
        }
      }
      details @type(name: "TopicDetail") {
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

export const REPLIED_POST = gql`
  ${POST_FRAGMENT}
  query repliedPost($postId: Int!, $replyToPostId: Int) {
    replyingTo(postId: $postId, replyToPostId: $replyToPostId)
      @rest(
        type: "ReplyingToOutput"
        path: "/posts/{args.postId}/reply-history.json?max_replies=1"
      ) {
      id @export(as: "id")
      post
        @rest(
          path: "/posts/{exportVariables.id}.json?include_raw=true"
          type: "Post"
        ) {
        ...PostFragment
      }
    }
  }
`;

export const POST = gql`
  query PostQuery($postId: Int!) {
    postQuery(postId: $postId)
      @rest(path: "/posts/{args.postId}.json", type: "Post") {
      ...PostFragment
    }
  }
`;

export const EDIT_TOPIC = gql`
  mutation EditTopic($topicInput: EditTopicInput!, $topicId: Int!) {
    editTopic(topicInput: $topicInput, topicId: $topicId)
      @rest(
        type: "BasicTopic"
        path: "/t/-/{args.topicId}.json"
        method: "PUT"
        bodyKey: "topicInput"
      ) {
      id
    }
  }
`;

export const EDIT_POST = gql`
  mutation EditPost($editPostInput: EditPostInput!, $postId: Int!) {
    editPost(editPostInput: $editPostInput, postId: $postId)
      @rest(
        type: "EditPostOutput"
        path: "/posts/{args.postId}.json"
        method: "PUT"
        bodyKey: "editPostInput"
      ) {
      post {
        id
        postNumber
      }
    }
  }
`;
