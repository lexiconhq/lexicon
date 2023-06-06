import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import ExpoConstants from 'expo-constants';
import { onError } from '@apollo/client/link/error';
import { getNetworkStateAsync } from 'expo-network';

import {
  errorTypes,
  ERROR_HANDLED_BY_LINK,
  getProseEndpoint,
} from '../constants';
import {
  appendPagination,
  getTopicDetailOutputCacheBehavior,
  getToken,
  prependAppendPagination,
  replaceDataPagination,
  userActivityPagination,
  removeToken,
  showLogoutAlert,
  handleDuplicates,
} from '../helpers';
import { networkStatusVar, requestFailedVar } from '../components/RequestError';
import { reset } from '../navigation/NavigationService';
import Config from '../../Config';

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
            if (
              !context.variables ||
              !context.variables.categoryId ||
              !context.variables.sort
            ) {
              return '';
            }
            let { categoryId, sort } = context.variables;
            return `${categoryId}-${sort}`;
          },
          merge: (existing, incoming, { variables }) => {
            if (!variables) {
              return incoming;
            }

            if (!existing || !incoming) {
              return incoming || existing || undefined;
            }
            let mergedTopics = [];
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

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();

  // It is recommended to always include `User Agent` header in all requests
  const userAgent = await ExpoConstants.getWebViewUserAgentAsync();
  return {
    headers: {
      ...headers,
      Authorization: token,
      'User-Agent': userAgent,
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
      removeToken();
      reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            params: { screen: 'InstanceLoading' },
          },
        ],
      });

      /**
       * Setting the error message to ERROR_HANDLED_BY_LINK const to avoid
       * showing error alert because it's already handled in error link
       */
      sessionExpired.message = ERROR_HANDLED_BY_LINK;
      return;
    }
  }

  if (networkError || !!graphQLErrors?.length) {
    requestFailedVar(true);
  }
});

const successLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((data) => {
    networkStatusVar('Online');
    return data;
  });
});

export const client = new ApolloClient({
  link: ApolloLink.from([successLink, errorLink, authLink, uploadLink]),
  cache,
});
