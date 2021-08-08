export function getTopicTimings(postTimings: Array<number>, topicId: number) {
  let timings: Record<number, number> = {};
  timings = postTimings.reduce((prev, curr) => {
    prev[curr] = 1000;
    return prev;
  }, timings);
  return {
    timings,
    topicId,
    topicTime: 1000,
  };
}
