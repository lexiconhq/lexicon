/* eslint-disable no-underscore-dangle */
import { Alert } from 'react-native';
import { FieldPolicy } from '@apollo/client';
import { Reference } from '@apollo/client/utilities';
import { SafeReadonly } from '@apollo/client/cache/core/types/common';

import { ERROR_PAGINATION } from '../constants';
import { MessageDetail, SearchPost, Notifications } from '../types';

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
    merge: (
      existing: Readonly<Array<T>> | undefined,
      incoming: Readonly<Array<T>>,
    ) => incoming || existing || null,
  };
}

export function appendPagination<T extends Reference>(
  keyArgs: KeyArgs = [],
  screen: 'HOME' | 'SEARCH' | 'MESSAGE_DETAIL' | 'NOTIFICATIONS',
): FieldPolicy<T> {
  return {
    keyArgs,
    merge: (
      existing: SafeReadonly<T> | undefined,
      incoming: SafeReadonly<T>,
      { args },
    ) => {
      if (!existing || !incoming) {
        return existing || incoming || null;
      }

      let page;

      switch (screen) {
        case 'SEARCH':
          page = args?.page || 1;

          if (page > 1 && existing) {
            const parsedExisting = SearchPost.safeParse(existing);
            const parsedIncoming = SearchPost.safeParse(incoming);

            if (parsedExisting.success && parsedIncoming.success) {
              incoming = {
                ...incoming,
                posts: handleDuplicateRef(
                  parsedExisting.data.posts,
                  parsedIncoming.data.posts,
                ),
                topics: handleDuplicateRef(
                  parsedExisting.data.topics,
                  parsedIncoming.data.topics,
                ),
              };
            }
          }

          break;
        case 'MESSAGE_DETAIL':
          page = args?.page || 0;
          if (page >= 0 && existing) {
            const parsedExisting = MessageDetail.safeParse(existing);
            const parsedIncoming = MessageDetail.safeParse(incoming);

            if (parsedExisting.success && parsedIncoming.success) {
              incoming = {
                ...incoming,
                users: handleDuplicateRef(
                  parsedIncoming.data.users,
                  parsedExisting.data.users,
                ),
                topicList: {
                  ...parsedIncoming.data.topicList,
                  topics: handleDuplicateRef(
                    parsedExisting.data.topicList.topics,
                    parsedIncoming.data.topicList.topics,
                  ),
                },
              };
            }
          }
          break;
        case 'NOTIFICATIONS':
          if (existing) {
            const parsedExisting = Notifications.safeParse(existing);
            const parsedIncoming = Notifications.safeParse(incoming);

            if (parsedExisting.success && parsedIncoming.success) {
              let newData = handleDuplicateRef(
                parsedExisting.data.notifications,
                parsedIncoming.data.notifications,
              );
              incoming = { ...incoming, notifications: newData };
            }
          }
          break;
      }

      return incoming;
    },
  };
}

export function prependAppendPagination<T extends Reference>(
  keyArgs: KeyArgs = [],
): FieldPolicy<Array<T>> {
  return {
    keyArgs,
    merge: (
      existing: Readonly<Array<T>> | undefined,
      incoming: Readonly<Array<T>>,
    ) => {
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

export function getLatestApolloId<T>(
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
  existing: Readonly<Array<T>>;
  incoming: Readonly<Array<T>>;
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
  let mergedTopics: Readonly<Array<T>> = [];

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
