import { PollType } from '../../generatedAPI/server';
import { convertPollMarkdown } from '../convertPollMarkdown';

describe('convertPollMarkdown', () => {
  it('should convert poll markdown into type array of PollFormContextValues', () => {
    const markdown = `[poll type=regular results=always public=true chartType=bar]
    # Poll with title
    - option 1
    - option 2
    [/poll]
    `;

    const markdownNumber = `[poll type=number results=always min=1 max=20 step=2 public=true]
    [/poll]
    `;

    let result = [
      {
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
      },
    ];

    let result2 = [
      {
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
      },
      {
        minChoice: 1,
        maxChoice: 20,
        step: 2,
        pollOptions: [
          { option: '1' },
          { option: '3' },
          { option: '5' },
          { option: '7' },
          { option: '9' },
          { option: '11' },
          { option: '13' },
          { option: '15' },
          { option: '17' },
          { option: '19' },
        ],
        results: 0,
        groups: [],
        closeDate: undefined,
        isPublic: true,
        pollContent: markdownNumber,
        pollChoiceType: PollType.Number,
      },
    ];

    let pollForm = convertPollMarkdown([markdown]);
    let multiplePollForm = convertPollMarkdown([markdown, markdownNumber]);
    expect(pollForm).toEqual(result);
    expect(multiplePollForm.length).toBe(2);
    expect(multiplePollForm).toEqual(result2);
  });
  it('should return empty array', () => {
    expect(convertPollMarkdown([])).toEqual([]);
  });
});
