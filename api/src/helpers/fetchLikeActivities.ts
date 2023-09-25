import camelcaseKeys from 'camelcase-keys';
import { AxiosInstance } from 'axios';

import { UserAction } from '../types';

type Params = {
  username: string;
  client: AxiosInstance;
};

export const USER_ACTIONS_URL = '/user_actions.json';
const LIKE_POST_FILTER = '1';
const PAGE_SIZE = 30;

export async function fetchLikeActivities(params: Params) {
  const { username, client } = params;

  let hasMore = true;
  let userActions: Array<UserAction> = [];
  let currentOffset = 0;

  while (hasMore) {
    const fetchConfig = {
      params: {
        username,
        filter: LIKE_POST_FILTER,
        offset: currentOffset,
      },
    };
    const { data: userActivityResult } = await client.get(
      USER_ACTIONS_URL,
      fetchConfig,
    );
    const currentUserActions = userActivityResult.user_actions;
    currentOffset += PAGE_SIZE;
    userActions = [...userActions, ...currentUserActions];
    if (currentUserActions.length < PAGE_SIZE) {
      hasMore = false;
    }
  }
  return camelcaseKeys(userActions, { deep: true });
}
