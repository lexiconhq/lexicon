import { gql } from '@apollo/client';

import { USER_STATUS_FRAGMENT } from './userStatus';

export const PROFILE = gql`
  ${USER_STATUS_FRAGMENT}
  query Profile($username: String!) {
    profile(username: $username)
      @rest(type: "ProfileOutput", path: "/users/{args.username}.json") {
      user {
        avatar: avatarTemplate
        username
        name
        websiteName
        bioRaw: bioExcerpt
        location
        dateOfBirth
        email
        secondaryEmails
        unconfirmedEmails
        canEditUsername
        admin
        status @type(name: "UserStatus") {
          ...UserStatusFragment
        }
      }
      unreadNotification
        @rest(
          type: "UserUnreadNotifications"
          path: "/notifications.json?filter=unread&limit=30"
        ) {
        isThereUnreadNotifications
      }
    }
  }
`;
