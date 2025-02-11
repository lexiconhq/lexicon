/**
 * Transforms the response data for user activity by extracting the `user_actions` array.
 *
 * The input data is in the following format:
 * {
 *   user_actions: [ // array of user actions data ]
 * }
 *
 * This function converts it into:
 * [ // array of user actions data ]
 *
 * @param {Object} data - The response data containing the `user_actions` field.
 * @returns {Array<UserActions>} - The transformed array of user actions.
 */

import { UserActions } from '../../generatedAPI/server';

export const userActionsResponseTransform = (data: {
  user_actions: Array<UserActions>;
}) => {
  return data.user_actions;
};
