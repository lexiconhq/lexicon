import { Poll, PollsVotes, PreloaderUnion } from '../../../types/api';
import {
  extractPollOptionIds,
  formatPollOptionId,
  formatPolls,
  formatPollsVotes,
  formatPreloadedVoters,
} from '../poll';

const polls: Array<Poll> = [
  {
    name: 'poll1',
    type: 'regular',
    status: 'open',
    public: true,
    results: 'always',
    options: [
      { id: '1', html: 'Option 1', votes: 0 },
      { id: '2', html: 'Option 2', votes: 1 },
    ],
    voters: 1,
    preloadedVoters: [
      {
        id: 1,
        username: 'user1',
        name: 'User One',
        avatarTemplate: 'avatar1',
        title: null,
      },
    ],
    chartType: 'bar',
  },
  {
    name: 'poll2',
    type: 'multiple',
    status: 'closed',
    public: false,
    results: 'on_vote',
    options: [
      { id: '1', html: 'Option A', votes: 0 },
      { id: '2', html: 'Option B', votes: 1 },
      { id: '3', html: 'Option C', votes: 0 },
    ],
    voters: 1,
    preloadedVoters: [
      {
        id: 2,
        username: 'user2',
        name: 'User Two',
        avatarTemplate: 'avatar2',
        title: 'Title',
      },
    ],
    chartType: 'pie',
  },
];
const postId = 10;

describe('formatPreloadedVoters', () => {
  test('should format preloadedVoters data correctly when input is an object', () => {
    const preloadedVoters: PreloaderUnion = {
      '1': [
        {
          id: 1,
          username: 'user1',
          name: 'User One',
          avatarTemplate: 'avatar1',
          title: null,
        },
      ],
      '2': [
        {
          id: 2,
          username: 'user2',
          name: 'User Two',
          avatarTemplate: 'avatar2',
          title: 'Title',
        },
      ],
    };

    const pollName = 'poll1';
    const expectedOutput = {
      preloadedVoters: [
        {
          pollOptionId: `${postId}:${pollName}:1`,
          users: preloadedVoters['1'],
        },
        {
          pollOptionId: `${postId}:${pollName}:2`,
          users: preloadedVoters['2'],
        },
      ],
    };

    expect(formatPreloadedVoters(postId, pollName, preloadedVoters)).toEqual(
      expectedOutput,
    );
  });

  test('should format preloadedVoters data correctly when input is an array', () => {
    const preloadedVoters: PreloaderUnion = [
      {
        id: 1,
        username: 'user1',
        name: 'User One',
        avatarTemplate: 'avatar1',
        title: null,
      },
      {
        id: 2,
        username: 'user2',
        name: 'User Two',
        avatarTemplate: 'avatar2',
        title: 'Title',
      },
    ];

    const expectedOutput = {
      preloadedVoters: [{ pollOptionId: '', users: preloadedVoters }],
    };

    expect(formatPreloadedVoters(postId, 'poll1', preloadedVoters)).toEqual(
      expectedOutput,
    );
  });
});

describe('formatPollsVotes', () => {
  it('should return null when input is null and undefined', () => {
    expect(formatPollsVotes(postId, null)).toBeNull();
    expect(formatPollsVotes(postId, undefined)).toBeNull();
  });

  it('should return empty array when input is an empty object', () => {
    expect(formatPollsVotes(postId, {})).toEqual([]);
  });

  it('should format pollsVotes data correctly', () => {
    const pollsVotes = {
      poll1: ['option1', 'option2'],
      poll2: ['option3', 'option4'],
    };
    const expectedFormattedPollsVotes = [
      {
        pollName: 'poll1',
        pollOptionIds: [`${postId}:poll1:option1`, `${postId}:poll1:option2`],
      },
      {
        pollName: 'poll2',
        pollOptionIds: [`${postId}:poll2:option3`, `${postId}:poll2:option4`],
      },
    ];
    expect(formatPollsVotes(postId, pollsVotes)).toEqual(
      expectedFormattedPollsVotes,
    );
  });
});

describe('formatPolls', () => {
  test('should return null for formattedPolls and formattedPollsVotes if polls parameter is null or undefined', () => {
    expect(formatPolls(postId, null)).toEqual({
      formattedPolls: null,
      formattedPollsVotes: null,
    });
    expect(formatPolls(postId, undefined)).toEqual({
      formattedPolls: null,
      formattedPollsVotes: null,
    });
  });

  test('should format polls data correctly when pollsVotes parameter is null', () => {
    const expectedFormattedPolls = polls.map((poll) => ({
      ...poll,
      options: poll.options.map((option) => ({
        ...option,
        id: `${postId}:${poll.name}:${option.id}`,
      })),
      preloadedVoters: [{ pollOptionId: '', users: poll.preloadedVoters }],
    }));
    const expectedOutput = {
      formattedPolls: expectedFormattedPolls,
      formattedPollsVotes: null,
    };

    expect(formatPolls(postId, polls)).toEqual(expectedOutput);
  });

  test('should format polls data correctly when pollsVotes parameter is provided', () => {
    const pollsVotes: PollsVotes = {
      poll1: ['1', '2'],
      poll2: ['1', '2', '3'],
    };

    const expectedFormattedPolls = polls.map((poll) => ({
      ...poll,
      options: poll.options.map((option) => ({
        ...option,
        id: `${postId}:${poll.name}:${option.id}`,
      })),
      preloadedVoters: [{ pollOptionId: '', users: poll.preloadedVoters }],
    }));
    const expectedOutput = {
      formattedPolls: expectedFormattedPolls,
      formattedPollsVotes: [
        {
          pollName: 'poll1',
          pollOptionIds: [`${postId}:poll1:1`, `${postId}:poll1:2`],
        },
        {
          pollName: 'poll2',
          pollOptionIds: [
            `${postId}:poll2:1`,
            `${postId}:poll2:2`,
            `${postId}:poll2:3`,
          ],
        },
      ],
    };

    expect(formatPolls(postId, polls, pollsVotes)).toEqual(expectedOutput);
  });
});

describe('poll option ids', () => {
  const poll = polls[0];
  const pollName = poll.name;
  const pollOptionId = poll.options[0].id;

  test('should return formatted poll option ID', () => {
    expect(formatPollOptionId(postId, pollName, pollOptionId)).toEqual(
      `${postId}:${pollName}:${pollOptionId}`,
    );
  });

  test('should extract poll option ID from the formatted version', () => {
    expect(
      extractPollOptionIds([`${postId}:${pollName}:${pollOptionId}`]),
    ).toEqual([pollOptionId]);
  });
});
