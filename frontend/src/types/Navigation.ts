import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigationState,
  NavigatorScreenParams,
  PartialState,
  RouteProp as RoutePropBase,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { NetworkStatus, WithRequestFailed } from '../components';

import { Poll, PostData, User } from './Post';
import { StackAvatarUser, UserDetail } from './Types';

export type RootStackNavProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

export type StackNavProp<T extends keyof RootStackParamList> =
  RootStackNavProp<T>;

export type TabNavProp<T extends keyof TabParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, T>,
  StackNavigationProp<RootStackParamList>
>;

export type RootStackRouteProp<T extends keyof RootStackParamList> =
  RoutePropBase<RootStackParamList, T>;

export type StackRouteProp<T extends keyof RootStackParamList> =
  RootStackRouteProp<T>;

export type TabRouteProp<T extends keyof TabParamList> = RoutePropBase<
  TabParamList,
  T
>;

type ChannelsParams = {
  prevScreen: 'Home' | 'NewPost';
};

type EditProfileParams = {
  user: UserDetail;
};

type FlagPostParams = {
  postId: number;
  isPost?: boolean;
  flaggedAuthor?: string;
};

export type HomeProps = { backToTop?: boolean };

type ImagePreviewParams = {
  topicId: number;
};

type PostImagePreviewParams = {
  imageUri: string;
  title?: string;
  prevScreen: 'NewPost' | 'PostReply' | 'NewMessage';
};

export type MessageDetailParams = {
  id: number;
  postNumber?: number;
  emptied?: boolean;
  hyperlinkUrl: string;
  hyperlinkTitle: string;
  source?: 'deeplink';
};

type NewMessageParams = {
  hyperlinkUrl?: string;
  hyperlinkTitle?: string;
  imageUri?: string;
};

type EditedUser = {
  avatar: string;
  username: string;
};

type NewPostParams = {
  hyperlinkUrl?: string;
  hyperlinkTitle?: string;
  editedUser?: EditedUser;
  imageUri?: string;
};

type PostPreviewParams = {
  reply: boolean;
  postData: PostData;
  focusedPostNumber?: number;
  editPostId?: number;
  editTopicId?: number;
  editedUser?: EditedUser;
};

type PostDetailParams = {
  topicId: number;
  content?: string;
  focusedPostNumber?: number;
  hidden?: boolean;
  postNumber?: number;
  prevScreen?: string;
  source?: 'deeplink';
};

export type PostReplyParams = {
  title: string;
  topicId: number;
  replyToPostId?: number;
  focusedPostNumber?: number;
  hyperlinkUrl?: string;
  hyperlinkTitle?: string;
  editPostId?: number;
  oldContent?: string;
  editedUser?: EditedUser;
  imageUri?: string;
};

type TagsParams = {
  canCreateTag: boolean;
};

type TroubleshootParams = {
  type: WithRequestFailed<Exclude<NetworkStatus, 'Online'>>;
};

type HyperlinkParams = {
  id?: number;
  title?: string;
  postNumber?: number;
  prevScreen: 'NewPost' | 'PostReply' | 'NewMessage' | 'MessageDetail';
} & Pick<PostReplyParams, 'replyToPostId'>;

type UserInformationParams = {
  username: string;
};

type EditUserStatusParams = {
  emojiCode?: string;
  emojiText?: string;
  status?: string;
  endDate?: string;
};

type NewPollParams = {
  pollIndex?: number;
  prevScreen:
    | 'NewPost'
    | 'PostReply'
    | 'NewMessage'
    | 'MessageDetail'
    | 'ImagePreview'
    | 'EditPollsList';
  editPost?: boolean;
  messageTopicId?: number;
};

type StackAvatarModalParams = {
  option: string;
  amountVote: number;
  users: Array<StackAvatarUser>;
};

type PollParams = {
  poll: Poll;
  pollVotes?: Array<string>;
  isCreator: boolean;
  postId?: number;
  topicId: number;
  author?: User;
  createdAt: string;
};

type LoginParams = {
  emailToken?: string;
  isActivateAccount?: boolean;
};

export type ChatChannelDetailParams = {
  lastMessageId?: number;
  channelId: number;
  channelTitle?: string;
  memberCount?: number;
  threadEnabled?: boolean;
  targetMessageId?: number;
};

export type ThreadParams = {
  channelId: number;
  threadId: number;
} & ( // Ensure that only one of threadFirstMessageId or threadTargetMessageId is provided
  | { threadFirstMessageId: number; threadTargetMessageId?: never }
  | { threadTargetMessageId: number; threadFirstMessageId?: never }
);

type EditPollsListParams = {
  messageTopicId: number;
};

export type RootStackParamList = {
  Channels: ChannelsParams;
  DarkMode: undefined;
  PushNotificationsPreferences: undefined;
  FlagPost: FlagPostParams;
  HyperLink: HyperlinkParams;
  NewPoll: NewPollParams;
  NewMessage: NewMessageParams | undefined;
  NewPost: NewPostParams | undefined;
  PostPreview: PostPreviewParams;
  PostReply: PostReplyParams;
  PostImagePreview: PostImagePreviewParams;
  SelectUser: undefined;
  Tags: TagsParams;
  Troubleshoot: TroubleshootParams;
  TabNav: NavigatorScreenParams<TabParamList>;
  Activity: undefined;
  AddEmail: undefined;
  ChangePassword: undefined;
  EditProfile: EditProfileParams;
  EmailAddress: undefined;
  ImagePreview: ImagePreviewParams;
  Login: LoginParams;
  Messages: undefined;
  MessageDetail: MessageDetailParams;
  Notifications: undefined;
  PostDetail: PostDetailParams;
  Preferences: undefined;
  ProfileScreen: undefined;
  Search: undefined;
  UserInformation: UserInformationParams;
  EditUserStatus: EditUserStatusParams;
  EmojiPicker: undefined;
  StackAvatar: StackAvatarModalParams;
  Poll: PollParams;
  PostDraft: undefined;
  EditPollsList: EditPollsListParams;
  AuthenticationWebView: undefined;
  Welcome: undefined;
  ChatChannelDetail: ChatChannelDetailParams;
  ThreadDetail: ThreadParams;
};

export type TabParamList = {
  Home: undefined | HomeProps;
  Profile: undefined;
  Chat: undefined;
  Draft: undefined;
};

export type RootStackRouteName = keyof RootStackParamList;
export type TabRouteName = keyof TabParamList;

export type Routes = PartialState<
  NavigationState<RootStackParamList>
>['routes'];
