import { FUNCTIONAL_COLORS } from './theme';

export const DEFAULT_POST_ID = 0;
export const FIRST_POST_NUMBER = 1;
export const MAX_POST_COUNT_PER_REQUEST = 20;

export const DEFAULT_CHANNEL = {
  id: 0,
  color: '0088CC',
  description: t(
    `Topics that don't need a category, or don't fit into any other existing category.`,
  ),
  name: t('Uncategorized'),
};

const color = FUNCTIONAL_COLORS.primary.slice(1);

// TODO: We should eventually remove this placeholder ID as a means to
// communicate no channel filter, and come up with a better solution.
const NO_CHANNEL_FILTER_ID = Number.MAX_VALUE;

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
