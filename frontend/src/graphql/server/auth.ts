import { gql } from '@apollo/client';

export const LOGIN_OUTPUT_FRAGMENT = gql`
  fragment LoginOutputFragment on LoginOutput {
    token
    enableLexiconPushNotifications
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
`;

export const LOGIN = gql`
  ${LOGIN_OUTPUT_FRAGMENT}
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
        ...LoginOutputFragment
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

export const LOGIN_WITH_APPLE = gql`
  ${LOGIN_OUTPUT_FRAGMENT}
  mutation LoginWithApple($identityToken: String!) {
    loginWithApple(identityToken: $identityToken) {
      ...LoginOutputFragment
    }
  }
`;

export const ACTIVATE_ACCOUNT = gql`
  ${LOGIN_OUTPUT_FRAGMENT}
  mutation ActivateAccount($token: String!) {
    activateAccount(token: $token) {
      ...LoginOutputFragment
    }
  }
`;

export const REQUEST_LOGIN_LINK = gql`
  mutation RequestLoginLink($login: String!) {
    requestLoginLink(login: $login)
  }
`;

export const AUTHENTICATE_LOGIN_LINK = gql`
  ${LOGIN_OUTPUT_FRAGMENT}
  mutation AuthenticateLoginLink($token: String!) {
    authenticateLoginLink(token: $token) {
      ...LoginOutputFragment
    }
  }
`;
