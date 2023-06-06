import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp as RoutePropBase,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { NetworkStatus, WithRequestFailed } from '../components';

import { NewPost, ReplyPost } from './Post';
import { SelectedUserProps, UserDetail, UserMessageProps } from './Types';

export type RootStackNavProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

export type StackNavProp<T extends keyof StackParamList> =
  CompositeNavigationProp<
    StackNavigationProp<StackParamList, T>,
    StackNavigationProp<RootStackParamList>
  >;

export type TabNavProp<T extends keyof TabParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, T>,
  CompositeNavigationProp<
    StackNavigationProp<StackParamList>,
    StackNavigationProp<RootStackParamList>
  >
>;

export type RootStackRouteProp<T extends keyof RootStackParamList> =
  RoutePropBase<RootStackParamList, T>;

export type StackRouteProp<T extends keyof StackParamList> = RoutePropBase<
  StackParamList,
  T
>;

export type TabRouteProp<T extends keyof TabParamList> = RoutePropBase<
  TabParamList,
  T
>;

type ChannelsParams = {
  prevScreen: 'Home' | 'NewPost';
  selectedChannelId: number;
};

type EditProfileParams = {
  user: UserDetail;
};

type FlagPostParams = {
  postId: number;
  isPost?: boolean;
  flaggedAuthor?: string;
};

export type HomeProps = { selectedChannelId?: number; backToTop?: boolean };

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
  selectedChannelId?: number;
  selectedTagsIds?: Array<string>;
  hyperlinkUrl?: string;
  hyperlinkTitle?: string;
  oldTitle?: string;
  oldContent?: string;
  oldChannel?: number;
  oldTags?: Array<string>;
  editPostId?: number;
  editTopicId?: number;
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
  selectedChannelId?: number;
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
  selectedTagsIds: Array<string>;
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

export type RootStackParamList = {
  Main: NavigatorScreenParams<StackParamList>;
  Channels: ChannelsParams;
  DarkMode: undefined;
  FlagPost: FlagPostParams;
  HyperLink: HyperlinkParams;
  NewMessage: NewMessageParams;
  NewMessagePreview: NewMessagePreviewParams;
  NewPost: NewPostParams;
  PostPreview: PostPreviewParams;
  PostReply: PostReplyParams;
  PostImagePreview: PostImagePreviewParams;
  SelectUser: SelectUserParams;
  Tags: TagsParams;
  Troubleshoot: TroubleshootParams;
};

export type StackParamList = {
  TabNav: NavigatorScreenParams<TabParamList>;
  Activity: undefined;
  AddEmail: undefined;
  ChangePassword: undefined;
  EditProfile: EditProfileParams;
  EmailAddress: undefined;
  ImagePreview: ImagePreviewParams;
  InstanceLoading: undefined;
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
};

export type TabParamList = {
  Home: undefined | HomeProps;
  Profile: undefined;
};

export type RootStackRouteName = keyof RootStackParamList;
export type StackRouteName = keyof StackParamList;
export type TabRouteName = keyof TabParamList;
