/**
 * Transforms the response data for a reply post by extracting the first reply
 * from an array and returning it as an object.
 *
 */

export const replyingToOutputResponseTransform = (
  data: Array<{ id: string }>,
) => {
  return data[0];
};
