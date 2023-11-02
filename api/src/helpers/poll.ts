import { Poll, PollsVotes } from '../types';

/**
 * This helper is used for formatting preloadedVoters data
 * that is returned in a poll, from a key-value object to an array.
 */
export function formatPreloadedVoters(poll: Poll) {
  if (!poll.preloadedVoters) {
    return { ...poll, preloadedVoters: null };
  }
  const pollOptionIds = Object.keys(poll.preloadedVoters);
  const formattedPreloadedVoters = pollOptionIds.map((pollOptionId) => ({
    pollOptionId,
    users: poll.preloadedVoters[pollOptionId],
  }));

  return { ...poll, preloadedVoters: formattedPreloadedVoters };
}

export function formatPolls(
  polls?: Array<Poll> | null,
  pollsVotes?: PollsVotes | null,
) {
  if (!polls) {
    return { formattedPolls: null, formattedPollsVotes: null };
  }

  const formattedPolls = polls.map((poll) => formatPreloadedVoters(poll));
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
