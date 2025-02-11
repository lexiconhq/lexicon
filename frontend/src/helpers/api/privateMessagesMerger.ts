import {
  PrivateMessageList,
  PrivateMessageTopic,
  UserIcon,
} from '../../types/api';

export function privateMessagesMerger(
  pmInbox?: PrivateMessageList,
  pmSent?: PrivateMessageList,
) {
  let inboxTopic = pmInbox?.topicList.topics || [];
  let sentTopic = pmSent?.topicList.topics || [];
  let allTopics = inboxTopic
    .concat(sentTopic)
    .reduce<Array<PrivateMessageTopic>>((prev, curr) => {
      if (prev.find(({ id }) => id === curr.id)) {
        return prev;
      } else {
        return [...prev, curr];
      }
    }, []);
  let inboxUser = pmInbox?.users || [];
  let sentUser = pmSent?.users || [];
  let allUser = inboxUser
    .concat(sentUser)
    .reduce<Array<UserIcon>>((prev, curr) => {
      if (prev.find(({ id }) => id === curr.id)) {
        return prev;
      } else {
        return [...prev, curr];
      }
    }, []);

  const inboxGroups = pmInbox?.primaryGroups ?? [];
  const outboxGroups = pmSent?.primaryGroups ?? [];
  const primaryGroups = [...new Set([...inboxGroups, ...outboxGroups])];

  let completePM = {
    primaryGroups,
    topicList: {
      ...pmInbox?.topicList,
      topics: allTopics.sort((a, b) =>
        a.lastPostedAt > b.lastPostedAt
          ? -1
          : a.lastPostedAt < b.lastPostedAt
          ? 1
          : 0,
      ),
    },
    users: allUser,
  };

  return completePM;
}
