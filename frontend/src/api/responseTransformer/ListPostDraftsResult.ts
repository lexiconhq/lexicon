import { Apollo } from '../../types';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

import { transformDraftData } from './helper';

/**
 * Transforms response data from:
 *
 * ```
 * {
 *   drafts: [
 *     { data: string, ...otherDraftData },
 *     { data: string, ...otherDraftData }
 *   ]
 * }
 * ```
 *
 * into:
 *
 * ```
 * [
 *   { ...otherDraftData, draft: { __typename: string, ...parsedDraftDetails } },
 *   { ...otherDraftData, draft: { __typename: string, ...parsedDraftDetails } }
 * ]
 * ```
 *
 * This function parses the raw draft `data` field, determines the draft type,
 * and enriches it with necessary details such as category, recipients, and title.
 */

export const listPostDraftsResultResponseTransformer = async (
  data: { drafts: Array<{ data: string; avatar_template: string }> },
  _: string,
  client: Apollo,
) => {
  if (!data.drafts || !Array.isArray(data.drafts)) {
    return [];
  }

  const listNewDrafts = await Promise.all(
    data.drafts.map(async (draft) => {
      const transformedDraft = await transformDraftData(draft.data, client);
      const normalizedInstance = {
        ...draft,
        avatarTemplate: draft.avatar_template,
      };
      return {
        ...draft,
        draft: transformedDraft,
        avatarTemplate: getNormalizedUrlTemplate({
          instance: normalizedInstance,
        }),
      };
    }),
  );

  return listNewDrafts || [];
};
