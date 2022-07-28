import { privateMessagesMerger } from '../helpers';
import { DiscoursePMInput, PMOutput } from '../types';

import { createMessage, createUser } from './data';

describe('privateMessagesMerger', () => {
  const topicListDefaults = {
    canCreateTopic: true,
    draft: null,
    draftKey: 'new_topic',
    draftSequence: 4,
    perPage: 30,
    topTags: [],
  };

  const currentUser = createUser({ id: 0, username: 'current-user' });
  const otherUser = createUser({ id: 1, username: 'other-user' });

  const messageWhoAreYou = createMessage({
    id: 0,
    lastPosterUsername: otherUser.username,
    title: "Who are you! I don't know you!",
  });

  const messageWhoDoYouThink = createMessage({
    id: 1,
    lastPosterUsername: currentUser.username,
    title: 'Who do you think I am?',
  });

  const messageNotDoingTasks = createMessage({
    id: 2,
    lastPosterUsername: currentUser.username,
    title: "You're not doing your tasks",
  });

  it('can merge all topics and users without duplicates', () => {
    const inboxTopics = [messageWhoAreYou, messageWhoDoYouThink];
    const outboxTopics = [messageWhoAreYou, messageNotDoingTasks];

    const inbox: DiscoursePMInput = {
      users: [currentUser, otherUser],
      primaryGroups: [1, 2],
      topicList: { ...topicListDefaults, topics: inboxTopics },
    };

    const outbox: DiscoursePMInput = {
      users: [currentUser],
      primaryGroups: [3, 4],
      topicList: { ...topicListDefaults, topics: outboxTopics },
    };

    const expected: PMOutput = {
      users: [currentUser, otherUser],
      primaryGroups: [1, 2, 3, 4],
      topicList: {
        ...topicListDefaults,
        topics: [messageWhoAreYou, messageWhoDoYouThink, messageNotDoingTasks],
      },
    };

    const result = privateMessagesMerger(inbox, outbox);
    expect(result).toEqual(expected);
  });

  it('can handle both response types for `primaryGroups`', () => {
    const inbox: DiscoursePMInput = {
      users: [otherUser],
      primaryGroups: [1, 2, { id: 3, name: 'staff' }, 4],
      topicList: {
        ...topicListDefaults,
        topics: [messageWhoAreYou],
      },
    };

    const outbox: DiscoursePMInput = {
      users: [currentUser],
      primaryGroups: [
        { id: 1, name: 'owners' },
        4,
        { id: 5, name: 'moderators' },
      ],
      topicList: {
        ...topicListDefaults,
        topics: [messageWhoDoYouThink],
      },
    };

    const expected: PMOutput = {
      users: [otherUser, currentUser],
      primaryGroups: [1, 2, 3, 4, 5],
      topicList: {
        ...topicListDefaults,
        topics: [messageWhoAreYou, messageWhoDoYouThink],
      },
    };

    const result = privateMessagesMerger(inbox, outbox);
    expect(result).toEqual(expected);
  });
});
