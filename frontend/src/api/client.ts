import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Reference,
  defaultDataIdFromObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RestLink } from 'apollo-link-rest';
import * as changeCase from 'change-case';
import ExpoConstants from 'expo-constants';
import { getNetworkStateAsync } from 'expo-network';

import { networkStatusVar, requestFailedVar } from '../components/RequestError';
import { NO_CHANNEL_FILTER, discourseHost, errorTypes } from '../constants';
import { defaultArgsListPostDraft } from '../constants/postDraft';
import {
  appendPagination,
  appendPaginationTypeField,
  decodeToken,
  getLatestApolloId,
  getTopicDetailOutputCacheBehavior,
  handleDuplicates,
  mergeReferenceData,
  prependAppendPagination,
  replaceDataPagination,
  showLogoutAlert,
  userActivityPagination,
} from '../helpers';
import { logoutTokenVar, setTokenState, tokenVar } from '../reactiveVars';

import { bodySerializers } from './bodySerializers';
import {
  createAndUpdatePostDraftResolver,
  editProfileResolver,
  likeTopicOrPostResolver,
  logoutMutationResolver,
  privateMessageListQueryResolver,
} from './resolver';
import { responseTransformers } from './responseTransformer';
import { typePatchers } from './typePatcher';

const cache = new InMemoryCache({
  // This function is used for generating a unique key using __typename.
  // In this case, we use this function to create a unique key for each ListPostDraftsResult
  // data using field 'draft_key', to fix issue with cache not properly merge
  // because ListPostDraftsResult doesn't return an id.
  dataIdFromObject(responseObject) {
    // eslint-disable-next-line no-underscore-dangle
    switch (responseObject.__typename) {
      case 'ListPostDraftsResult':
        return `ListPostDraftsResult:${responseObject.draftKey}`;
      default:
        return defaultDataIdFromObject(responseObject);
    }
  },
  possibleTypes: {
    BasePostDraft: [
      'NewPostDraft',
      'PostReplyDraft',
      'NewPrivateMessageDraft',
      'PrivateMessageReplyDraft',
    ],
  },
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
        users: appendPaginationTypeField(),
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
                newArray: incoming['topics@type({"name":"Topic"})'],
                oldArray: existing['topics@type({"name":"Topic"})'],
                newArrayIs: 'appended',
              });
            } else {
              mergedTopics = handleDuplicates({
                newArray: incoming['topics@type({"name":"Topic"})'],
                oldArray: existing['topics@type({"name":"Topic"})'],
                newArrayIs: 'prepended',
              });
            }
            return {
              ...existing,
              'topics@type({"name":"Topic"})': mergedTopics,
            };
          },
        },
      },
    },
    GetChatChannelsOutput: {
      keyFields: [],
      fields: {
        channels: {
          keyArgs: (_, context) => {
            if (!context.variables || !context.variables.status) {
              return '';
            }

            let { filter, status } = context.variables;
            return `${filter ?? ''}-${status}`;
          },
          merge: (existing, incoming, { variables }) => {
            if (!variables) {
              return incoming;
            }

            if (!existing || !incoming) {
              return incoming || existing || undefined;
            }
            let mergedChannels: Readonly<Array<Reference>> = [];
            if (variables.offset > 0) {
              mergedChannels = handleDuplicates({
                newArray: incoming,
                oldArray: existing,
                newArrayIs: 'appended',
              });
            } else {
              mergedChannels = handleDuplicates({
                newArray: incoming,
                oldArray: existing,
                newArrayIs: 'prepended',
              });
            }
            return mergedChannels;
          },
        },
      },
    },
    UserActions: {
      keyFields: ['postId', 'topicId', 'actionType'],
    },
    ChatChannelMessages: {
      keyFields: [],
      fields: {
        messages: {
          keyArgs: (_, context) => {
            if (!context.variables || !context.variables.channelId) {
              return '';
            }

            let { channelId } = context.variables;
            return `channel-${channelId}`;
          },
          merge: (existing, incoming) => {
            // NOTE: We should not reverse exisiting data because it is already reversed in the previous iteration
            if (!incoming) {
              return existing;
            }
            if (!existing) {
              return incoming ? [...incoming].reverse() : undefined;
            }

            const reversedIncoming = [...incoming].reverse();
            let lastExisting = getLatestApolloId(existing);
            let lastIncoming = getLatestApolloId(reversedIncoming);

            if (!lastExisting || !lastIncoming) {
              return existing;
            }

            return mergeReferenceData({
              existing,
              incoming: reversedIncoming,
              lastExisting,
              lastIncoming,
              reverse: true,
            });
          },
        },
        canLoadMorePast: {
          keyArgs: (_, context) => {
            if (!context.variables || !context.variables.channelId) {
              return '';
            }

            let { channelId } = context.variables;
            return `channel-${channelId}`;
          },
          merge: (existing, incoming, { variables }) => {
            return variables?.isPolling ? existing : incoming;
          },
        },
      },
    },
    GetThreadMessagesOutput: {
      keyFields: [],
      fields: {
        messages: prependAppendPagination((_, context) => {
          if (!context.variables || !context.variables.threadId) {
            return '';
          }

          let { threadId, channelId } = context.variables;
          return `${channelId}-${threadId}`;
        }, true),
      },
    },
    Query: {
      fields: {
        notificationQuery: appendPagination(false, 'NOTIFICATIONS'),
        privateMessageDetailQuery: replaceDataPagination(['topicId']),
        privateMessageList: appendPagination(false, 'MESSAGE_DETAIL'),
        search: appendPagination(false, 'SEARCH'),
        topicDetail: replaceDataPagination(['topicId']),
        activity: userActivityPagination(['username']),
        replyingTo: {
          read: (_, { args, toReference }) => {
            return toReference({ __typename: 'Post', id: args?.replyToPostId });
          },
        },
        searchTag: replaceDataPagination(['q', 'selectedTags']),
        listPostDrafts: {
          keyArgs: false,
          merge: (existing, incoming, { variables }) => {
            if (!existing || !incoming) {
              return existing || incoming || null;
            }

            const { page } = variables || {};

            // Calculate how many items we expect in total based on the page number ex page 1 expect 50
            const expectedTotal = page
              ? page * defaultArgsListPostDraft.limit
              : 0;

            // If we're loading a previous page and already have enough items, prepend
            if (page && expectedTotal <= existing.length) {
              return handleDuplicates({
                oldArray: existing,
                newArray: incoming,
                newArrayIs: 'prepended',
              });
            }
            return handleDuplicates({
              oldArray: existing,
              newArray: incoming,
              newArrayIs: 'appended',
            });
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
    additionalHeaders['User-Api-Key'] = decodeToken(token);
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

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (networkError?.message === 'Network request failed') {
    /**
     * using then to avoid using observable
     * because onError doesn't accept async
     */
    getNetworkStateAsync().then(({ isInternetReachable }) => {
      networkStatusVar(
        isInternetReachable ? 'DiscourseUnreachable' : 'NoConnection',
      );
    });
    return;
  } else if (networkError && 'result' in networkError) {
    if (operation.operationName === 'Site') {
      return;
    }

    /**
     * Handles invalid access errors from Discourse via Apollo Link REST.
     * In the future, all API error handling from errorHandler at folder api should be consolidated here.
     */

    if ('error_type' in networkError.result) {
      let invalidAccess =
        operation.operationName !== 'GetTopicDetail' &&
        operation.operationName !== 'GetMessageDetail' &&
        operation.operationName !== 'Site' &&
        networkError.result.error_type === errorTypes.invalidAccessApi;
      if (invalidAccess) {
        showLogoutAlert();
        setTokenState(null);
        return;
      }
    }

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
  }

  if (networkError || !!graphQLErrors?.length) {
    requestFailedVar(true);
  }
});

const restLink: RestLink = new RestLink({
  uri: discourseHost,
  // Example if we want custom type response
  typePatcher: typePatchers,

  // this field used to normalize key response from discourse api from snake_case into camelCase
  fieldNameNormalizer: (key) => changeCase.camelCase(key),
  // This field is used to convert keys in the GraphQL body from camelCase to snake_case,
  // matching the expected format for the Discourse API.
  fieldNameDenormalizer: (key) => changeCase.snakeCase(key),

  responseTransformer: async (data, typeName) => {
    // Search response transfer type based on type name
    const transformer = responseTransformers[typeName];
    if (!transformer) {
      const dataJson = await data.json();
      return dataJson;
    }

    return transformer(data, typeName, client);
  },

  /**
   * For file upload implementation based on https://github.com/apollographql/apollo-link-rest/issues/200#issuecomment-509287597
   */
  bodySerializers,
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, restLink]),
  resolvers: {
    Query: {
      privateMessageList: privateMessageListQueryResolver,
    },
    Mutation: {
      likeTopicOrPost: likeTopicOrPostResolver,
      logout: logoutMutationResolver,
      editProfile: editProfileResolver,
      createAndUpdatePostDraft: createAndUpdatePostDraftResolver,
    },
  },
  cache,
});
