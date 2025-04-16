import { RestLink } from 'apollo-link-rest';

import { generatePostPatcher } from './helper/Post';

export const PostPatcher: RestLink.FunctionalTypePatcher = (post) => {
  return generatePostPatcher(post);
};
