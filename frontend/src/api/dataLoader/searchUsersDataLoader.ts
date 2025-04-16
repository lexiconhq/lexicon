import DataLoader from 'dataloader';

import {
  SearchUser,
  SearchUserDocument,
  SearchUserQueryVariables,
  SearchUserQuery as SearchUserType,
} from '../../generatedAPI/server';
import { Apollo } from '../../types';

export const createSearchUsersDataLoader = (client: Apollo) =>
  new DataLoader<string, SearchUser | null>(async (searches) => {
    const requests = searches.map((search) =>
      client.query<SearchUserType, SearchUserQueryVariables>({
        query: SearchUserDocument,
        variables: { search },
      }),
    );

    const responses = await Promise.all(requests);

    return responses.map((data) => {
      const user = data.data.searchUser.users?.[0] ?? null;
      return user
        ? {
            username: user.username,
            name: user.name,
            avatarTemplate: user.avatar,
            id: user.id,
          }
        : null;
    });
  });
