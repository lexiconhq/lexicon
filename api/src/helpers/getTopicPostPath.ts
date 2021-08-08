export function getTopicPostPath(
  post?: Array<number> | null,
  postPointer?: number | null,
) {
  if (post) {
    return '/posts';
  }
  return postPointer ? `/${postPointer}` : '';
}
