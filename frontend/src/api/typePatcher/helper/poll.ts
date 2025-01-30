import {
  formatPollOptionId,
  formatPreloadedVoters,
} from '../../../helpers/api';
import { Poll, PollOption } from '../../../types/api';
import { getNormalizedUrlTemplate } from '../../discourse-apollo-rest/utils';

export function generatePollPatcher({
  postId,
  pollName,
  poll,
}: {
  postId: number;
  pollName: string;
  poll: Poll;
}) {
  let formattedPoll = {
    ...poll,
    ...formatPreloadedVoters(postId, pollName, poll.preloadedVoters),
    options: poll.options.map((option: PollOption) => ({
      ...option,
      id: formatPollOptionId(postId, pollName, option.id),
    })),
  };

  if (formattedPoll.preloadedVoters) {
    formattedPoll.preloadedVoters = formattedPoll.preloadedVoters?.map(
      (data) => {
        return {
          ...data,
          users:
            data.users?.map((user) => {
              return {
                ...user,
                avatarTemplate: getNormalizedUrlTemplate({ instance: user }),
              };
            }) ?? null,
        };
      },
    );
  }

  return formattedPoll;
}
