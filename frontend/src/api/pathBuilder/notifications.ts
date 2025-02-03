import { RestLink } from 'apollo-link-rest';

/**
 * Builds the API endpoint for fetching notifications with pagination.
 * ex Url: /notifications.json?filter=all&offset=1
 *
 * @returns {string} The constructed API endpoint URL with query parameters.
 */
export const notificationsPathBuilder = ({
  args,
}: RestLink.PathBuilderProps) => {
  const { page } = args;

  const queryParams = new URLSearchParams({
    filter: 'all',
    offset: ((page - 1) * 60).toString(),
  });

  return `/notifications.json?${queryParams}`;
};
