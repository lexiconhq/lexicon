import { FUNCTIONAL_COLORS } from './theme';

export const DEFAULT_CHANNEL = {
  id: 0,
  color: '0088CC',
  description: t(
    `Topics that don't need a category, or don't fit into any other existing category.`,
  ),
  name: t(`Uncategorized`),
};

const color = FUNCTIONAL_COLORS.primary.slice(1);

export const ALL_CHANNEL = {
  id: 999,
  color,
  description: t(`Browse topics across all channels`),
  name: t(`All Channels`),
};
