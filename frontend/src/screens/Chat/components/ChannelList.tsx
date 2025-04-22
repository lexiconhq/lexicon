import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { RefreshControl, VirtualizedList } from 'react-native';

import { getChatChannelsPathBuilder } from '../../../api/pathBuilder';
import { FooterLoadingIndicator } from '../../../components';
import {
  ChannelList as ChannelType,
  GetChatChannelsDocument,
} from '../../../generatedAPI/server';
import { errorHandlerAlert } from '../../../helpers';
import {
  useJoinChannel,
  useLeaveChannel,
  useMarkReadChat,
} from '../../../hooks';
import { makeStyles, useTheme } from '../../../theme';
import {
  ChannelListOutput,
  RootStackParamList,
  StackNavProp,
} from '../../../types';

import ChannelItem from './ChannelItem';

type Props = {
  data: ChannelListOutput;
  onLoadMore: () => void;
  hasMoreChannel: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

export default function ChannelList(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const { navigate } = useNavigation<StackNavProp<'TabNav'>>();

  const { data, onLoadMore, hasMoreChannel, refreshing, onRefresh } = props;

  /**
   * adjust param based what need send to ChatChannelDetail scene
   */
  const navigateChatChannelDetail = ({
    channelId,
    channelTitle,
    lastMessageId,
    memberCount,
    threadEnabled,
  }: RootStackParamList['ChatChannelDetail']) => {
    navigate('ChatChannelDetail', {
      channelId,
      channelTitle,
      lastMessageId,
      memberCount,
      threadEnabled,
    });
  };

  const { joinChannel } = useJoinChannel({
    onError: (error) => {
      errorHandlerAlert(error);
    },
    refetchQueries: [
      {
        query: GetChatChannelsDocument,
        variables: {
          getChatChannelsPath: getChatChannelsPathBuilder,
          limit: 30,
        },
      },
    ],
  });

  const { leaveChannel } = useLeaveChannel({
    onError: (error) => {
      errorHandlerAlert(error);
    },
    update: (cache, _, { variables }) => {
      variables;
      cache.modify({
        id: `ChannelList:${variables?.channelId}`,
        fields: {
          // update data cache isFollowing into false after mutation complete
          isFollowingChannel: () => {
            return false;
          },
        },
      });
    },
  });

  const { markReadChat } = useMarkReadChat({
    update: (cache, _, { variables }) => {
      variables;
      cache.modify({
        id: `ChannelList:${variables?.channelId}`,
        fields: {
          // update data cache lastReadMessageId into last message in chat after mutation complete
          lastReadMessageId: (data) => {
            return variables?.markReadChatInput.messageId || data;
          },
        },
      });
    },
  });

  const getItem = (data: ChannelListOutput, index: number) => data[index];

  const getItemCount = (data: ChannelListOutput) => data.length;

  const keyExtractor = ({ id }: ChannelType) => `channel-${id}`;

  const renderItem = ({ item }: { item: ChannelType }) => {
    const {
      id,
      canJoinChannel,
      isFollowingChannel,
      lastMessageId,
      lastReadMessageId,
      title,
      membershipsCount,
      threadingEnabled,
    } = item;
    const navigate = () => {
      navigateChatChannelDetail({
        channelId: id,
        channelTitle: title,
        lastMessageId: lastMessageId || undefined,
        memberCount: membershipsCount,
        threadEnabled: threadingEnabled,
      });
    };
    const canJoin = canJoinChannel && isFollowingChannel === false;
    const unSeen = isFollowingChannel
      ? lastMessageId
        ? lastMessageId !== lastReadMessageId
        : false
      : false;
    const onPressButton = async () => {
      if (canJoin) {
        await joinChannel({ variables: { channelId: id } });
        navigate();
      } else {
        leaveChannel({ variables: { channelId: id } });
      }
    };

    const onPressItem = () => {
      // mark as read if unseen
      if (unSeen && lastMessageId) {
        markReadChat({
          variables: {
            channelId: id,
            markReadChatInput: {
              messageId: lastMessageId,
            },
          },
        });
      }
      navigate();
    };

    return (
      <ChannelItem
        data={item}
        testId={`Channel:ChannelItem:${item.id}`}
        onPressButton={onPressButton}
        onPressItem={onPressItem}
        canJoin={canJoin}
        unseen={unSeen}
      />
    );
  };

  return (
    <VirtualizedList
      testID="Channel:List"
      data={data}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.loading}
        />
      }
      getItem={getItem}
      getItemCount={getItemCount}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReachedThreshold={0.1}
      onEndReached={onLoadMore}
      ListFooterComponent={
        <FooterLoadingIndicator isHidden={!hasMoreChannel} />
      }
      style={styles.channelContainer}
    />
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  channelContainer: {
    flex: 1,
    width: '100%',
    marginTop: spacing.l,
  },
}));
