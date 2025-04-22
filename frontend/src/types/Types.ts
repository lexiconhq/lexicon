import * as runtypes from 'runtypes';

import {
  NotificationQuery as GeneratedNotification,
  UserActivityQuery as GeneratedUserActivity,
  GetTopicDetailQuery,
  ProfileQuery,
  SearchTagsQuery,
  SiteQuery,
} from '../generatedAPI/server';

import { Poll, PollsVotes, User } from './Post';
import { ChatMessageUpload, Thread } from './api';

let ChannelRecord = runtypes.Record({
  id: runtypes.Number,
  name: runtypes.String,
  description: runtypes.String.Or(runtypes.Null),
  color: runtypes.String,
});

export type ErrorAlertOptionType = 'HIDE_ALERT' | 'SHOW_ALERT';

export let ChannelList = runtypes.Array(ChannelRecord);

export type Channel = runtypes.Static<typeof ChannelRecord>;

/**
 * Check the latest notification type list here
 * https://github.com/discourse/discourse/blob/main/app/models/notification.rb
 */

export enum NotificationType {
  Mention = 1,
  ReplyPost = 2,
  QuotePost = 3,
  EditPost = 4,
  LikePost = 5,
  SendMessage = 6,
  InviteMessage = 7,
  // InviteeAccepted = 8,
  ReplyMessage = 9,
  MovePost = 10,
  LinkPost = 11,
  // ObtainBadge = 12,
  InviteTopic = 13,
  Custom = 14,
  GroupMention = 15,
  // ModeratorsInbox = 16,
  WatchingTopic = 17,
  TopicReminder = 18,
  LikeMultiplePosts = 19,
  PostApproved = 20,
  CodeReviewCommitApproved = 21,
  MembershipRequestAccepted = 22,
  MembershipRequestConsolidated = 23,
  BookmarkReminder = 24,
  Reaction = 25,
  VotesReleased = 26,
  EventReminder = 27,
  EventInvitation = 28,
  ChatMention = 29,
  WatchingCategoryOrTag = 36,
}

export type Notification = {
  id: number;
  topicId?: number;
  postId?: number;
  badgeId?: number;
  name: string;
  message: string;
  createdAt: string;
  seen: boolean;
  notificationType: number;
  onPress: (
    topicId?: number,
    postId?: number,
    // badgeId?: number ,
  ) => void;
};

export type EmailAddress = {
  emailAddress: string;
  type: 'PRIMARY' | 'SECONDARY' | 'UNCONFIRMED';
};

export type MessageContent = {
  id: number;
  username: string;
  time: string;
  message: string;
  mentions?: Array<string>;
  polls?: Array<Poll>;
  pollsVotes?: Array<PollsVotes>;
};

export type Message = {
  members: Array<User>;
  contents: Array<MessageContent>;
};

export type MessageParticipants = {
  participants: Array<User>;
  participantsToShow: Array<User>;
};

export type Flag = {
  id: number;
  description: string;
  name: string;
  isFlag: boolean;
  nameKey: string;
};

export type UserMessageProps = {
  id: number;
  avatar: string;
  name: string | null;
  username: string;
};

export type SelectedUserProps = {
  avatar: string;
  name: string | null;
  username: string;
};

export type CursorPosition = {
  start: number;
  end: number;
};

export type Image = {
  link: string;
  done: boolean;
};

export type UserDetail = ProfileQuery['profile']['user'];
export type PostStream = GetTopicDetailQuery['topicDetail']['postStream'];
export type TopicDetail = NonNullable<GetTopicDetailQuery['topicDetail']>;
export type TopicDetailInner = TopicDetail['details'];

export type SiteSettings = SiteQuery['site']['siteSettings'];
export type RawNotificationsType = NonNullable<
  GeneratedNotification['notificationQuery']['notifications']
>[number];
export type UserActivity = GeneratedUserActivity['activity'][number];

export type Tag = SearchTagsQuery['searchTag'][number];

export type StackAvatarUser = {
  avatar: string;
  name: string;
  username: string;
};

export type ChatMessageContent = {
  id: number;
  time: string;
  threadId?: number | null;
  thread?: Thread;
  mentionedUsers: Array<Omit<User, 'avatar'>>;
  user: User;
  replyCount?: number | null;
  uploads: Array<ChatMessageUpload>;
  markdownContent: string;
};

export type ThreadDetailFirstContent = Omit<
  ChatMessageContent,
  'replyCount' | 'uploads' | 'threadId' | 'thread'
>;
