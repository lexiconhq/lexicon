import { RestLink } from 'apollo-link-rest';

import { LIKE_ACTION_ID } from '../../constants';

export const unlikeTopicOrPostPathBuilder = ({
  args,
}: RestLink.PathBuilderProps) => {
  return `/post_actions/${args.postId}.json?post_action_type_id=${LIKE_ACTION_ID}`;
};
