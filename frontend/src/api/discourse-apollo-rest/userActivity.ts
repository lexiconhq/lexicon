import { gql } from '@apollo/client';

// Later need remove user fragment from prose-apollo-grapqhl
export const USER_ACTION_FRAGMENT = gql`
  fragment UserActionFragment on UserActions {
    actionType
    avatarTemplate
    categoryId
    createdAt
    excerpt
    postId
    postNumber
    title
    topicId
    username
    hidden
    markdownContent
  }
`;

export const USER_ACTIVITY = gql`
  ${USER_ACTION_FRAGMENT}
  query UserActivity($username: String!, $offset: Int!, $filter: String) {
    # If require we can change activity same like prose userActivity. For now we use different name because cache. userActivity already used.
    activity(username: $username, offset: $offset, filter: $filter)
      @rest(
        type: "UserActions"
        path: "/user_actions.json?username={args.username}&offset={args.offset}&filter={args.filter}&no_results_help_key=user_activity.no_default"
      ) {
      ...UserActionFragment
    }
  }
`;
