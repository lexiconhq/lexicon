import React from 'react';
import { ScrollViewProps } from 'react-native';

import { ChipRow } from '../../core-ui';
import { useSiteSettings } from '../../hooks';
import { Channel } from '../../types';

type Props = ScrollViewProps & {
  channel: Channel;
  tags?: Array<string>;
};

export function PostGroupings(props: Props) {
  const { taggingEnabled } = useSiteSettings();

  const { channel, tags = [], ...scrollViewProps } = props;

  const channelChip = {
    content: channel.name,
    decorationColor: `#${channel.color}`,
  };

  const items = !taggingEnabled
    ? [channelChip]
    : [channelChip, ...tags.map((content) => ({ content }))];

  return <ChipRow items={items} {...scrollViewProps} />;
}
