import { DEFAULT_CHANNEL } from '../constants';
import { Channel } from '../types';

type findChannelByCategoryIdParams = {
  categoryId?: number | null;
  channels?: Array<Channel> | null;
};
export function findChannelByCategoryId({
  categoryId,
  channels,
}: findChannelByCategoryIdParams): Channel {
  return (
    channels?.find((channel) => channel.id === categoryId) ?? DEFAULT_CHANNEL
  );
}
