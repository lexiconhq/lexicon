import { gql } from '@apollo/client';

export const DELETE_PUSH_NOTIFICATIONS_SUBSCRIBE = gql`
  mutation DeletePushNotificationsSubscribe(
    $deletePushNotificationsSubscribeInput: DeletePushNotificationsSubscribeInput!
  ) {
    deletePushNotificationsSubscribe(
      deletePushNotificationsSubscribeInput: $deletePushNotificationsSubscribeInput
    )
      @rest(
        type: "String"
        path: "/lexicon/push_notifications/delete_subscribe.json"
        method: "POST"
        bodyKey: "deletePushNotificationsSubscribeInput"
      )
  }
`;

export const REVOKE_USER_API_KEY = gql`
  mutation RevokeUserApiKey($revokeUserApiKeyInput: EmptyInput) {
    revokeUserApiKey(revokeUserApiKeyInput: $revokeUserApiKeyInput)
      @rest(
        type: "String"
        path: "/user-api-key/revoke"
        method: "POST"
        bodyKey: "revokeUserApiKeyInput"
      )
  }
`;

export const LOGOUT = gql`
  mutation Logout($pushNotificationsToken: String) {
    logout(pushNotificationsToken: $pushNotificationsToken) @client
  }
`;
