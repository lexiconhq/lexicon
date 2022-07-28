import * as runtypes from 'runtypes';

import { GetTopicDetail } from '../generated/server/GetTopicDetail';
import { Notification as GeneratedNotification } from '../generated/server/Notification';
import { Profile } from '../generated/server/Profile';
import { Site } from '../generated/server/Site';
import { UserActivity as GeneratedUserActivity } from '../generated/server/UserActivity';
import { SearchTags } from '../generated/server/Search';

import { User } from './Post';

let ChannelRecord = runtypes.Record({
  id: runtypes.Number,
  name: runtypes.String,
  description: runtypes.String.Or(runtypes.Null),
  color: runtypes.String,
});

export type ErrorAlertOptionType = 'HIDE_ALERT' | 'SHOW_ALERT';

export let ChannelList = runtypes.Array(ChannelRecord);

export type Channel = runtypes.Static<typeof ChannelRecord>;

export type Notification = {
  id: number;
  topicId?: number;
  postId?: number;
  badgeId?: number;
  name: string;
  message: string;
  createdAt: string;
  hasIcon: boolean;
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
  userId: number;
  time: string;
  message: string;
  images?: Array<string>;
  listOfMention?: Array<string>;
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

export type UserDetail = Extract<
  Profile['userProfile']['user'],
  { __typename: 'UserDetail' }
>;

export type PostStream = GetTopicDetail['topicDetail']['postStream'];
export type TopicDetail = NonNullable<GetTopicDetail['topicDetail']>;
export type TopicDetailInner = TopicDetail['details'];

export type SiteSettings = Site['site'];
export type RawNotificationsType = NonNullable<
  GeneratedNotification['notification']['notifications']
>[number];
export type UserActivity = GeneratedUserActivity['userActivity'][number];

export type Tag = SearchTags['searchTag'][number];
