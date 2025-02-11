import { RestLink } from 'apollo-link-rest';

import { UserIcon } from '../../generatedAPI/server';
import { Group, Topic } from '../../types/api';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const privateMessageOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
) => {
  const primaryGroups = data?.primaryGroups || [];
  const normalizedGroups = primaryGroups.map((group: Group) => {
    if (typeof group !== 'number' && 'id' in group) {
      return group.id;
    }

    return group;
  });

  if (data.users) {
    data.users = data.users.map((user: UserIcon) => {
      return {
        ...user,
        avatarTemplate: getNormalizedUrlTemplate({ instance: user }),
        __typename: 'User',
      };
    });
  }

  // Required to add `__typename` to enable normalization of values in the Apollo cache into `__ref: "Topic:1"`

  data.topicList.topics = data.topicList.topics.map((topic: Topic) => ({
    ...topic,
    __typename: 'Topic',
  }));

  return {
    ...data,
    __typename: 'PrivateMessageOutput',
    primaryGroups: normalizedGroups,
  };
};
