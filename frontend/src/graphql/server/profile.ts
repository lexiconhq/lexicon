import { gql } from '@apollo/client';

import { USER_ACTIONS_FRAGMENT } from './userActivity';

export const PROFILE = gql`
  query Profile($username: String!) {
    ${USER_ACTIONS_FRAGMENT}
    userProfile(username: $username) {
      unreadNotification
      user {
        ... on UserLite {
          __typename
          avatar: avatarTemplate
          username
          name
          bioRaw
        }
        ... on UserDetail {
          __typename
          avatar: avatarTemplate
          username
          name
          websiteName
          bioRaw
          location
          dateOfBirth
          email
          secondaryEmails
          unconfirmedEmails
          canEditUsername
          admin
          status {
            ...UserStatusFragment
          }
        }
      }
    }
  }
`;
