import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { LoadingOrError, SegmentedControl } from '../../components';
import { CHAT_CHANNEL_DETAIL_PAGE_SIZE } from '../../constants';
import { Text } from '../../core-ui';
import {
  ChatChannelStatus,
  GetChatChannelsQuery,
  GetChatChannelsQueryVariables,
} from '../../generatedAPI/server';
import { errorHandler } from '../../helpers';
import { useLazyGetChatChannels } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import { ChannelListOutput, StackNavProp } from '../../types';

import { ChannelList, Search } from './components';

const title = t('Live Chat');

let chatSegmentedOption = [
  { index: 0, name: ChatChannelStatus.All, label: t('All') },
  { index: 1, name: ChatChannelStatus.Open, label: t('Open') },
  { index: 2, name: ChatChannelStatus.Closed, label: t('Closed') },
];

type ChatOption = typeof chatSegmentedOption[number];

const FIRST_OFFSET = 0;

export default function ChannelChat() {
  const styles = useStyles();
  const { spacing } = useTheme();
  const { addListener } = useNavigation<StackNavProp<'TabNav'>>();

  const [channelData, setChannelData] = useState<ChannelListOutput>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<{
    index: number;
    value: ChatChannelStatus;
  }>({ index: 0, value: ChatChannelStatus.All });
  const [width, setWidth] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(FIRST_OFFSET);
  const [hasMoreChannels, setHasMoreChannels] = useState(false);

  let isFetchingMoreChannels = useRef(false);

  const onChangeValue = useCallback(
    (text: string) => {
      setSearchValue(text);
    },
    [setSearchValue],
  );

  const {
    getChatChannels,
    error: errorChannels,
    data: channelDataList,
    fetchMore: fetchMoreChannels,
    refetch: refetchChannels,
  } = useLazyGetChatChannels({
    variables: {
      offset: offset,
      filter: searchValue,
      status: selectedOption.value,
      limit: CHAT_CHANNEL_DETAIL_PAGE_SIZE,
    },
    onError: () => {
      setRefreshing(false);
      setLoading(false);
    },
    onCompleted: () => {
      setLoading(false);
    },
  });

  const getData = useCallback(
    (variables: GetChatChannelsQueryVariables) => {
      getChatChannels({
        variables: { ...variables, limit: CHAT_CHANNEL_DETAIL_PAGE_SIZE },
      });
    },
    [getChatChannels],
  );

  const setData = useCallback(({ getChatChannels }: GetChatChannelsQuery) => {
    const channels = getChatChannels?.channels;
    if (channels) {
      setChannelData(getChatChannels?.channels || []);
    }
    // Check if there is more data available by determining if the total number of channels
    // is divisible by the defined LIMIT (e.g., 30, 60, 90, etc.). If the total fetched channels
    // are not divisible by LIMIT (e.g., 31), it means there are no additional channels to fetch.
    // This calculation is necessary because Discourse does not return the total number
    // of channels available for the user, unlike topics.
    setHasMoreChannels(
      channels
        ? channels.length % CHAT_CHANNEL_DETAIL_PAGE_SIZE === 0 &&
            channels.length !== 0
        : false,
    );
  }, []);

  const onSegmentedControlItemPress = ({ index, name }: ChatOption) => {
    setSelectedOption({ index, value: name });
    const variables: GetChatChannelsQueryVariables = {
      status: name,
      filter: searchValue,
      offset: FIRST_OFFSET,
    };

    setChannelData([]);
    setOffset(FIRST_OFFSET);
    getData(variables);
  };

  useEffect(() => {
    let unsubscribe;
    unsubscribe = addListener('focus', () => {
      const variables: GetChatChannelsQueryVariables = {
        status: selectedOption.value,
        filter: searchValue,
        offset,
      };

      getData(variables);
    });

    return unsubscribe;
  }, [addListener, selectedOption.value, searchValue, offset, getData]);

  const onSearchDebounced = useDebouncedCallback(() => {
    setOffset(FIRST_OFFSET);
    getData({
      status: selectedOption.value,
      filter: searchValue,
      offset: FIRST_OFFSET,
    });
  }, 500);

  useEffect(() => {
    onSearchDebounced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  /**
   * This condition handles the scenario where, during the initial fetch, Apollo does not yet have cached data.
   * When a filter (e.g., changing the status) is applied, Apollo returns cached data based on the filter criteria.
   * Subsequent fetches will already have data in the cache. However, using the `loading` value from the hook
   * will still return `true` because it reflects the ongoing fetch status rather than the presence of cached data.
   */
  useEffect(() => {
    if (channelDataList) {
      setData(channelDataList);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [setData, channelDataList]);

  const loadMore = async () => {
    if (
      !hasMoreChannels ||
      isFetchingMoreChannels.current ||
      !fetchMoreChannels
    ) {
      return;
    }
    const nextOffset = offset + 10;
    const variables: GetChatChannelsQueryVariables = {
      status: selectedOption.value,
      filter: searchValue,
      offset: nextOffset,
    };

    try {
      isFetchingMoreChannels.current = true;
      let result = await fetchMoreChannels({ variables });
      isFetchingMoreChannels.current = false;
      if (result.data.getChatChannels?.channels.length === 0) {
        setHasMoreChannels(false);
      } else {
        setOffset(nextOffset);
      }
      setLoading(false);
    } catch (error) {
      isFetchingMoreChannels.current = false;
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setOffset(FIRST_OFFSET);
    refetchChannels().finally(() => setRefreshing(false));
  };

  const content = () => {
    if (loading) {
      return <LoadingOrError loading />;
    }
    if (errorChannels) {
      return (
        <LoadingOrError
          message={errorHandler(errorChannels, true)}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      );
    }
    return (
      <ChannelList
        data={channelData}
        onLoadMore={loadMore}
        hasMoreChannel={hasMoreChannels}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        let { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
    >
      <View style={styles.statusBar} />

      <View style={styles.titleContainer}>
        <Text
          numberOfLines={1}
          variant="semiBold"
          size="l"
          style={styles.title}
        >
          {title}
        </Text>
      </View>
      <Search
        placeholder={t('Search')}
        value={searchValue}
        onChangeText={onChangeValue}
      />
      <SegmentedControl
        values={chatSegmentedOption}
        labelExtractor={(item: ChatOption) => item.label}
        width={width}
        onItemPress={onSegmentedControlItemPress}
        selectedIndex={selectedOption.index}
        valuePaddingScene={spacing.xl}
      />
      {content()}
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  statusBar: {
    paddingTop: Constants.statusBarHeight,
    paddingBottom: spacing.m,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
}));
