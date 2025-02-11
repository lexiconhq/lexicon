import {
  formatPolls,
  generateMarkdownContent,
  getMention,
} from '../../../helpers/api';
import { ActionSummary, Post } from '../../../types/api';
import { getNormalizedUrlTemplate } from '../../discourse-apollo-rest/utils';

export function generatePostPatcher(post: Post) {
  const { formattedPolls, formattedPollsVotes } = formatPolls(
    post.id,
    post.polls,
    post.pollsVotes,
  );

  const markdownContent = post?.raw
    ? post?.cooked
      ? generateMarkdownContent(post.raw, post.cooked)
      : post.raw
    : null;

  const actionsSummary = post.actionsSummary?.map((action: ActionSummary) => {
    return {
      ...action,
      acted: action.acted ?? null,
    };
  });
  return {
    ...post,
    __typename: 'Post',
    polls: formattedPolls,
    pollsVotes: formattedPollsVotes,
    avatarTemplate: getNormalizedUrlTemplate({ instance: post }),
    markdownContent,
    mentions: getMention(post.cooked) || null,
    actionsSummary,
  };
}
