import { PollType } from '../generatedAPI/server';
import { PollFormContextValues } from '../types';

import { generatePollFormFromMarkdown } from './generatePollFormFromMarkdown';
import { changeListNumberOption, getListNumberStep } from './listNumberStep';

export function convertPollMarkdown(pollMarkdown: Array<string>) {
  let polls: Array<PollFormContextValues> =
    pollMarkdown.map((poll) => {
      const pollForm = generatePollFormFromMarkdown(poll);
      return {
        title: pollForm.title,
        minChoice: pollForm.minChoice,
        maxChoice: pollForm.maxChoice,
        step: pollForm.step,
        pollOptions:
          pollForm.pollChoiceType === PollType.Number
            ? changeListNumberOption(
                getListNumberStep({
                  min: pollForm.minChoice,
                  max: pollForm.maxChoice,
                  step: pollForm.step,
                }),
              )
            : pollForm.pollOptions,
        results: pollForm.results,
        chartType: pollForm.chartType,
        groups: pollForm.groups,
        closeDate: pollForm.closeDate,
        isPublic: pollForm.isPublic,
        pollChoiceType: pollForm.pollChoiceType,
        pollContent: poll,
      };
    }) || [];

  return polls;
}
