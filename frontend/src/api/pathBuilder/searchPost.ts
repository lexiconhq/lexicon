import { RestLink } from 'apollo-link-rest';

/**
 * Constructs the URL path for searching posts.
 *
 * This function generates a REST API URL with the required query parameters based on the provided arguments.
 * The `search` parameter is URL-encoded to ensure special characters are properly handled.
 * The `order` parameter is optional and, if provided, will be appended to the search query.
 * The `page` parameter determines pagination and is required.
 *
 * Example:
 * For arguments `{ search: "Test", order: "latest", page: 2 }`,
 * the constructed URL will be:
 * `search.json?q=Test%20order:latest&page=2`
 *
 * @param {RestLink.PathBuilderProps} props - The properties passed by Apollo's REST Link.
 * @param {Record<string, any>} props.args - Arguments containing `search`, `order`, and `page` for the query.
 * @returns {string} - The constructed URL with query parameters.
 *
 * @throws {Error} - If required arguments `search` or `page` are missing.
 */

export const searchPostPathBuilder = ({ args }: RestLink.PathBuilderProps) => {
  const { search, order, page } = args;

  // Remove encode because at URLSearchParam all symbol already change example: "Overflow !" became "Overflow+%21"
  // Where in here empty space became +
  // if we use encode it will encode two time which make empty space became %2025
  const queryParams = new URLSearchParams({
    q: `${search}${order ? ` order:${order}` : ''}`,
    page: String(page),
  });

  return `/search.json?${queryParams.toString()}`;
};
