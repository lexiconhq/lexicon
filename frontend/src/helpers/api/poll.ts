// NOTE: Formatting poll option ID to prevent duplicate ID of the same poll option
// in different poll in the same topic. We append the poll option ID with post ID

import { Poll, PollsVotes, PreloaderUnion } from '../../types/api';

export function extractPollOptionIds(pollOptionIds: Array<string>) {
  return pollOptionIds.map(
    (pollOptionId) => pollOptionId.split(':').pop() ?? '',
  );
}

// and poll name to create a unique ID. The format is [postID]:[pollName]:[pollOptionID].
export function formatPollOptionId(
  postId: number,
  pollName: string,
  optionId: string,
) {
  return `${postId}:${pollName}:${optionId.toLowerCase()}`;
}

/**
 * This helper is used for formatting preloadedVoters data
 * that is returned in a poll, from a key-value object to an array.
 */
export function formatPreloadedVoters(
  postId: number,
  pollName: string,
  preloadedVoters: PreloaderUnion,
) {
  if (!preloadedVoters) {
    return { preloadedVoters: null };
  }

  const pollOptionIds = Object.keys(preloadedVoters);
  const formattedPreloadedVoters = Array.isArray(preloadedVoters)
    ? [{ pollOptionId: '', users: preloadedVoters }]
    : typeof preloadedVoters === 'object'
    ? pollOptionIds.map((pollOptionId) => {
        return {
          pollOptionId: formatPollOptionId(postId, pollName, pollOptionId),
          users: preloadedVoters[pollOptionId],
        };
      })
    : null;

  return { preloadedVoters: formattedPreloadedVoters };
}

export function formatPolls(
  postId: number,
  polls?: Array<Poll> | null,
  pollsVotes?: PollsVotes | null,
) {
  if (!polls) {
    return { formattedPolls: null, formattedPollsVotes: null };
  }

  const formattedPolls = polls.map((poll) => {
    const formattedPollOptions = poll.options.map((option) => {
      return {
        ...option,
        id: formatPollOptionId(postId, poll.name, option.id),
      };
    });
    return {
      ...poll,
      ...formatPreloadedVoters(postId, poll.name, poll.preloadedVoters),
      options: formattedPollOptions,
    };
  });
  const formattedPollsVotes = formatPollsVotes(postId, pollsVotes);

  return { formattedPolls, formattedPollsVotes };
}

/**
 * This helper is used for formatting pollsVotes data
 * that is returned in a post, from a key-value object to an array.
 */
export function formatPollsVotes(
  postId: number,
  pollsVotes?: PollsVotes | null,
) {
  if (!pollsVotes) {
    return null;
  }
  const pollNames = Object.keys(pollsVotes);
  const formattedPollVotes = pollNames
    .map((pollName) => {
      // handle if data poll votes is undefined where we do not want to process
      if (pollsVotes[pollName]) {
        const formattedPollOptions = pollsVotes[pollName].map((option) =>
          formatPollOptionId(postId, pollName, option),
        );
        return {
          pollName,
          pollOptionIds: formattedPollOptions,
        };
      }
      return undefined;
    })
    .filter((item) => item !== undefined);

  return formattedPollVotes;
}
