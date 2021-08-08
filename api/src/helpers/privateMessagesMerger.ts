import { PMOutput, Topic, UserIcon } from '../types';

export function privateMessagesMerger(pmInbox: PMOutput, pmSent: PMOutput) {
  let inboxTopic = pmInbox.topicList.topics || [];
  let sentTopic = pmSent.topicList.topics || [];
  let allTopics = inboxTopic.concat(sentTopic).reduce((prev, curr) => {
    if (prev.find(({ id }) => id === curr.id)) {
      return prev;
    } else {
      return [...prev, curr];
    }
  }, [] as Array<Topic>);
  let inboxUser = pmInbox.users || [];
  let sentUser = pmSent.users || [];
  let allUser = inboxUser.concat(sentUser).reduce((prev, curr) => {
    if (prev.find(({ id }) => id === curr.id)) {
      return prev;
    } else {
      return [...prev, curr];
    }
  }, [] as Array<UserIcon>);

  let completePM: PMOutput = {
    primaryGroups: pmInbox.primaryGroups,
    topicList: {
      ...pmInbox.topicList,
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
