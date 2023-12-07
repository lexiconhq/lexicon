import { Poll, PollsVotes, PreloaderUnion } from '../types';

/**
 * This helper is used for formatting preloadedVoters data
 * that is returned in a poll, from a key-value object to an array.
 */
export function formatPreloadedVoters(preloadedVoters: PreloaderUnion) {
  if (!preloadedVoters) {
    return { preloadedVoters: null };
  }

  const pollOptionIds = Object.keys(preloadedVoters);
  const formattedPreloadedVoters = Array.isArray(preloadedVoters)
    ? [{ pollOptionId: '', users: preloadedVoters }]
    : typeof preloadedVoters === 'object'
    ? pollOptionIds.map((pollOptionId) => ({
        pollOptionId,
        users: preloadedVoters[pollOptionId],
      }))
    : null;

  return { preloadedVoters: formattedPreloadedVoters };
}

export function formatPolls(
  polls?: Array<Poll> | null,
  pollsVotes?: PollsVotes | null,
) {
  if (!polls) {
    return { formattedPolls: null, formattedPollsVotes: null };
  }

  const formattedPolls = polls.map((poll) => {
    return { ...poll, ...formatPreloadedVoters(poll.preloadedVoters) };
  });
  const formattedPollsVotes = formatPollsVotes(pollsVotes);

  return { formattedPolls, formattedPollsVotes };
}

/**
 * This helper is used for formatting pollsVotes data
 * that is returned in a post, from a key-value object to an array.
 */
export function formatPollsVotes(pollsVotes?: PollsVotes | null) {
  if (!pollsVotes) {
    return null;
  }
  const pollNames = Object.keys(pollsVotes);
  const formattedPollVotes = pollNames.map((pollName) => ({
    pollName,
    pollOptionIds: pollsVotes[pollName],
  }));

  return formattedPollVotes;
}
