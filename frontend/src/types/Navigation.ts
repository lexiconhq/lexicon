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

import { NewPost, ReplyPost } from './Post';
import {
  SelectedUserProps,
  StackAvatarUser,
  UserDetail,
  UserMessageProps,
} from './Types';

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
  imageUri: string;
  message: string;
};

type PostImagePreviewParams = {
  imageUri: string;
  title?: string;
  prevScreen: 'NewPost' | 'PostReply' | 'NewMessage';
};

export type MessageDetailParams = {
  id: number;
  postNumber: number;
  emptied?: boolean;
  hyperlinkUrl: string;
  hyperlinkTitle: string;
  source?: 'deeplink';
};

type NewMessageParams = {
  listOfUser?: Array<SelectedUserProps>;
  users?: Array<string>;
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
  postData: NewPost | ReplyPost;
  focusedPostNumber?: number;
  editPostId?: number;
  editTopicId?: number;
  editedUser?: EditedUser;
};

type NewMessagePreviewParams = {
  title: string;
  raw: string;
  targetRecipients: Array<string>;
  userList: Array<UserMessageProps>;
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

type SelectUserParams = {
  listOfUser: Array<SelectedUserProps>;
  users: Array<string>;
};

type TagsParams = {
  canCreateTag: boolean;
};

type TwoFactorAuthParams = {
  email: string;
  password: string;
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

type PollParams = {
  pollIndex?: number;
  prevScreen: 'NewPost' | 'PostReply' | 'NewMessage';
};

type StackAvatarModalParams = {
  option: string;
  amountVote: number;
  users: Array<StackAvatarUser>;
};

export type RootStackParamList = {
  Channels: ChannelsParams;
  DarkMode: undefined;
  PushNotificationsPreferences: undefined;
  FlagPost: FlagPostParams;
  HyperLink: HyperlinkParams;
  Poll: PollParams;
  NewMessage: NewMessageParams;
  NewMessagePreview: NewMessagePreviewParams;
  NewPost: NewPostParams | undefined;
  PostPreview: PostPreviewParams;
  PostReply: PostReplyParams;
  PostImagePreview: PostImagePreviewParams;
  SelectUser: SelectUserParams;
  Tags: TagsParams;
  Troubleshoot: TroubleshootParams;
  TabNav: NavigatorScreenParams<TabParamList>;
  Activity: undefined;
  AddEmail: undefined;
  ChangePassword: undefined;
  EditProfile: EditProfileParams;
  EmailAddress: undefined;
  ImagePreview: ImagePreviewParams;
  Login: undefined;
  Messages: undefined;
  MessageDetail: MessageDetailParams;
  Notifications: undefined;
  PostDetail: PostDetailParams;
  Preferences: undefined;
  Profile: undefined;
  Register: undefined;
  Search: undefined;
  TwoFactorAuth: TwoFactorAuthParams;
  UserInformation: UserInformationParams;
  EditUserStatus: EditUserStatusParams;
  EmojiPicker: undefined;
  StackAvatar: StackAvatarModalParams;
};

export type TabParamList = {
  Home: undefined | HomeProps;
  Profile: undefined;
};

export type RootStackRouteName = keyof RootStackParamList;
export type TabRouteName = keyof TabParamList;

export type Routes = PartialState<
  NavigationState<RootStackParamList>
>['routes'];
