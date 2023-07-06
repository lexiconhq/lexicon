/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert } from 'react-native';
import { FieldPolicy } from '@apollo/client';
import { Reference } from '@apollo/client/utilities';

import { ERROR_PAGINATION } from '../constants';

import { handleDuplicateRef, handleDuplicates } from './handleDuplicates';

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

      /**
       * In this case, the incoming data and existing data format will be [{"__ref": "Post:1135521"}].
       * We want to check if the post id is greater than the incoming postId;
       * if it is, we will append it, and if not, we will prepend it.
       *
       */

      let lastExisting = getLatestApolloId(existing);
      let lastIncoming = getLatestApolloId(incoming);

      return mergeReferenceData({
        existing,
        incoming,
        lastExisting,
        lastIncoming,
      });
    },
  };
}

/**
 * getLatestApolloId
 * This function is created to get the id from the Apollo cache.
 *
 * @param items Argument for a list of Id, where it will take the example format  [{"__ref": "Post:598854"}]
 * @returns It will return a number if the format is correct, and it will return undefined if the format is incorrect.
 */

export function getLatestApolloId<T extends Reference>(
  items: Readonly<Array<T>>,
): number | undefined {
  if (!Array.isArray(items)) {
    return;
  }
  const lastItem = items[items.length - 1];
  if (!lastItem) {
    return;
  }

  const { __ref: ref } = lastItem;
  if (!ref) {
    return;
  }

  const [, itemId] = ref.split(':');
  if (!itemId) {
    return;
  }

  const parsed = Number.parseInt(itemId, 10);
  if (Number.isNaN(parsed)) {
    return;
  }

  return parsed;
}

type MergeReferenceDataParam<T extends Reference> = {
  existing: Array<T>;
  incoming: Array<T>;
  lastExisting?: number;
  lastIncoming?: number;
  mockAlert?: (error: string) => void;
};
export function mergeReferenceData<T extends Reference>({
  existing,
  incoming,
  lastExisting,
  lastIncoming,
  mockAlert,
}: MergeReferenceDataParam<T>) {
  let mergedTopics = [];

  /**
   * In this condition is check is format not PostId:number
   * we want to compare based on string based on the old format checking
   */

  if (!lastExisting || !lastIncoming) {
    if (mockAlert) {
      mockAlert(ERROR_PAGINATION);
    } else {
      Alert.alert(ERROR_PAGINATION);
    }
    return existing;
  } else {
    if (lastExisting < lastIncoming) {
      mergedTopics = handleDuplicates({
        newArray: incoming,
        oldArray: existing,
        newArrayIs: 'appended',
      });
    } else {
      mergedTopics = handleDuplicates({
        newArray: incoming,
        oldArray: existing,
        newArrayIs: 'prepended',
      });
    }
  }

  return mergedTopics;
}
