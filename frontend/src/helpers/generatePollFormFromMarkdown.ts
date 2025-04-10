import { RESULTS_DROPDOWN_OPTIONS } from '../constants';
import { PollType } from '../generatedAPI/server';
import { PollFormContextValues } from '../types';

/**
 * This function converts poll markdown into Poll form data (PollFormContextValues).
 *
 * @param markdown The markdown content of the post.
 * @returns The parsed poll form data (PollFormContextValues).
 */

export function generatePollFormFromMarkdown(
  markdown: string,
): PollFormContextValues {
  const pollObject: PollFormContextValues = {
    minChoice: 0,
    maxChoice: 0,
    step: 1,
    pollOptions: [],
    results: 0,
    groups: [],
    closeDate: undefined,
    isPublic: false,
    pollContent: markdown,
    pollChoiceType: PollType.Regular,
  };

  const pollRegex = /\[poll(.*?)\]/;
  const match = markdown.match(pollRegex);

  if (match) {
    const settings = match[1].trim().split(/\s+/g);
    settings.forEach((setting) => {
      const [key, value] = setting.split('=');
      switch (key) {
        case 'name':
          break;
        case 'type':
          pollObject.pollChoiceType =
            value === 'number'
              ? PollType.Number
              : value === 'multiple'
              ? PollType.Multiple
              : PollType.Regular;
          break;
        case 'results':
          pollObject.results = RESULTS_DROPDOWN_OPTIONS.findIndex(
            (option) => value === option.value,
          );
          break;
        case 'min':
          pollObject.minChoice = parseInt(value, 10);
          break;
        case 'max':
          pollObject.maxChoice = parseInt(value, 10);
          break;
        case 'step':
          pollObject.step = parseInt(value, 10);
          break;
        case 'chartType':
          pollObject.chartType = value === 'pie' ? 1 : 0;
          break;
        case 'public':
          pollObject.isPublic = value === 'true';
          break;
        case 'groups':
          pollObject.groups = value.split(',');
          break;
        case 'close':
          pollObject.closeDate = new Date(value);
          break;
      }
    });
  }

  const titleMatch = markdown.match(/# (.+)\n/);
  if (titleMatch) {
    pollObject.title = titleMatch[1];
  }

  const optionsMatch = markdown.match(/[-*] (.+)/g);
  if (optionsMatch) {
    pollObject.pollOptions = optionsMatch.map((option) => option.slice(2));
  }

  return pollObject;
}
