import { z } from 'zod';

import { UserIcon } from './user';
import { TopicSchema } from './topic';

const TopicPoster = z.object({
  userId: z.number().nullable().optional(),
});

// Create a new Topic type for PrivateMessage that only include the necessary fields
// because there are required fields in TopicSchema that are not returned in private message query
const Topic = TopicSchema.pick({
  id: true,
  title: true,
  unseen: true,
  allowedUserCount: true,
  highestPostNumber: true,
  lastReadPostNumber: true,
  lastPostedAt: true,
  lastPosterUsername: true,
  participants: true,
}).extend({ posters: z.array(TopicPoster) });

const TopicList = z.object({
  topics: z.array(Topic).nullable().optional(),
});

const PrivateMessageList = z.object({
  primaryGroups: z.array(z.number()).nullable().optional(),
  topicList: TopicList,
  users: z.array(UserIcon).nullable().optional(),
});

export type PrivateMessageList = z.infer<typeof PrivateMessageList>;
export type PrivateMessageTopic = z.infer<typeof Topic>;
