import { RestLink } from 'apollo-link-rest';

import { UserIcon } from '../../generatedAPI/server';
import { getTopicAuthorUserId } from '../../helpers/api';
import { Topic } from '../../types/api';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

export const topicsOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
  _,
  __,
) => {
  let { users }: { users: Array<UserIcon> } = data;
  data.topicList.topics = data.topicList.topics.map((topic: Topic) => {
    const { posters } = topic;
    let postersWithUser = posters.map((poster) => {
      let user =
        poster.user ??
        ('userId' in poster && users.find(({ id }) => id === poster.userId));

      if (user) {
        user = {
          ...user,
          avatarTemplate: getNormalizedUrlTemplate({ instance: user }),
        };
      }

      return { ...poster, user };
    });
    return {
      ...topic,
      posters: postersWithUser,
      authorUserId: getTopicAuthorUserId(posters) ?? null,
    };
  });

  data.topicList.tags = data.topicList?.tags ?? null;
  data.users =
    data.users?.map((user: UserIcon) => {
      return {
        ...user,
        avatarTemplate: getNormalizedUrlTemplate({ instance: user }),
      };
    }) ?? [];

  return {
    ...data,
    __typename: 'TopicsOutput',
  };
};
