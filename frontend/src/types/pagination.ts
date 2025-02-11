import { z } from 'zod';

const Reference = z.object({
  __ref: z.string(),
});

export const SearchPost = z.object({
  'posts@type({"name":"SearchPost"})': z.array(Reference),
  'topics@type({"name":"SearchTopic"})': z.array(Reference),
});

export const MessageDetail = z.object({
  topicList: z.object({ topics: z.array(Reference) }),
  users: z.array(Reference),
});

export const Notifications = z.object({
  'notifications@type({"name":"NotificationsData"})': z.array(Reference),
});
