import { PollType } from '../../generatedAPI/server';
import { PollFormContextValues } from '../../types';
import { generatePollFormFromMarkdown } from '../generatePollFormFromMarkdown';

describe('generatePollFormFromMarkdown', () => {
  it('should generate a poll with default settings for a simple markdown', () => {
    const markdown = `[poll type=regular results=always public=true chartType=bar]
    # Poll with title
    - option 1
    - option 2
    [/poll]
    `;

    const result = generatePollFormFromMarkdown(markdown);
    expect(result).toEqual<PollFormContextValues>({
      minChoice: 0,
      maxChoice: 0,
      step: 1,
      pollOptions: ['option 1', 'option 2'],
      results: 0,
      groups: [],
      closeDate: undefined,
      isPublic: true,
      pollContent: markdown,
      pollChoiceType: PollType.Regular,
      title: 'Poll with title',
      chartType: 0,
    });
  });

  it('should generate a poll with advance settings with type regular', () => {
    const markdown = `[poll type=regular results=on_vote public=true chartType=pie groups=admins,staff,trust_level_0 close=2024-07-03T17:15:00.000Z]
    # Poll with title
    * option 1
    * option 2
    * option 3
    [/poll]
    `;

    const result = generatePollFormFromMarkdown(markdown);
    expect(result).toEqual<PollFormContextValues>({
      minChoice: 0,
      maxChoice: 0,
      step: 1,
      pollOptions: ['option 1', 'option 2', 'option 3'],
      results: 1,
      groups: ['admins', 'staff', 'trust_level_0'],
      closeDate: new Date('2024-07-03T17:15:00.000Z'),
      isPublic: true,
      pollContent: markdown,
      pollChoiceType: PollType.Regular,
      title: 'Poll with title',
      chartType: 1,
    });
  });

  it('should generate a poll with default settings for a simple markdown for type multiple', () => {
    const markdown = `[poll type=multiple results=always min=1 max=2 public=true chartType=bar]
    * options 1
    * options 2
    * options 3
    [/poll]
    `;

    const result = generatePollFormFromMarkdown(markdown);
    expect(result).toEqual<PollFormContextValues>({
      minChoice: 1,
      maxChoice: 2,
      step: 1,
      pollOptions: ['options 1', 'options 2', 'options 3'],
      results: 0,
      groups: [],
      closeDate: undefined,
      isPublic: true,
      pollContent: markdown,
      pollChoiceType: PollType.Multiple,
      title: undefined,
      chartType: 0,
    });
  });

  it('should generate a poll with advance settings for type multiple', () => {
    const markdown = `[poll type=multiple results=on_close min=1 max=2 public=true chartType=pie groups=trust_level_1,Tester close=2024-07-23T18:15:00.000Z]
    # poll with title
    * options 1
    * options 2
    * options 3
    [/poll]
    `;

    const result = generatePollFormFromMarkdown(markdown);
    expect(result).toEqual<PollFormContextValues>({
      minChoice: 1,
      maxChoice: 2,
      step: 1,
      pollOptions: ['options 1', 'options 2', 'options 3'],
      results: 2,
      groups: ['trust_level_1', 'Tester'],
      closeDate: new Date('2024-07-23T18:15:00.000Z'),
      isPublic: true,
      pollContent: markdown,
      pollChoiceType: PollType.Multiple,
      title: 'poll with title',
      chartType: 1,
    });
  });

  it('should generate a poll with default settings for a simple markdown for type number', () => {
    const markdown = `[poll type=number results=always min=1 max=20 step=2 public=true]
    [/poll]
    `;

    const result = generatePollFormFromMarkdown(markdown);
    expect(result).toEqual<PollFormContextValues>({
      minChoice: 1,
      maxChoice: 20,
      step: 2,
      pollOptions: [],
      results: 0,
      groups: [],
      closeDate: undefined,
      isPublic: true,
      pollContent: markdown,
      pollChoiceType: PollType.Number,
    });
  });

  it('should generate a poll with advance settings for type multiple', () => {
    const markdown = `[poll type=number results=on_vote min=1 max=20 step=3 public=true groups=trust_level_4,staff close=2024-07-02T22:30:00.000Z]
    # Poll Number rating
    [/poll]

    `;

    const result = generatePollFormFromMarkdown(markdown);
    expect(result).toEqual<PollFormContextValues>({
      minChoice: 1,
      maxChoice: 20,
      step: 3,
      pollOptions: [],
      results: 1,
      groups: ['trust_level_4', 'staff'],
      closeDate: new Date('2024-07-02T22:30:00.000Z'),
      isPublic: true,
      pollContent: markdown,
      pollChoiceType: PollType.Number,
      title: 'Poll Number rating',
    });
  });
});
