import { FetchResult, InternalRefetchQueriesInclude } from '@apollo/client';

import {
  DeletePostDraftMutationVariables,
  DeletePostDraftMutation as DeletePostDraftType,
} from '../generatedAPI/server';

export type DeletePostDraftMutateFnInput = {
  variables: DeletePostDraftMutationVariables;
  refetchQueries?:
    | InternalRefetchQueriesInclude
    | ((
        result: FetchResult<DeletePostDraftType>,
      ) => InternalRefetchQueriesInclude);
};
