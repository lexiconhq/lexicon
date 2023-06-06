import { AxiosInstance } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { intArg, list, nullable } from 'nexus';

import { ACCEPTED_LANGUAGE } from '../constants';

type FetchTopicDetailParams = {
  client: AxiosInstance;
  postIds?: Array<number> | null;
  postNumber?: number | null;
  topicId: number;
};

type TopicDetailOptionalArgs = {
  postIds?: Array<number> | null;
  postNumber?: number | null;
  includeFirstPost?: boolean | null;
};

export function getTopicPostPath(postIdsOrPostNumber?: number | Array<number>) {
  if (!postIdsOrPostNumber) {
    return '';
  }

  if (Array.isArray(postIdsOrPostNumber)) {
    return '/posts';
  }

  const postNumber = postIdsOrPostNumber;
  return `/${postNumber}`;
}

export async function fetchTopicDetail(params: FetchTopicDetailParams) {
  const { client, postIds, postNumber, topicId } = params;

  const config = {
    headers: { 'Accept-Language': ACCEPTED_LANGUAGE },
    params: { post_ids: postIds, include_raw: true, track_visit: true },
  };

  let postPath = getTopicPostPath(postIds ?? postNumber ?? undefined);
  let url = `/t/${topicId}${postPath}.json`;
  let { data } = await client.get(url, config);

  return camelcaseKeys(data, { deep: true });
}

export function getTopicDetailBaseArgs() {
  return {
    postIds: nullable(list(intArg())),
    topicId: intArg(),
    postNumber: nullable(intArg()),
  };
}

export function validateTopicDetailOptionalArgs(
  params: TopicDetailOptionalArgs,
) {
  const { postIds, postNumber, includeFirstPost } = params;
  if (postIds && postNumber) {
    throw new Error(
      'Please provide either only the post IDs or the post number',
    );
  }

  if (postIds && includeFirstPost) {
    throw new Error(
      'The first post cannot be included when post IDs are provided',
    );
  }
}
