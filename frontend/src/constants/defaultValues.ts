import * as Notifications from 'expo-notifications';

import { NewPostForm } from '../types';
import { PollChartType, PollResult, PollType } from '../generated/server';

import { FUNCTIONAL_COLORS } from './theme';

export const DEFAULT_POST_ID = 0;
export const FIRST_POST_NUMBER = 1;
export const MAX_POST_COUNT_PER_REQUEST = 20;

export const DEFAULT_CHANNEL = {
  id: 1,
  color: '0088CC',
  description: t(
    `Topics that don't need a category, or don't fit into any other existing category.`,
  ),
  name: t('Uncategorized'),
};

const color = FUNCTIONAL_COLORS.primary.slice(1);

// TODO: We should eventually remove this placeholder ID as a means to
// communicate no channel filter, and come up with a better solution.
export const NO_CHANNEL_FILTER_ID = Number.MAX_VALUE;

export function isNoChannelFilter(channelId: number) {
  return channelId === NO_CHANNEL_FILTER_ID;
}

export function isChannelFilter(channelId: number) {
  return channelId !== NO_CHANNEL_FILTER_ID;
}

export const NO_CHANNEL_FILTER = {
  id: NO_CHANNEL_FILTER_ID,
  color,
  description: t(`Browse topics across all channels`),
  name: t(`All Channels`),
};

export const DEFAULT_NOTIFICATION_BEHAVIOUR = {
  shouldShowAlert: true,
  shouldPlaySound: false,
  shouldSetBadge: false,
};

export const DEFAULT_NOTIFICATION_CHANNEL_INPUT = {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
};

export const CUSTOM_HEADER_NEW_TOKEN = 'X-Prose-Latest-Token';

export const FORM_DEFAULT_VALUES: NewPostForm = {
  title: '',
  raw: '',
  tags: [],
  channelId: NO_CHANNEL_FILTER_ID,
  editPostId: undefined,
  editTopicId: undefined,
  oldContent: '',
  oldTitle: '',
  polls: [],
  messageTargetSelectedUsers: [],
  messageUsersList: [],
};
/**
 * This default use based on discourse when add user status if emoji empty
 */
export const DEFAULT_EMOJI_STATUS = 'speech_balloon';

export const RESULTS_DROPDOWN_OPTIONS = [
  { label: 'Always visible', value: PollResult.Always },
  { label: 'Only after voting', value: PollResult.OnVote },
  { label: 'When the poll is closed', value: PollResult.OnClose },
];

export const CHART_TYPE_DROPDOWN_OPTIONS = [
  { label: 'Bar', value: PollChartType.Bar },
  { label: 'Pie', value: PollChartType.Pie },
];

export const POLL_CHOICE_TYPES = [
  { label: t('Single choice'), value: PollType.Regular },
  { label: t('Multiple choice'), value: PollType.Multiple },
  { label: t('Number rating'), value: PollType.Number },
];

export const DEFAULT_MIN_CHOICE = 1;
export const DEFAULT_NUMBER_RATING_MAX_CHOICE = 20;
export const DEFAULT_NUMBER_RATING_STEP = 1;
