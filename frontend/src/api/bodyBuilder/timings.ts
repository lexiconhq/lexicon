import { RestLink } from 'apollo-link-rest';

function getTopicTimings(postTimings: Array<number>, topicId: number) {
  let timings: Record<number, number> = {};
  timings = postTimings.reduce((prev, curr) => {
    prev[curr] = 1000;
    return prev;
  }, timings);
  return {
    timings,
    topic_id: topicId,
    topic_time: 1000,
  };
}

export function timingsBodyBuilder({ args }: RestLink.RestLinkHelperProps) {
  const { postNumbers, topicId } = args;

  return getTopicTimings(postNumbers, topicId);
}
