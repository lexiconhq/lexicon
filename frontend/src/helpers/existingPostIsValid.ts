import { FieldValue, FieldValues, FormState } from 'react-hook-form';

import { PollFormContextValues } from '../types';

import { newPostIsValid } from './newPostIsValid';

enum EditType {
  Topic = 'Topic',
  Post = 'Post',
  Both = 'Both',
}

type SubmissionDetails = {
  isValid: boolean;
  editType: EditType;
};

type ExistingPostIsValidParams<T extends FieldValues> = {
  uploadsInProgress: number;
  title: string;
  oldTitle?: string;
  content: string;
  oldContent?: string;
  channel?: number;
  oldChannel?: number;
  tags?: Array<string>;
  oldTags?: Array<string>;
  getFieldState?: (
    name: string,
    formState: FormState<FieldValue<T>>,
  ) => { isDirty: boolean };
  formState?: FormState<FieldValue<T>>;
  polls?: Array<PollFormContextValues>;
};

export function existingPostIsValid<T extends FieldValues>({
  uploadsInProgress,
  title,
  oldTitle,
  content,
  oldContent,
  channel,
  oldChannel,
  tags,
  oldTags,
  getFieldState,
  formState,
  polls,
}: ExistingPostIsValidParams<T>): SubmissionDetails {
  let titleIsValid;
  let contentIsValid;
  let channelIsValid;
  let tagsIsValid;
  let pollIsValid;

  if (getFieldState && formState) {
    /**
     * This condition checks using `react-hook-form` to determine whether a value has changed from its default value (either from a reset or the default value set using `useForm`).
     * If it's true, it will return that the form is dirty.
     */

    titleIsValid = getFieldState('title', formState).isDirty;
    contentIsValid = getFieldState('raw', formState).isDirty;
    channelIsValid = getFieldState('channelId', formState).isDirty;
    tagsIsValid = getFieldState('tags', formState).isDirty;
    pollIsValid = getFieldState('polls', formState).isDirty;
  } else {
    titleIsValid = title !== oldTitle;
    contentIsValid = content !== oldContent;
    channelIsValid = channel !== oldChannel;
    tagsIsValid = JSON.stringify(tags) !== JSON.stringify(oldTags);
  }

  const topicModified = titleIsValid || channelIsValid || tagsIsValid;
  const postModified = pollIsValid || contentIsValid;
  let submissionDetails = { isValid: false, editType: EditType.Both };

  submissionDetails.isValid =
    (topicModified || postModified) &&
    newPostIsValid(title, content, uploadsInProgress, polls);

  if (topicModified && postModified) {
    submissionDetails.editType = EditType.Both;
  } else if (postModified) {
    submissionDetails.editType = EditType.Post;
  } else {
    submissionDetails.editType = EditType.Topic;
  }

  return submissionDetails;
}
