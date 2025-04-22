import { RestLink } from 'apollo-link-rest';

/**
 * Generates the URL for filtering the channel list.
 *
 * The function takes the following inputs:
 * - `limit`: The number of channels to return (default is 10).
 * - `offset`: The starting index of the list (e.g., to get items 1-10, use offset 0; to get 11-20, use offset 10).
 * - `status`: The status of the channels to filter by (options: `all`, `open`, `closed`).
 * - `filter`: A search term used to filter channels by their title (e.g., "channel test").
 *
 * Example of the expected format for the returned URL:
 * `/chat/api/channels?limit=10&offset=0&filter=&status=open`
 *
 * @returns {string} The constructed URL for the channel API with the specified filters.
 */

export function getChatChannelsPathBuilder({
  args,
}: RestLink.PathBuilderProps) {
  const { limit = 10, offset = 0, status, filter } = args;

  const queryParams = new URLSearchParams();

  if (status) {
    queryParams.append('status', status);
  }
  if (filter) {
    queryParams.append('filter', filter);
  }
  queryParams.append('offset', offset.toString());
  queryParams.append('limit', limit.toString());

  return `/chat/api/channels?${queryParams.toString()}`;
}
