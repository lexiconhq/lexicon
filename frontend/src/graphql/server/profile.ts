import { gql } from '@apollo/client';

export const PROFILE = gql`
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
        }
      }
    }
  }
`;
