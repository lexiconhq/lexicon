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

export function existingPostIsValid(
  uploadsInProgress: number,
  title: string,
  oldTitle: string,
  content: string,
  oldContent: string,
  channel?: number,
  oldChannel?: number,
  tags?: Array<string>,
  oldTags?: Array<string>,
): SubmissionDetails {
  const titleIsValid = title !== oldTitle;
  const contentIsValid = content !== oldContent;
  const channelIsValid = channel !== oldChannel;
  const tagsIsValid = JSON.stringify(tags) !== JSON.stringify(oldTags);

  const topicModified = titleIsValid || channelIsValid || tagsIsValid;

  let submissionDetails = { isValid: false, editType: EditType.Both };

  submissionDetails.isValid =
    (topicModified || contentIsValid) &&
    newPostIsValid(title, content, uploadsInProgress);

  if (topicModified && contentIsValid) {
    submissionDetails.editType = EditType.Both;
  } else if (contentIsValid) {
    submissionDetails.editType = EditType.Post;
  } else {
    submissionDetails.editType = EditType.Topic;
  }

  return submissionDetails;
}
