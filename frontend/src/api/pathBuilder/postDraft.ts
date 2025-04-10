import { RestLink } from 'apollo-link-rest';

import { defaultArgsListPostDraft } from '../../constants/postDraft';

/**
 * Builds the API endpoint for fetching post draft with pagination.
 * ex Url: /drafts.json?limit=50&offset=0
 *
 * @returns {string} The constructed API endpoint URL with query parameters.
 */
export const postDraftPathBuilder = ({ args }: RestLink.PathBuilderProps) => {
  const { page } = args;

  const queryParams = new URLSearchParams({
    limit: defaultArgsListPostDraft.limit.toString(),
    offset: ((page - 1) * defaultArgsListPostDraft.limit).toString(),
  });
  return `/drafts.json?${queryParams}`;
};
