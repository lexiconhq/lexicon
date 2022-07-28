import { DiscoursePMInput, PMOutput, Topic, UserIcon } from '../types';

function normalizeGroupsToIds(
  groups: DiscoursePMInput['primaryGroups'],
): PMOutput['primaryGroups'] {
  return groups?.map((group) => {
    if (typeof group !== 'number' && 'id' in group) {
      return group.id;
    }

    return group;
  });
}

export function privateMessagesMerger(
  pmInbox: DiscoursePMInput,
  pmSent: DiscoursePMInput,
) {
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

  const inboxGroups = normalizeGroupsToIds(pmInbox.primaryGroups) ?? [];
  const outboxGroups = normalizeGroupsToIds(pmSent.primaryGroups) ?? [];
  const primaryGroups = [...new Set([...inboxGroups, ...outboxGroups])];

  let completePM: PMOutput = {
    primaryGroups,
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
