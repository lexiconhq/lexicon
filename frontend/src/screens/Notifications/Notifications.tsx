import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActionSheetIOS,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
} from 'react-native';

import { client } from '../../api/client';
import {
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
} from '../../components';
import { Text } from '../../core-ui';
import { NotificationDocument } from '../../generatedAPI/server';
import { errorHandler, notificationHandler } from '../../helpers';
import { useMarkRead, useNotification } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import {
  Notification as NotificationDataType,
  RootStackParamList,
  StackNavProp,
} from '../../types';
import { useDevice } from '../../utils';

import NotificationItem from './components/NotificationItem';

export default function Notifications() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { isTabletLandscape } = useDevice();

  const ios = Platform.OS === 'ios';

  const { navigate } = useNavigation<StackNavProp<'Notifications'>>();

  const navToPostDetail = (
    postDetailParams: RootStackParamList['PostDetail'],
  ) => {
    navigate('PostDetail', postDetailParams);
  };

  const navToMessageDetail = (
    messageDetailParams: RootStackParamList['MessageDetail'],
  ) => {
    navigate('MessageDetail', messageDetailParams);
  };

  const navToUserInformation = (
    userInformationParams: RootStackParamList['UserInformation'],
  ) => {
    navigate('UserInformation', userInformationParams);
  };

  const [page, setPage] = useState<number>(1);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showMore, setShowMore] = useState<boolean>(false);
  const [loadMorePolicy, setLoadMorePolicy] = useState<boolean>(false);

  const { data, loading, error, refetch, fetchMore } = useNotification({
    variables: { page },
    onError: (error) => {
      setErrorMsg(errorHandler(error, true));
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: loadMorePolicy ? 'cache-first' : 'no-cache',
  });

  const { markAsRead, loading: markAsReadLoading } = useMarkRead({
    onError: () => {},
  });

  /**
   * NOTE: Earlier, this file contained the functionality to fetch the detail response for a given Discourse badge.
   * It was removed because we weren't using it.
   * This was a feature that was specifically not supported in Lexicon v1, and we haven't yet scheduled it in our current development phase.
   *
   * If we later want to implement functionality with badges, the code that was removed is accessible at this commit: https://github.com/kodefox/lexicon/pull/984
   */

  const onRefresh = () => {
    setPage(1);
    refetch();
  };

  const onPressMore = () => {
    if (ios) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Mark All as Read', 'Cancel'],
          cancelButtonIndex: 1,
        },
        async (btnIndex) => {
          if (btnIndex === 0) {
            await markAsRead();
            onRefresh();
          }
        },
      );
    } else {
      setShowMore(true);
    }
  };

  let rawNotifications = data?.notificationQuery.notifications ?? [];
  let handledNotifications = notificationHandler(
    rawNotifications,
    navToPostDetail,
    navToMessageDetail,
    navToUserInformation,
  );

  useEffect(() => {
    if (
      data?.notificationQuery.totalRowsNotifications ===
      handledNotifications.length
    ) {
      setIsLoadMore(false);
    } else {
      setIsLoadMore(true);
    }
  }, [data, handledNotifications]);

  if (error) {
    return <LoadingOrError message={errorMsg} />;
  }

  if (handledNotifications.length < 1) {
    if (loading) {
      return <LoadingOrError loading />;
    }
    if (data?.notificationQuery.totalRowsNotifications === 0) {
      return <LoadingOrError message={t('No Notifications available')} />;
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead({
        variables: { markReadInput: { id: notificationId } },
      });

      /**
       * change value notification seen to true
       */

      const newDataNotification = data?.notificationQuery?.notifications?.map(
        (data) => {
          if (data.id === notificationId && !data.seen) {
            return { ...data, seen: true };
          }
          return data;
        },
      );

      /**
       * Update the Apollo Client cache for notifications list if change seen data
       *  */

      client.writeQuery({
        query: NotificationDocument,
        variables: { page },
        data: {
          notificationQuery: {
            notifications: newDataNotification,
            totalRowsNotifications:
              data?.notificationQuery.totalRowsNotifications,
            seenNotificationId: data?.notificationQuery.seenNotificationId,
            loadMoreNotifications:
              data?.notificationQuery.loadMoreNotifications,
          },
        },
      });
    } catch (error) {
      onRefresh();
    }
  };

  const loadMore = () => {
    setLoadMorePolicy(true);
    if (!isLoadMore || loading) {
      return;
    }
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMore({
      variables: { page: nextPage },
    }).then(() => {
      setLoadMorePolicy(false);
    });
  };

  const getItem = (data: Array<NotificationDataType>, index: number) =>
    data[index];

  const getItemCount = (data: Array<NotificationDataType>) => data.length;

  const getItemLayout = (data: NotificationDataType, index: number) => ({
    length: 78.7,
    offset: 78.7 * index,
    index,
  });

  const keyExtractor = ({ id }: NotificationDataType) => `notif-${id}`;

  function renderItem({ item }: { item: NotificationDataType }) {
    const {
      id,
      topicId,
      name,
      message,
      createdAt,
      seen,
      onPress,
      notificationType,
    } = item;
    return (
      <NotificationItem
        name={name}
        message={message}
        createdAt={createdAt}
        type={notificationType}
        seen={seen}
        onPress={() => {
          onPress(item.badgeId ? item.badgeId : topicId);
          handleMarkAsRead(id);
        }}
      />
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <CustomHeader
          title={t('Notifications')}
          rightIcon="More"
          onPressRight={onPressMore}
          isLoading={markAsReadLoading}
          hideHeaderLeft={isTabletLandscape}
        />
        <VirtualizedList
          data={handledNotifications}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={colors.loading}
            />
          }
          getItem={getItem}
          getItemCount={getItemCount}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          onEndReachedThreshold={0.1}
          onEndReached={loadMore}
          ListFooterComponent={
            <FooterLoadingIndicator isHidden={!isLoadMore} />
          }
          style={styles.notificationContainer}
        />
      </SafeAreaView>
      <TouchableOpacity>
        {!ios && data && (
          <Modal visible={showMore} animationType="fade" transparent={true}>
            <TouchableWithoutFeedback onPressOut={() => setShowMore(false)}>
              <View style={styles.androidModalContainer}>
                <TouchableOpacity
                  style={styles.modalButtonContainer}
                  onPress={() => {
                    markAsRead();
                    onRefresh();
                    setShowMore(false);
                  }}
                >
                  <Text style={styles.modalText} color="pureBlack" size="l">
                    {t('Mark All as Read')}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </TouchableOpacity>
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  notificationContainer: {
    flex: 1,
    width: '100%',
  },
  androidModalContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalButtonContainer: {
    paddingLeft: spacing.xl,
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.pureWhite,
  },
  modalText: {
    paddingVertical: spacing.xl,
  },
}));
