import React from 'react';
import { ScrollViewProps } from 'react-native';

import { ChipRow } from '../../core-ui';
import { normalizeTopicTags } from '../../helpers';
import { useSiteSettings } from '../../hooks';
import { Channel } from '../../types';

type Props = ScrollViewProps & {
  channel: Channel;
  tags?: Array<string>;
  onPressChannel?: (channelId: number) => void;
};

export function PostGroupings(props: Props) {
  const { taggingEnabled } = useSiteSettings();

  const { channel, tags = [], onPressChannel, ...scrollViewProps } = props;

  const channelChip = {
    content: channel.name,
    decorationColor: `#${channel.color}`,
    onPress: onPressChannel
      ? () => onPressChannel(channel.id)
      : undefined,
  };

  const tagNames = normalizeTopicTags(tags);
  const items = !taggingEnabled
    ? [channelChip]
    : [channelChip, ...tagNames.map((content) => ({ content }))];

  return <ChipRow items={items} {...scrollViewProps} />;
}
