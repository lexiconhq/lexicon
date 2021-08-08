import { newPostIsValid } from './newPostIsValid';

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
): boolean {
  const titleIsValid = title !== oldTitle;
  const contentIsValid = content !== oldContent;
  const channelIsValid = channel !== oldChannel;
  const tagsIsValid = JSON.stringify(tags) !== JSON.stringify(oldTags);

  const postIsValid =
    (titleIsValid || contentIsValid || channelIsValid || tagsIsValid) &&
    newPostIsValid(title, content, uploadsInProgress);

  return postIsValid;
}
