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
import { useNavigation } from '@react-navigation/native';

import {
  CustomHeader,
  FooterLoadingIndicator,
  LoadingOrError,
} from '../../components';
import { Text } from '../../core-ui';
import { errorHandler, notificationHandler } from '../../helpers';
import { useMarkRead, useNotification } from '../../hooks';
import { makeStyles, useTheme } from '../../theme';
import {
  Notification as NotificationDataType,
  StackNavProp,
  StackParamList,
} from '../../types';

import NotificationItem from './components/NotificationItem';

export default function Notifications() {
  const styles = useStyles();
  const { colors } = useTheme();

  const ios = Platform.OS === 'ios';

  const { navigate } = useNavigation<StackNavProp<'Notifications'>>();

  const navToPostDetail = (postDetailParams: StackParamList['PostDetail']) => {
    navigate('PostDetail', postDetailParams);
  };

  const navToMessageDetail = (
    messageDetailParams: StackParamList['MessageDetail'],
  ) => {
    navigate('MessageDetail', messageDetailParams);
  };

  const navToUserInformation = (
    userInformationParams: StackParamList['UserInformation'],
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
            refetch({ page: 1 });
          }
        },
      );
    } else {
      setShowMore(true);
    }
  };

  let rawNotifications = data?.notification.notifications ?? [];
  let handledNotifications = notificationHandler(
    rawNotifications,
    navToPostDetail,
    navToMessageDetail,
    navToUserInformation,
  );

  useEffect(() => {
    if (
      data?.notification.totalRowsNotifications === handledNotifications.length
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
    return <LoadingOrError message={t('No Notifications available')} />;
  }

  const loadMore = () => {
    setLoadMorePolicy(true);
    if (!isLoadMore || loading) {
      return;
    }
    const nextPage = page + 1;
    fetchMore({
      variables: { page: nextPage },
    }).then(() => {
      setLoadMorePolicy(false);
      setPage(nextPage);
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
    const { id, topicId, name, message, createdAt, hasIcon, seen, onPress } =
      item;

    return (
      <NotificationItem
        name={name}
        message={message}
        createdAt={createdAt}
        isMessage={hasIcon}
        seen={seen}
        onPress={() => {
          if (item.badgeId) {
            onPress(item.badgeId);
          } else {
            onPress(topicId);
            markAsRead({ variables: { notificationId: id } }).then(() =>
              refetch({ page: 1 }),
            );
          }
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
        />
        <VirtualizedList
          data={handledNotifications}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          getItem={getItem}
          getItemCount={getItemCount}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
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
                    markAsRead().then(() => refetch({ page: 1 }));
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
