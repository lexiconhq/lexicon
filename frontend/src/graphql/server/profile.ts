import { gql } from '@apollo/client';

import { USER_STATUS_FRAGMENT } from './userStatus';

export const PROFILE = gql`
  ${USER_STATUS_FRAGMENT}
  query Profile($username: String!) {
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
