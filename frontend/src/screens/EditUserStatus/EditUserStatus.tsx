import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';

import { Button, Emoji, RadioButton, Text, TextInput } from '../../core-ui';
import { makeStyles } from '../../theme';
import { CustomHeader, DateTimePicker } from '../../components';
import { StackNavProp, StackRouteProp } from '../../types';
import { errorHandlerAlert, formatDateTime, formatTime } from '../../helpers';
import { addHour } from '../../helpers/addHour';
import { useDeleteUserStatus, useEditUserStatus } from '../../hooks';
import { DEFAULT_EMOJI_STATUS } from '../../constants';

import DateTimeButton from './components/DateTimeButton';

type FormValues = {
  checked: number | undefined;
  datePicker: Date | undefined;
  status: string;
};

export default function EditUserStatus() {
  const styles = useStyles();

  const SelectionList = useMemo(
    () => [
      { id: 1, label: t('Never') },
      {
        id: 2,
        label: t('in 1 hour'),
        value: addHour({ dateString: Date.now(), hour: 1 }),
      },
      {
        id: 3,
        label: t('in 2 hours'),
        value: addHour({ dateString: Date.now(), hour: 2 }),
      },
      {
        id: 4,
        label: t('Tomorrow'),
        value: addHour({ dateString: Date.now(), hour: 24 }),
      },
      { id: 5, label: t('Custom date & time') },
    ],
    [],
  );

  const navigation = useNavigation<StackNavProp<'EditUserStatus'>>();
  const { navigate } = navigation;
  const {
    params: {
      emojiText,
      status: paramStatus,
      emojiCode = DEFAULT_EMOJI_STATUS,
      endDate,
    },
  } = useRoute<StackRouteProp<'EditUserStatus'>>();

  const { control, handleSubmit, getValues, watch } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      checked: endDate ? 5 : undefined,
      datePicker: endDate ? new Date(endDate) : undefined,
      status: paramStatus,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const selectedCheck = watch('checked');
  const status = getValues('status');
  const isCustomDate = selectedCheck === 5;

  const { deleteUserStatus, loading: deleteUserStatusLoading } =
    useDeleteUserStatus({
      onError: (error) => {
        errorHandlerAlert(error);
      },
      onCompleted: () => {
        navigate('Profile');
      },
    });
  const { editUserStatus, loading: editUserStatusLoading } = useEditUserStatus({
    onError: (error) => {
      errorHandlerAlert(error);
    },
    onCompleted: () => {
      navigate('Profile');
    },
  });

  const isLoading = deleteUserStatusLoading || editUserStatusLoading;
  const onDelete = async () => {
    await deleteUserStatus();
  };
  const onDone = handleSubmit(async (data) => {
    let selectedValue = SelectionList.find(({ id }) => id === data.checked);

    let endDate;

    if (selectedValue?.value instanceof Date) {
      endDate = selectedValue?.value.toISOString() || '';
    }

    /**
     * This condition will combine date and time from picker
     */

    if (isCustomDate && data.datePicker) {
      endDate = data.datePicker.toISOString();
    }

    await editUserStatus({
      variables: {
        endsAt: endDate,
        emoji: emojiCode,
        description: data.status,
      },
    });
  });

  const navEmojiPicker = () => {
    navigate('EmojiPicker');
  };

  const showAlert = () =>
    Alert.alert(
      t('Delete Status?'),
      t('Are you sure you want to delete your status?'),
      [
        {
          text: t('Cancel'),
          onPress: () => {},
        },
        {
          text: t('Delete'),
          onPress: onDelete,
        },
      ],
    );

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Status"
        rightTitle="Done"
        onPressRight={onDone}
        isLoading={isLoading}
        noShadow
        disabled={!status}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? undefined : 'height'}
      >
        <ScrollView contentContainerStyle={styles.flex}>
          <View style={styles.statusContainer}>
            {emojiText ? (
              <TouchableOpacity
                onPress={navEmojiPicker}
                testID="EditUserStatus:Button:Emoji"
              >
                <Text size="xxxl" style={styles.emojiStatus}>
                  {emojiText}
                </Text>
              </TouchableOpacity>
            ) : (
              <Emoji
                size="l"
                emojiCode={emojiCode}
                style={styles.emojiStatus}
                onPress={navEmojiPicker}
                testIDButton="EditUserStatus:Button:Emoji"
              />
            )}
            <View style={styles.flex}>
              <Text size="s" color="textLight" style={styles.yourStatusText}>
                Your Status
              </Text>
              <Controller
                control={control}
                name="status"
                defaultValue={paramStatus}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    testID="EditUserStatus:TextInput:Status"
                  />
                )}
              />
            </View>
          </View>
          <View style={styles.removeStatusContainer}>
            <Text>Remove Status</Text>
            {SelectionList.map(({ id, label }) => {
              return (
                <View key={id}>
                  <Controller
                    control={control}
                    name="checked"
                    defaultValue={undefined}
                    render={({ field: { onChange, value } }) => (
                      <RadioButton
                        selected={value === id}
                        onPress={() => onChange(id)}
                      >
                        <Text>{label}</Text>
                      </RadioButton>
                    )}
                  />
                  {isCustomDate && selectedCheck === id && (
                    <View style={styles.dateTimeButtonContainer}>
                      <DateTimeButton
                        label={t('Select date')}
                        text={formatDateTime(
                          getValues('datePicker')?.toISOString() || '',
                          'short',
                          false,
                        )}
                        onPress={() => {
                          setShowDatePicker(true);
                        }}
                      />
                      <DateTimeButton
                        label={t('Select time')}
                        text={formatTime({
                          dateString:
                            getValues('datePicker')?.toISOString() || '',
                          hour12: true,
                        })}
                        onPress={() => {
                          setShowTimePicker(true);
                        }}
                        style={styles.dateTimeButton}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.deleteButtonContainer}>
            <Button
              content={t('Delete Status')}
              style={styles.deleteButton}
              textColor="warnText"
              onPress={() => {
                showAlert();
              }}
              disabled={!paramStatus}
              loading={isLoading}
              testID="EditUserStatus:Button:DeleteStatus"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Controller
        control={control}
        name="datePicker"
        defaultValue={undefined}
        render={({ field: { onChange, value } }) => (
          <DateTimePicker
            isVisible={showDatePicker}
            onCancel={() => {
              setShowDatePicker(false);
            }}
            onConfirm={(date) => {
              onChange(date);
              setShowDatePicker(false);
            }}
            mode="date"
            minimumDate={new Date()}
            date={value?.toISOString()}
          />
        )}
      />
      <Controller
        control={control}
        name="datePicker"
        defaultValue={undefined}
        render={({ field: { onChange, value } }) => (
          <DateTimePicker
            isVisible={showTimePicker}
            onCancel={() => {
              setShowTimePicker(false);
            }}
            onConfirm={(date) => {
              onChange(date);
              setShowTimePicker(false);
            }}
            mode="time"
            minimumDate={new Date()}
            date={value?.toISOString()}
          />
        )}
      />
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
    marginTop: spacing.s,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiStatus: {
    marginRight: spacing.xl,
  },
  yourStatusText: {
    marginBottom: spacing.m,
  },

  removeStatusContainer: {
    paddingTop: spacing.xxl,
  },
  deleteButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: spacing.m,
  },
  dateTimeButtonContainer: {
    paddingLeft: 28,
  },
  dateTimeButton: {
    marginTop: spacing.xl,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
  },
}));
