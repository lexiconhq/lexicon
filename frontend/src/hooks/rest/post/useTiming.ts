import { PureQueryOptions } from '@apollo/client';
import { useEffect } from 'react';

import { timingsBodyBuilder } from '../../../api/bodyBuilder';
import {
  MessageListDocument,
  TimingsDocument,
  TimingsMutation,
  TimingsMutationVariables,
} from '../../../generatedAPI/server';
import { useStorage } from '../../../helpers';
import { MessageContent } from '../../../types';
import { useMutation } from '../../../utils';

type Posts = Array<MessageContent | number>;

function useTiming(
  topicId: number,
  startIndex: number,
  posts?: Posts,
  skip = false,
  refetchQueries?: Array<PureQueryOptions>,
) {
  const [submitTiming] = useMutation<TimingsMutation, TimingsMutationVariables>(
    TimingsDocument,
    {
      refetchQueries,
      awaitRefetchQueries: !!refetchQueries,
    },
  );

  useEffect(() => {
    if (skip || !posts) {
      return;
    }

    const postNumbers = posts.map((_, index) => index + startIndex + 1) ?? [];
    submitTiming({
      variables: {
        postNumbers,
        topicId,
        timingsBodyBuilder,
      },
    });
  }, [skip, posts, topicId, submitTiming, startIndex]);
}

/**
 * useMessageTiming reports timing information to Discourse based on which messages
 * a user has read in a given message thread.
 *
 * Discourse uses this to provide reporting and analytics about activity on the forum.
 *
 * This reporting is skipped if, for some reason, the user's username is not set.
 */
export function useMessageTiming(
  topicId: number,
  startIndex = 0,
  posts?: Posts,
) {
  const storage = useStorage();
  const user = storage.getItem('user');
  const username = user?.username;

  // If for some reason there is no username, we are probably in a weird state and
  // should not try to report timing information.
  const skip = !username;

  let refetchQueries = [
    { query: MessageListDocument, variables: { username } },
  ];

  useTiming(topicId, startIndex, posts, skip, refetchQueries);
}

/**
 * useTopicTiming reports timing information to Discourse based on which posts
 * a user has read in a given topic, and how long they have spent on a given post.
 *
 * Discourse uses this to provide reporting and analytics about activity on the forum.
 *
 * This reporting is skipped if the user is not currently logged in (the user's ID is not set).
 */
export function useTopicTiming(topicId: number, startIndex = 0, posts?: Posts) {
  const storage = useStorage();
  const user = storage.getItem('user');

  // If the User ID is not set, then the user is not currently logged in, and we shouldn't
  // try to report timing information. This is a valid use-case when browsing a public
  // Discourse instance.
  const skip = user?.id === undefined;

  useTiming(topicId, startIndex, posts, skip);
}
