export function newPostIsValid(
  title: string,
  content: string,
  uploadsInProgress: number,
): boolean {
  const hasTitle = title.trim().length > 0;
  const hasContent = content.trim().length > 0;
  const noUploadsInProgress = uploadsInProgress < 1;

  return hasTitle && hasContent && noUploadsInProgress;
}
