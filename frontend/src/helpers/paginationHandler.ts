/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldPolicy } from '@apollo/client';
import { Reference } from '@apollo/client/utilities';

import { handleDuplicateRef } from './handleDuplicates';

type KeyArgs = FieldPolicy<unknown>['keyArgs'];

/**
 * This ApolloRefObject is the type of data coming to this function
 * when we define custom keyFields in the typePolicies
 */
type ApolloRefObject = { __ref: string };

export function userActivityPagination(
  keyArgs: KeyArgs = false,
): FieldPolicy<Array<ApolloRefObject>> {
  return {
    keyArgs,
    merge(existing, incoming, { args }) {
      let merged: Array<ApolloRefObject> = existing ? existing.slice(0) : [];

      if (args) {
        const { offset = 0 } = args;
        for (let i = 0; i < incoming.length; i++) {
          merged[offset + i] = incoming[i];
        }
      } else {
        merged = [...merged, ...incoming];
      }

      const filteredArr = merged.reduce(
        (acc: Array<ApolloRefObject>, current) => {
          const duplicateValue = acc.find(
            // eslint-disable-next-line no-underscore-dangle
            (item) => item.__ref === current.__ref,
          );
          if (!duplicateValue) {
            return acc.concat([current]);
          }
          return acc;
        },
        [],
      );

      return filteredArr;
    },
  };
}

export function replaceDataPagination<T = Reference>(
  keyArgs: KeyArgs = [],
): FieldPolicy<Array<T>> {
  return {
    keyArgs,
    merge: (existing: any, incoming: any) => incoming || existing || null,
  };
}

export function appendPagination<T = Reference>(
  keyArgs: KeyArgs = [],
  screen: 'HOME' | 'SEARCH' | 'MESSAGE_DETAIL' | 'NOTIFICATIONS',
): FieldPolicy<Array<T>> {
  return {
    keyArgs,
    merge: (existing: any, incoming: any, { args }) => {
      if (!existing || !incoming) {
        return existing || incoming || null;
      }

      let page;

      switch (screen) {
        case 'HOME':
          page = args?.page || 0;
          incoming.users = handleDuplicateRef(existing.users, incoming.users);
          if (page > 0) {
            incoming.topicList.topics = handleDuplicateRef(
              existing.topicList.topics,
              incoming.topicList.topics,
            );
          } else {
            incoming.topicList.topics = handleDuplicateRef(
              incoming.topicList.topics,
              existing.topicList.topics,
            );
          }

          break;
        case 'SEARCH':
          page = args?.page || 1;
          if (page > 1) {
            incoming.posts = handleDuplicateRef(existing.posts, incoming.posts);
            incoming.topics = handleDuplicateRef(
              existing.topics,
              incoming.topics,
            );
          }
          break;
        case 'MESSAGE_DETAIL':
          page = args?.page || 0;
          if (page >= 0) {
            incoming.topicList.topics = handleDuplicateRef(
              incoming.topicList.topics,
              existing.topicList.topics,
            );
            incoming.users = handleDuplicateRef(incoming.users, existing.users);
          }
          break;
        case 'NOTIFICATIONS':
          incoming.notifications = handleDuplicateRef(
            existing.notifications,
            incoming.notifications,
          );
          break;
      }

      return incoming;
    },
  };
}

export function prependAppendPagination<T = Reference>(
  keyArgs: KeyArgs = [],
): FieldPolicy<Array<T>> {
  return {
    keyArgs,
    merge: (existing: any, incoming: any) => {
      if (
        !existing ||
        !incoming ||
        existing.length === 0 ||
        incoming.length === 0
      ) {
        return incoming || existing || null;
      }

      if (
        JSON.stringify(existing[existing.length - 1]) <
        JSON.stringify(incoming[incoming.length - 1])
      ) {
        return handleDuplicateRef(existing, incoming);
      } else {
        // Prepending data will trigger data reindexing.
        // There's an issue with data reindexing inside a FlatList,
        // because the cursor position is not "held" at the current post.
        return handleDuplicateRef(incoming, existing);
      }
    },
  };
}
