/**
 * Transforms the response data for the search tag API from an object into an array.
 *
 * When the Discourse API for search tags is called, it returns a response in the following format:
 *
 * {
 *   results: [
 *     {
 *       count: 0,
 *       id: 1,
 *       text: 'test',
 *     },
 *   ],
 * }
 *
 * This function converts it into a simple array format:
 *
 * [
 *   {
 *     count: 0,
 *     id: 1,
 *     text: 'test',
 *   },
 * ];
 */

import { Tag } from '../../generatedAPI/server';

export const searchTagOutputResponseTransform = (data: {
  results: Array<Tag>;
}) => {
  return data.results;
};
