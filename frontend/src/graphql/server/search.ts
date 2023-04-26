import { gql } from '@apollo/client';

export const SEARCH_POST_FRAGMENT = gql`
  fragment SearchPostFragment on SearchPost {
    id
    avatarTemplate
    blurb
    createdAt
    username
    likeCount
    postNumber
    topicId
  }
`;

export const SEARCH_TOPIC_FRAGMENT = gql`
  fragment SearchTopicFragment on SearchTopic {
    id
    title
    postsCount
    replyCount
    createdAt
    archetype
    excerpt
    visible
    liked
    tags
    categoryId
  }
`;

export const SEARCH = gql`
  ${SEARCH_POST_FRAGMENT}
  ${SEARCH_TOPIC_FRAGMENT}
  query Search($search: String!, $page: Int!, $order: String) {
    search(search: $search, page: $page, order: $order) {
      posts {
        ...SearchPostFragment
      }
      topics {
        ...SearchTopicFragment
      }
    }
  }
`;

export const SEARCH_TAGS = gql`
  query SearchTags($q: String!, $limit: Int, $selectedTags: [String!]) {
    searchTag(q: $q, limit: $limit, selectedTags: $selectedTags) {
      count
      id
      text
    }
  }
`;

export const SEARCH_USER = gql`
  query SearchUser($search: String!) {
    searchUser(search: $search) {
      groups {
        fullName
        name
      }
      users {
        avatar: avatarTemplate
        name
        username
      }
    }
  }
`;
