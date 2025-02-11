import { ApolloClient, NormalizedCacheObject, Resolver } from '@apollo/client';

import {
  DeletePushNotificationsSubscribeDocument,
  DeletePushNotificationsSubscribeMutationVariables as DeleteSubscribeInput,
  DeletePushNotificationsSubscribeMutation as DeleteSubscribeType,
  LogoutMutationVariables,
  RevokeUserApiKeyDocument,
  RevokeUserApiKeyMutationVariables,
  RevokeUserApiKeyMutation as RevokeUserApiKeyType,
} from '../../../generatedAPI/server';

export let logoutMutationResolver: Resolver = async (
  _,
  { pushNotificationsToken }: LogoutMutationVariables,
  { client }: { client: ApolloClient<NormalizedCacheObject> },
) => {
  try {
    if (pushNotificationsToken) {
      await client.mutate<DeleteSubscribeType, DeleteSubscribeInput>({
        mutation: DeletePushNotificationsSubscribeDocument,
        variables: {
          deletePushNotificationsSubscribeInput: {
            pushNotificationsToken,
          },
        },
      });
    }
  } catch {
    /**
     * No action is taken when an error occurs
     * No action is required because we want the session to be successfully deleted even if there are errors when hitting the API to delete the token in the plugin.
     * For example, if we haven't installed the plugin, it will result in a 404 error when attempting to hit the delete_subscribe API.
     * Similarly, if there is an internal issue with the plugin, it may lead to a 500 error.
     */
  }

  try {
    await client.mutate<
      RevokeUserApiKeyType,
      RevokeUserApiKeyMutationVariables
    >({
      mutation: RevokeUserApiKeyDocument,
      // These variables are required to be sent because the Apollo REST link's POST method expects a body.
      // In this case, we send an empty object as the body since no values are needed to revoke the user API key.
      variables: {
        revokeUserApiKeyInput: {},
      },
    });
    return 'success';
  } catch (error) {
    return 'failed';
  }
};
