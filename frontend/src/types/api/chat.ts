import { z } from 'zod';

import { UserIcon } from './user';

const Thread = z.object({
  replyCount: z.number(),
});

export type Thread = z.infer<typeof Thread>;

const ChatMessageUpload = z.object({
  id: z.number(),
});

export type ChatMessageUpload = z.infer<typeof ChatMessageUpload>;

const ChatMessage = z.object({
  id: z.number(),
  createdAt: z.string(),
  threadId: z.number().nullable().optional(),
  thread: Thread.nullable().optional(),
  message: z.string(),
  mentionedUsers: z.array(UserIcon),
  user: UserIcon,
  cooked: z.string(),
  uploads: z.array(ChatMessageUpload),
});

export type ChatMessage = z.infer<typeof ChatMessage>;

const Chatable = z.object({
  id: z.number(),
  color: z.string(),
});

const Meta = z.object({
  canJoinChatChannel: z.boolean(),
});

const LastMessage = z.object({
  id: z.number().nullable(),
});

const CurrentUserMembership = z.object({
  following: z.boolean(),
  lastReadMessageId: z.number().nullable(),
});

const Channel = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string(),
  chatable: Chatable,
  meta: Meta,
  lastMessage: LastMessage,
  currentUserMembership: CurrentUserMembership.optional(),
  membershipsCount: z.number(),
  threadingEnabled: z.boolean(),
});

export type Channel = z.infer<typeof Channel>;

const ThreadOriginalMessage = z.object({
  createdAt: z.string(),
  message: z.string(),
  mentionedUsers: z.array(UserIcon),
  user: UserIcon,
  cooked: z.string(),
});

const ThreadDetail = z.object({
  id: z.number(),
  originalMessage: ThreadOriginalMessage,
});

export type ThreadDetail = z.infer<typeof ThreadDetail>;
