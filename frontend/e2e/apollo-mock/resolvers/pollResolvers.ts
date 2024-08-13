import { PollStatus } from '../../../src/generated/server';
import { mockPostWithPoll, mockUsers } from '../data';

export const pollResolvers = {
  Mutation: {
    votePoll: (
      _: unknown,
      {
        options,
      }: {
        postId: number;
        pollName: string;
        options: Array<string>;
      },
    ) => {
      const polls = mockPostWithPoll.polls || [];
      const poll = polls[0];
      const newOptions = poll.options.map((option) => {
        if (option.id === options[0]) {
          return {
            ...option,
            votes: option.votes + 1,
          };
        }
        return option;
      });

      return {
        poll: {
          ...poll,
          options: newOptions,
          preloadedVoters: [
            {
              pollOptionId: options[0],
              users: [mockUsers[0]],
            },
          ],
          voters: poll.voters + 1,
        },
        vote: options,
      };
    },
    undoVotePoll: (_: unknown) => {
      const polls = mockPostWithPoll.polls || [];
      const poll = polls[0];
      const newOptions = poll.options.map((option) => {
        return {
          ...option,
          votes: 0,
        };
      });

      return {
        ...poll,
        options: newOptions,
        preloadedVoters: [],
      };
    },
    togglePollStatus: (
      _: unknown,
      {
        status,
      }: {
        postId: number;
        pollName: string;
        status: PollStatus;
      },
    ) => {
      const polls = mockPostWithPoll.polls || [];

      return {
        ...polls[0],
        status,
      };
    },
  },
};
