import { useEffect, useState } from 'react';

import { SearchUser, SearchUserVariables } from '../../generated/server/Search';
import { SEARCH_USER } from '../../graphql/server/search';
import { getImage } from '../../helpers';
import { SelectedUserProps } from '../../types';
import { useLazyQuery } from '../../utils';

export function useMention(
  mentionKeyword: string,
  showUserList: boolean,
  setMentionLoading: (val: boolean) => void,
) {
  const [mentionMembers, setMentionMembers] =
    useState<Array<SelectedUserProps>>();

  const [getMentionList, { data: searchData, loading }] = useLazyQuery<
    SearchUser,
    SearchUserVariables
  >(SEARCH_USER, {
    variables: { search: mentionKeyword },
    onCompleted: () => {
      let formattedMember = searchData?.searchUser.users.map(
        ({ name, username, avatar }) => {
          return {
            name: name ?? null,
            username,
            avatar: getImage(avatar),
          };
        },
      );
      setMentionLoading(loading);
      setMentionMembers(formattedMember);
    },
  });

  useEffect(() => {
    let fetchSearch: NodeJS.Timeout;
    if (showUserList) {
      fetchSearch = setTimeout(() => {
        getMentionList();
      }, 100);
    }
    return () => clearTimeout(fetchSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentionKeyword]);

  return { mentionMembers };
}
