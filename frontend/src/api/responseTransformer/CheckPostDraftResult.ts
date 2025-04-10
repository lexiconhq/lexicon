import { Apollo } from '../../types';
import { CheckDraft } from '../../types/api';

import { transformDraftData } from './helper';

/**
 * Transforms response data from:
 *
 * ```
 * {
 *   draft: { ...dataDraft },
 *   draft_sequence: number
 * }
 * ```
 *
 * into:
 *
 * ```
 * {
 *   draft: { ...dataDraft, __typename: string },
 *   sequence: number
 * }
 * ```
 *
 */

export const checkPostDraftResultResponseTransformer = async (
  data: CheckDraft,
  _: string,
  client: Apollo,
) => {
  // If there is no draft data, return an empty draft response.
  if (!data.draft) {
    return { draft: null, sequence: data.draft_sequence };
  }

  let newDraftData = await transformDraftData(data.draft, client);

  return {
    draft: newDraftData,
    sequence: data.draft_sequence,
  };
};
