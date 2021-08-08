import { createUploadLink } from 'apollo-upload-client';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { PROSE_ENDPOINT } from '../constants';
import {
  appendPagination,
  getToken,
  prependAppendPagination,
  replaceDataPagination,
  userActivityPagination,
} from '../helpers';

const cache = new InMemoryCache({
  typePolicies: {
    TopicDetailOutput: {
      fields: {
        title: replaceDataPagination(),
        views: replaceDataPagination(),
        likeCount: replaceDataPagination(),
        postsCount: replaceDataPagination(),
        liked: replaceDataPagination(),
        categoryId: replaceDataPagination(),
        tags: replaceDataPagination(),
        createdAt: replaceDataPagination(),
        details: replaceDataPagination(),
      },
    },
    PostStream: {
      fields: {
        posts: prependAppendPagination(),
        stream: replaceDataPagination(),
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
    Query: {
      fields: {
        notification: appendPagination(false, 'NOTIFICATIONS'),
        privateMessage: appendPagination(false, 'MESSAGE_DETAIL'),
        search: appendPagination(false, 'SEARCH'),
        topicDetail: replaceDataPagination(['topicId']),
        topics: appendPagination(['sort', 'categoryId'], 'HOME'),
        userActivity: userActivityPagination(['username']),
      },
    },
  },
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  return {
    headers: {
      ...headers,
      Authorization: token,
    },
  };
});

const uploadLink = createUploadLink({ uri: PROSE_ENDPOINT });

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, uploadLink]),
  cache,
});
