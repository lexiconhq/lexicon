import { postDraftPathBuilder } from '../api/pathBuilder/postDraft';
import { ListPostDraftsDocument } from '../generatedAPI/server';

import { defaultArgsListPostDraft } from './postDraft';

export const refetchQueriesPostDraft = [
  {
    query: ListPostDraftsDocument,
    variables: {
      ...defaultArgsListPostDraft,
      postDraftPath: postDraftPathBuilder,
    },
  },
];
