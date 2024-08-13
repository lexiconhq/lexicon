import { createUploadLink } from 'apollo-upload-client';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Reference,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import ExpoConstants from 'expo-constants';
import { onError } from '@apollo/client/link/error';
import { getNetworkStateAsync } from 'expo-network';

import {
  errorTypes,
  ERROR_HANDLED_BY_LINK,
  getProseEndpoint,
  NO_CHANNEL_FILTER,
  CUSTOM_HEADER_NEW_TOKEN,
} from '../constants';
import {
  appendPagination,
  getTopicDetailOutputCacheBehavior,
  prependAppendPagination,
  replaceDataPagination,
  userActivityPagination,
  showLogoutAlert,
  handleDuplicates,
} from '../helpers';
import { networkStatusVar, requestFailedVar } from '../components/RequestError';
import Config from '../../Config';
import { logoutTokenVar, setTokenState, tokenVar } from '../reactiveVars';

const cache = new InMemoryCache({
  typePolicies: {
    TopicDetailOutput: getTopicDetailOutputCacheBehavior(),
    PrivateMessageDetailOutput: getTopicDetailOutputCacheBehavior(),
    PostStream: {
      fields: {
        posts: prependAppendPagination(),
        stream: replaceDataPagination(),
        firstPost: replaceDataPagination(),
      },
    },
    Post: {
      fields: {
        actionsSummary: replaceDataPagination(),
        hidden: replaceDataPagination(),
        raw: replaceDataPagination(),
      },
    },
    PostRaw: {
      fields: {
        raw: replaceDataPagination(),
      },
    },
    TopicsOutput: {
      keyFields: [],
      fields: {
        users: {
          merge: (existing, incoming) => {
            if (!existing || !incoming) {
              return incoming || existing;
            }
            return handleDuplicates({
              oldArray: existing,
              newArray: incoming,
              newArrayIs: 'appended',
            });
          },
        },
        topicList: {
          /**
           * TODO: refactor this merge function and standarize other pagination approaches
           * https://github.com/kodefox/lexicon/issues/926
           */
          keyArgs: (_, context) => {
            if (!context.variables || !context.variables.sort) {
              return '';
            }

            let { categoryId, sort } = context.variables;
            return `${categoryId ?? NO_CHANNEL_FILTER.id}-${sort}`;
          },
          merge: (existing, incoming, { variables }) => {
            if (!variables) {
              return incoming;
            }

            if (!existing || !incoming) {
              return incoming || existing || undefined;
            }
            let mergedTopics: Readonly<Array<Reference>> = [];
            if (variables.page > 0) {
              mergedTopics = handleDuplicates({
                newArray: incoming.topics,
                oldArray: existing.topics,
                newArrayIs: 'appended',
              });
            } else {
              mergedTopics = handleDuplicates({
                newArray: incoming.topics,
                oldArray: existing.topics,
                newArrayIs: 'prepended',
              });
            }
            return {
              ...existing,
              topics: mergedTopics,
            };
          },
        },
      },
    },
    UserActions: {
      keyFields: ['postId', 'topicId', 'actionType'],
    },
    Query: {
      fields: {
        notification: appendPagination(false, 'NOTIFICATIONS'),
        privateMessageDetail: replaceDataPagination(['topicId']),
        privateMessage: appendPagination(false, 'MESSAGE_DETAIL'),
        search: appendPagination(false, 'SEARCH'),
        topicDetail: replaceDataPagination(['topicId']),
        userActivity: userActivityPagination(['username']),
        replyingTo: {
          read: (_, { args, toReference }) => {
            return toReference({ __typename: 'Post', id: args?.replyToPostId });
          },
        },
      },
    },
  },
});

const authLink = setContext(async (graphqlRequest, { headers }) => {
  const token = tokenVar();
  const logoutToken = logoutTokenVar();

  // It is recommended to always include `User Agent` header in all requests
  const userAgent = await ExpoConstants.getWebViewUserAgentAsync();
  const additionalHeaders: Record<string, string> = {};
  if (token) {
    additionalHeaders.Authorization = token;
  }

  /**
   * We specifically use different token for logout request
   * This is needed as the tokenVar will be turned to null on logout
   * Otherwise if we want to stick to using tokenVar,
   * we will needed to await the logout request
   */
  if (graphqlRequest.operationName === 'Logout' && logoutToken) {
    additionalHeaders.Authorization = logoutToken;
    logoutTokenVar(null);
  }

  if (userAgent) {
    additionalHeaders['User-Agent'] = userAgent;
  }
  return {
    headers: {
      ...headers,
      ...additionalHeaders,
    },
  };
});

export let proseEndpoint = getProseEndpoint(
  Config.proseUrl,
  'inferDevelopmentHost' in Config ? Config.inferDevelopmentHost : undefined,
);

const uploadLink = createUploadLink({
  uri: proseEndpoint,
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (networkError?.message === 'Network request failed') {
    /**
     * using then to avoid using observable
     * because onError doesn't accept async
     */
    getNetworkStateAsync().then(({ isInternetReachable }) => {
      networkStatusVar(
        isInternetReachable ? 'ProseUnreachable' : 'NoConnection',
      );
    });
    return;
  }
  if (graphQLErrors) {
    /**
     * Ignore any errors from Site Query because we
     * currently use this to check whether our Disccourse
     * instance is public or private
     */
    if (operation.operationName === 'Site') {
      return;
    }

    let sessionExpired = graphQLErrors.find(({ message }) =>
      message.includes(errorTypes.sessionExpired),
    );
    if (sessionExpired) {
      showLogoutAlert();
      setTokenState(null);

      /**
       * Setting the error message to ERROR_HANDLED_BY_LINK const to avoid
       * showing error alert because it's already handled in error link
       */
      sessionExpired.message = ERROR_HANDLED_BY_LINK;
      return;
    }

    let incorrectCredentials = graphQLErrors.find(({ message }) => {
      const normalized = message.toLowerCase();
      return normalized.includes(errorTypes.incorrectCredentials);
    });

    // We don't want to display the error toast from incorrect credentials, because that is
    // a valid error for the user to enter incorrect credentials. It doesn't indicate an issue
    // with the request itself.
    if (incorrectCredentials) {
      return;
    }
  }

  if (networkError || !!graphQLErrors?.length) {
    requestFailedVar(true);
  }
});

const successLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((data) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;
    const newToken = headers.map[CUSTOM_HEADER_NEW_TOKEN];

    if (newToken) {
      setTokenState(newToken);
    }

    return data;
  });
});

export const client = new ApolloClient({
  link: ApolloLink.from([successLink, errorLink, authLink, uploadLink]),
  cache,
});
