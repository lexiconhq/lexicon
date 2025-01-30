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
  query Search(
    $search: String!
    $page: Int!
    $order: String
    $searchPostPath: PathBuilder
  ) {
    search(search: $search, page: $page, order: $order)
      @rest(type: "SearchOutput", path: "", pathBuilder: $searchPostPath) {
      posts @type(name: "SearchPost") {
        ...SearchPostFragment
      }
      topics @type(name: "SearchTopic") {
        ...SearchTopicFragment
      }
    }
  }
`;

/**
 * The `@rest` directive supports using a function type for the `pathBuilder`
 * argument; however, GraphQL itself does not support using function types for
 * input variables. This implementation is based on the discussion found in
 * https://github.com/apollographql/apollo-link-rest/issues/69#issue-298010443.
 *
 * To work around this limitation, we generate the necessary path as a string
 * within the hook and pass it to the query. The path construction logic is
 * implemented in `frontend/src/api/pathBuilder/searchTag.ts`.
 */

export const SEARCH_TAGS = gql`
  query SearchTags(
    $q: String!
    $limit: Int
    $selectedTags: [String!]
    $searchPath: PathBuilder
  ) {
    searchTag(q: $q, limit: $limit, selectedTags: $selectedTags)
      @rest(type: "SearchTagOutput", pathBuilder: $searchPath, path: "") {
      count
      id
      text
    }
  }
`;

export const SEARCH_USER = gql`
  query SearchUser($search: String!) {
    searchUser(search: $search)
      @rest(
        type: "SearchUserOutput"
        path: "/u/search/users.json?term={args.search}&include_groups=false&include_mentionable_groups=false&include_messageable_groups=true&topic_allowed_users=false"
      ) {
      groups {
        fullName
        name
      }
      users {
        avatar: avatarTemplate
        name
        username
        id
      }
    }
  }
`;
