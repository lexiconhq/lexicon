import React, { useEffect, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Modal,
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ActivityIndicator, Divider, Icon, Text } from '../../../core-ui';
import { PROFILE } from '../../../graphql/server/profile';
import { errorHandlerAlert, useStorage } from '../../../helpers';
import { useDeleteEmail, useSetPrimaryEmail } from '../../../hooks';
import { makeStyles, useTheme } from '../../../theme';

type Props = TouchableOpacityProps & {
  emailAddress: string;
  type: 'PRIMARY' | 'SECONDARY' | 'UNCONFIRMED';
  onSetLoading: (value: boolean) => void;
};

const SecondaryEmailOptions = ['Set as primary', 'Delete', 'Cancel'];
const UnconfirmedEmailOptions = ['Delete', 'Cancel'];

export default function EmailAddressItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { emailAddress, type, onSetLoading } = props;

  const [showOptions, setShowOptions] = useState(false);

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const ios = Platform.OS === 'ios';

  const { setPrimaryEmail, loading: setPrimaryEmailLoading } =
    useSetPrimaryEmail({
      variables: {
        selectedEmail: emailAddress,
        username,
      },
      onError: (error) => {
        errorHandlerAlert(error);
        onSetLoading(false);
      },
      refetchQueries: [
        {
          query: PROFILE,
          variables: { username },
        },
      ],
    });

  const { deleteEmail, loading: deleteEmailLoading } = useDeleteEmail({
    variables: {
      selectedEmail: emailAddress,
      username,
    },
    onCompleted: () => {
      Alert.alert(
        'Success!',
        t('{emailAddress} has been successfully deleted', { emailAddress }),
        [{ text: t('Got it') }],
      );
    },
    onError: (error) => {
      errorHandlerAlert(error);
      onSetLoading(false);
    },
    refetchQueries: [
      {
        query: PROFILE,
        variables: { username },
      },
    ],
  });

  useEffect(() => {
    if (setPrimaryEmailLoading || deleteEmailLoading) {
      onSetLoading(true);
    }
  }, [setPrimaryEmailLoading, deleteEmailLoading, onSetLoading]);

  const onSetPrimaryEmail = () => {
    if (!ios) {
      setShowOptions(false);
    }
    setPrimaryEmail();
  };

  const onDeleteEmail = () => {
    if (!ios) {
      setShowOptions(false);
    }
    deleteEmail();
  };

  const showAlert = () =>
    Alert.alert(
      t('Delete Email?'),
      t('Are you sure you want to delete this email address?'),
      [
        {
          text: t('Cancel'),
          onPress: () => {
            if (!ios) {
              setShowOptions(false);
            }
          },
        },
        {
          text: t('Delete'),
          onPress: onDeleteEmail,
        },
      ],
    );

  const onPressMoreVert = () => {
    if (ios) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options:
            type === 'SECONDARY'
              ? SecondaryEmailOptions
              : UnconfirmedEmailOptions,
          cancelButtonIndex: type === 'SECONDARY' ? 2 : 1,
          destructiveButtonIndex: type === 'SECONDARY' ? 1 : 0,
        },
        (btnIndex) => {
          if (btnIndex === 0 && type === 'SECONDARY') {
            onSetPrimaryEmail();
          } else if (
            (btnIndex === 0 && type === 'UNCONFIRMED') ||
            (btnIndex === 1 && type === 'SECONDARY')
          ) {
            showAlert();
          }
        },
      );
    } else {
      setShowOptions(true);
    }
  };

  return (
    <>
      <>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text>{emailAddress}</Text>
            {type === 'PRIMARY' && (
              <Text size="s" color="textLight" style={styles.primary}>
                {t('Primary Email Address')}
              </Text>
            )}
            {type === 'UNCONFIRMED' && (
              <Text size="s" color="textLight" style={styles.primary}>
                {t('Unverified')}
              </Text>
            )}
          </View>
          {type !== 'PRIMARY' &&
            (deleteEmailLoading ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity
                onPress={onPressMoreVert}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Icon name="MoreVert" color={colors.textLighter} />
              </TouchableOpacity>
            ))}
        </View>
        <Divider />
      </>
      {!ios && (
        <Modal visible={showOptions} animationType="fade" transparent={true}>
          <TouchableWithoutFeedback onPressOut={() => setShowOptions(false)}>
            <View style={styles.androidModalContainer}>
              {type === 'SECONDARY' && (
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={onSetPrimaryEmail}
                >
                  <Text style={styles.text} color="pureBlack" size="s">
                    {t('Set as primary')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={showAlert}
              >
                <Text style={styles.text} color="error" size="s">
                  {t('Delete')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    height: 78,
    paddingHorizontal: spacing.xxl,
  },
  content: {
    flexDirection: 'column',
  },
  primary: {
    paddingTop: spacing.m,
  },
  androidModalContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  buttonContainer: {
    paddingLeft: spacing.xl,
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.pureWhite,
  },
  text: {
    paddingVertical: spacing.xl,
  },
}));
