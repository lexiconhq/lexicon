import { RestLink } from 'apollo-link-rest';

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

export function topicsDetailPathBuilder({ args }: RestLink.PathBuilderProps) {
  const { topicId, postIds, postNumber } = args;
  if (!topicId) {
    return '';
  }

  let postPath = getTopicPostPath(postIds ?? postNumber ?? undefined);

  const queryParams = new URLSearchParams();

  if (Array.isArray(postIds) && postIds.length > 0) {
    postIds.forEach((id) => queryParams.append('post_ids[]', id.toString()));
  }
  queryParams.append('include_raw', 'true');
  queryParams.append('track_visit', 'true');

  return `/t/${topicId}${postPath}.json?${queryParams.toString()}`;
}
