import { RestLink } from 'apollo-link-rest';

/**
 * Constructs the URL path for searching tags.
 * The `selected_tags` parameter can be an array of strings, which needs to be converted
 * into a query string format where multiple tags are represented as repeated `selected_tags[]` entries.
 *
 * this implementation based on https://github.com/apollographql/apollo-link-rest/issues/69#issue-298010443
 *
 * Example:
 * The constructed URL will look like:
 * https://{baseUrl}/tags/filter/search.json?q=te&limit=5&selected_tags[]=testing&selected_tags[]=super-hero
 *
 * @returns {string} - The constructed URL with query parameters.
 */

export const searchTagsPathBuilder = ({ args }: RestLink.PathBuilderProps) => {
  const baseUrl = `/tags/filter/search.json?q=${args.q}&limit=${args.limit}`;
  const selectedTags = args.selectedTags;
  const tags = selectedTags
    ? Array.isArray(selectedTags)
      ? selectedTags
          .map((tag: string) => `&selected_tags[]=${encodeURIComponent(tag)}`)
          .join('')
      : `&selected_tags[]=${encodeURIComponent(selectedTags)}`
    : '';
  return `${baseUrl}${tags}`;
};
