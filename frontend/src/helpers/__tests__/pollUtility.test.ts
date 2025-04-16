import { PollType } from '../../generatedAPI/server';
import { PollFormContextValues } from '../../types';
import {
  combineContentWithPollContent,
  deletePoll,
  getPollChoiceLabel,
  isMultipleVoters,
} from '../pollUtility';

describe('Test Poll Utility function', () => {
  it('should generate label for Poll', () => {
    const title = 'Poll hello';
    const pollChoice = PollType.Regular;
    const title2 = 'best choice';
    const pollChoice2 = PollType.Number;
    expect(getPollChoiceLabel({ title, pollType: pollChoice })).toEqual(
      'Poll Hello',
    );
    expect(getPollChoiceLabel({ pollType: pollChoice })).toEqual(
      'Single Choice',
    );
    expect(getPollChoiceLabel({ title: title2, pollType: pollChoice })).toEqual(
      'Best Choice',
    );
    expect(getPollChoiceLabel({ pollType: pollChoice2 })).toEqual(
      'Number Rating',
    );
    expect(getPollChoiceLabel({ pollType: 'None' as PollType })).toBe('');
  });

  it('should combine content with poll content', () => {
    const content = 'just content in here';
    const polls: Array<PollFormContextValues> = [
      {
        title: 'Sample Poll 1',
        minChoice: 1,
        maxChoice: 2,
        step: 1,
        pollOptions: [{ option: 'Option 1' }, { option: 'Option 2' }],
        results: 0,
        chartType: 1,
        groups: ['Group A'],
        closeDate: undefined,
        isPublic: true,
        pollChoiceType: PollType.Multiple,
        pollContent:
          '[poll type=regular results=always chartType=bar]\n* 2\n* 3\n[/poll]',
      },
    ];
    const polls2: Array<PollFormContextValues> = [
      {
        title: 'Sample Poll 1',
        minChoice: 1,
        maxChoice: 2,
        step: 1,
        pollOptions: [{ option: 'Option 1' }, { option: 'Option 2' }],
        results: 0,
        chartType: 1,
        groups: ['Group A'],
        closeDate: undefined,
        isPublic: true,
        pollChoiceType: PollType.Multiple,
        pollContent:
          '[poll type=regular results=always chartType=bar]\n* 2\n* 3\n[/poll]',
      },
      {
        title: 'Sample Poll 2',
        minChoice: 1,
        maxChoice: 2,
        step: 1,
        pollOptions: [{ option: 'Option 1' }, { option: 'Option 2' }],
        results: 0,
        chartType: 1,
        groups: ['Group A'],
        closeDate: undefined,
        isPublic: true,
        pollChoiceType: PollType.Multiple,
        pollContent:
          '[poll type=multiple results=always chartType=pie]\n* 5\n* 6\n[/poll]',
      },
    ];
    const pollWithoutPollContent = [
      {
        title: 'Sample Poll 2',
        minChoice: 1,
        maxChoice: 2,
        step: 1,
        pollOptions: [{ option: 'Option 1' }, { option: 'Option 2' }],
        results: 0,
        chartType: 1,
        groups: ['Group A'],
        closeDate: undefined,
        isPublic: true,
        pollChoiceType: PollType.Multiple,
        pollContent: '',
      },
    ];
    expect(combineContentWithPollContent({ content, polls })).toEqual(
      '[poll type=regular results=always chartType=bar]\n* 2\n* 3\n[/poll]\njust content in here',
    );

    expect(combineContentWithPollContent({ content, polls: polls2 })).toEqual(
      '[poll type=regular results=always chartType=bar]\n* 2\n* 3\n[/poll]\n[poll type=multiple results=always chartType=pie]\n* 5\n* 6\n[/poll]\njust content in here',
    );

    expect(combineContentWithPollContent({ content, polls: [] })).toEqual(
      content,
    );
    expect(
      combineContentWithPollContent({ content, polls: pollWithoutPollContent }),
    ).toBe(content);
  });
});

describe('deletePoll', () => {
  it('should remove the poll at the specified index', () => {
    const polls = [
      {
        title: 'Sample Poll 1',
        minChoice: 1,
        maxChoice: 2,
        step: 1,
        pollOptions: [{ option: 'Option 1' }, { option: 'Option 2' }],
        results: 0,
        chartType: 1,
        groups: ['Group A'],
        closeDate: undefined,
        isPublic: true,
        pollChoiceType: PollType.Multiple,
        pollContent:
          '[poll type=regular results=always chartType=bar]\n* 2\n* 3\n[/poll]',
      },
      {
        title: 'Sample Poll 2',
        minChoice: 1,
        maxChoice: 2,
        step: 1,
        pollOptions: [{ option: 'Option 1' }, { option: 'Option 2' }],
        results: 0,
        chartType: 1,
        groups: ['Group A'],
        closeDate: undefined,
        isPublic: true,
        pollChoiceType: PollType.Multiple,
        pollContent:
          '[poll type=multiple results=always chartType=pie]\n* 5\n* 6\n[/poll]',
      },
    ];

    const setValue = jest.fn();

    deletePoll({ polls, setValue, index: 1 });

    const expectedPolls = [polls[0]];
    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenCalledWith('polls', expectedPolls);
  });

  it('should check is multiple voter', () => {
    expect(isMultipleVoters(3)).toBeTruthy();
    expect(isMultipleVoters(-10)).toBeTruthy();
    expect(isMultipleVoters(-2)).toBeTruthy();

    expect(isMultipleVoters(1)).toBeFalsy();
    expect(isMultipleVoters(-1)).toBeFalsy();
    expect(isMultipleVoters(0)).toBeFalsy();
  });
});
