import { RestLink } from 'apollo-link-rest';

import { Participant } from '../../generatedAPI/server';
import { Post } from '../../types/api';
import { getNormalizedUrlTemplate } from '../discourse-apollo-rest/utils';

import { generatePostPatcher } from './helper/Post';

export const privateMessageDetailOutputPatcher: RestLink.FunctionalTypePatcher =
  (data) => {
    if (data.postStream) {
      let formattedPosts = data.postStream.posts.map((post: Post) => {
        return generatePostPatcher(post);
      });
      data.postStream.posts = formattedPosts;
    }

    if (data.details?.participants) {
      data.details.participants = data.details.participants?.map(
        (participant: Participant) => {
          return {
            ...participant,
            avatarTemplate: getNormalizedUrlTemplate({ instance: participant }),
          };
        },
      );
    }

    if (data.details?.allowedUsers) {
      data.details.allowedUsers = data.details.allowedUsers.map(
        (allowUser: Participant) => {
          return {
            ...allowUser,
            avatarTemplate: getNormalizedUrlTemplate({ instance: allowUser }),
          };
        },
      );
    }

    return {
      ...data,
      __typename: 'PrivateMessageDetailOutput',
    };
  };
