import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login(
    $email: String!
    $password: String!
    $secondFactorToken: String
  ) {
    login(
      email: $email
      password: $password
      secondFactorToken: $secondFactorToken
    ) {
      ... on LoginOutput {
        token
        user {
          id
          name
          username
          avatar: avatarTemplate
          trustLevel
          groups {
            id
            name
          }
        }
      }
      ... on SecondFactorRequired {
        secondFactorRequired
        error
        reason
        backupEnabled
        securityKeyEnabled
        multipleSecondFactorMethods
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($registerInput: RegisterInput) {
    register(registerInput: $registerInput) {
      success
      message
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout($username: String!, $pushNotificationsToken: String) {
    logout(username: $username, pushNotificationsToken: $pushNotificationsToken)
  }
`;
