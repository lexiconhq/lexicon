import { Poll, PollsVotes, PreloaderUnion } from '../../types';
import { formatPolls, formatPollsVotes, formatPreloadedVoters } from '..';

const polls: Array<Poll> = [
  {
    name: 'Poll 1',
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
    name: 'Poll 2',
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

    const expectedOutput = {
      preloadedVoters: [
        { pollOptionId: '1', users: preloadedVoters['1'] },
        { pollOptionId: '2', users: preloadedVoters['2'] },
      ],
    };

    expect(formatPreloadedVoters(preloadedVoters)).toEqual(expectedOutput);
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

    expect(formatPreloadedVoters(preloadedVoters)).toEqual(expectedOutput);
  });
});

describe('formatPollsVotes', () => {
  it('should return null when input is null and undefined', () => {
    expect(formatPollsVotes(null)).toBeNull();
    expect(formatPollsVotes(undefined)).toBeNull();
  });

  it('should return empty array when input is an empty object', () => {
    expect(formatPollsVotes({})).toEqual([]);
  });

  it('should format pollsVotes data correctly', () => {
    const pollsVotes = {
      poll1: ['option1', 'option2'],
      poll2: ['option3', 'option4'],
    };
    const expectedFormattedPollsVotes = [
      { pollName: 'poll1', pollOptionIds: ['option1', 'option2'] },
      { pollName: 'poll2', pollOptionIds: ['option3', 'option4'] },
    ];
    expect(formatPollsVotes(pollsVotes)).toEqual(expectedFormattedPollsVotes);
  });
});

describe('formatPolls', () => {
  test('should return null for formattedPolls and formattedPollsVotes if polls parameter is null or undefined', () => {
    expect(formatPolls(null)).toEqual({
      formattedPolls: null,
      formattedPollsVotes: null,
    });
    expect(formatPolls(undefined)).toEqual({
      formattedPolls: null,
      formattedPollsVotes: null,
    });
  });

  test('should format polls data correctly when pollsVotes parameter is null', () => {
    const expectedFormattedPolls = polls.map((poll) => ({
      ...poll,
      preloadedVoters: [{ pollOptionId: '', users: poll.preloadedVoters }],
    }));
    const expectedOutput = {
      formattedPolls: expectedFormattedPolls,
      formattedPollsVotes: null,
    };

    expect(formatPolls(polls)).toEqual(expectedOutput);
  });

  test('should format polls data correctly when pollsVotes parameter is provided', () => {
    const pollsVotes: PollsVotes = {
      'Poll 1': ['1', '2'],
      'Poll 2': ['1', '2', '3'],
    };

    const expectedFormattedPolls = polls.map((poll) => ({
      ...poll,
      preloadedVoters: [{ pollOptionId: '', users: poll.preloadedVoters }],
    }));
    const expectedOutput = {
      formattedPolls: expectedFormattedPolls,
      formattedPollsVotes: [
        { pollName: 'Poll 1', pollOptionIds: ['1', '2'] },
        {
          pollName: 'Poll 2',
          pollOptionIds: ['1', '2', '3'],
        },
      ],
    };

    expect(formatPolls(polls, pollsVotes)).toEqual(expectedOutput);
  });
});
