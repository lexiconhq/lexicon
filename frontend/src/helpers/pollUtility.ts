import { UseFormSetValue } from 'react-hook-form';

import { POLL_CHOICE_TYPES } from '../constants';
import { PollType } from '../generatedAPI/server';
import { NewPostForm, PollFormContextValues } from '../types';

import { capitalizeAllWords } from './capitalizeFirstLetter';

/**
 * Get the label for a Poll based on the provided title and poll type.
 *
 * @param {string | undefined} title - The title of the poll.
 * @param {PollType} pollType - The type of poll, can be single, multiple, or number.
 *
 * @returns {string} - The label for the Poll.
 */

export function getPollChoiceLabel({
  title,
  pollType,
}: {
  title?: string;
  pollType: PollType;
}) {
  if (title) {
    return capitalizeAllWords(title);
  }

  return capitalizeAllWords(
    POLL_CHOICE_TYPES.find(({ value }) => value === pollType)?.label || '',
  );
}

/**
 * Combines the original content with the content of polls.
 *
 * @param {string} content - The original content.
 * @param {Array<PollFormContextValues>} polls - An array of polls with content.
 * @returns {string} - The updated content, combining the original content and poll content.
 */

export function combineContentWithPollContent({
  content,
  polls,
}: {
  content: string;
  polls: Array<PollFormContextValues>;
}) {
  let updatedContentWithPoll = content;

  /**
   * This condition is used to generate new content if there is a poll. If the user adds a poll, we want to generate the poll as the initial content.
   */

  if (polls?.length > 0) {
    updatedContentWithPoll = polls.reduceRight((accumulator, poll) => {
      const { pollContent } = poll;
      return pollContent ? `${pollContent}\n${accumulator}` : accumulator;
    }, updatedContentWithPoll);
  }

  return updatedContentWithPoll;
}

type DeletePollParams = {
  polls: Array<PollFormContextValues>;
  setValue: UseFormSetValue<NewPostForm>;
  index: number;
};

/**
 * Deletes a poll from the polls array at the specified index.
 *
 * @param {DeletePollParams} params The parameters required for deleting a poll which contain:
 *                                    - {Array<PollFormContextValues>} polls: The array of polls.
 *                                    - {UseFormSetValue<NewPostForm>} setValue: The function to set the form value from react-hook-form.
 *                                    - {number} index: The index of the poll to delete.
 *
 * @returns {void}
 */

export function deletePoll({ polls, setValue, index }: DeletePollParams) {
  const updatedPolls = [...polls.slice(0, index), ...polls.slice(index + 1)];
  setValue('polls', updatedPolls);
}

/**
 * this function to check is there multiple voter
 *
 * @param voters number of voters
 * @returns
 */
export function isMultipleVoters(voters: number) {
  const convertNumber = Math.abs(voters);
  return convertNumber > 1;
}
