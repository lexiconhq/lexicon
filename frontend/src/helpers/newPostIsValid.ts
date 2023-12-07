import { PollFormContextValues } from '../types';

export function newPostIsValid(
  title: string,
  content: string,
  uploadsInProgress: number,
  polls?: Array<PollFormContextValues>,
): boolean {
  const hasTitle = title.trim().length > 0;
  const hasContent = content.trim().length > 0;
  const hasPoll = (polls && polls.length > 0) || false;
  const noUploadsInProgress = uploadsInProgress < 1;

  return hasTitle && (hasContent || hasPoll) && noUploadsInProgress;
}
