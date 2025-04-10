import { aboutPatcher } from './about';
import { categoryListPatcher } from './categoryList';
import { changeProfileOutputPatcher } from './changeProfileOutput';
import { lookupUrlOutputPatcher } from './lookupUrls';
import { pollActionPatcher } from './pollActionOutput';
import { PostPatcher } from './post';
import { postCookedPatcher, postRawPatcher } from './postRaw';
import { privateMessageDetailOutputPatcher } from './privateMessageDetailOutput';
import { privateMessageOutputPatcher } from './privateMessageOutput';
import { profileOutputPatcher } from './profileOutput';
import { searchOutputPatcher } from './searchOutput';
import { searchUserOutputPatcher } from './searchUserOutput';
import { SiteSettingsOutputPatcher, siteOutputPatcher } from './siteOutput';
import { topicDetailOutputPatcher } from './topicDetailOutput';
import { topicsOutputPatcher } from './topicsOutput';
import { uploadOutputPatcher } from './uploadOutput';
import { userActionsPatcher } from './userActions';
import { userUnreadNotificationsPatcher } from './userUnreadNotifications';
import { PollVoteOutputPatcher } from './votePollOutput';

export const typePatchers = {
  About: aboutPatcher,
  CategoryList: categoryListPatcher,
  ChangeProfileOutput: changeProfileOutputPatcher,
  PollVoteOutput: PollVoteOutputPatcher,
  Post: PostPatcher,
  PostCooked: postCookedPatcher,
  PostRaw: postRawPatcher,
  PrivateMessageDetailOutput: privateMessageDetailOutputPatcher,
  PrivateMessageOutput: privateMessageOutputPatcher,
  ProfileOutput: profileOutputPatcher,
  LookupUrl: lookupUrlOutputPatcher,
  SearchOutput: searchOutputPatcher,
  SearchUserOutput: searchUserOutputPatcher,
  SiteOutput: siteOutputPatcher,
  SiteSettingsOutput: SiteSettingsOutputPatcher,
  TogglePollStatusOutput: pollActionPatcher,
  TopicDetailOutput: topicDetailOutputPatcher,
  TopicsOutput: topicsOutputPatcher,
  UndoPollVoteOutput: pollActionPatcher,
  UploadOutput: uploadOutputPatcher,
  UserActions: userActionsPatcher,
  UserUnreadNotifications: userUnreadNotificationsPatcher,
};
