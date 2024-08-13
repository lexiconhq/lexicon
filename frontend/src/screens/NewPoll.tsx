import React, { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form';

import {
  CustomHeader,
  DateTimePicker,
  HeaderItem,
  ModalHeader,
  Dropdown,
  DropdownTextInput,
} from '../components';
import { Button, Icon, TextInput, Text, RadioButton } from '../core-ui';
import { makeStyles, useTheme } from '../theme';
import {
  PollFormContextValues,
  PollFormValues,
  RootStackNavProp,
  RootStackRouteProp,
} from '../types';
import {
  CHART_TYPE_DROPDOWN_OPTIONS,
  RESULTS_DROPDOWN_OPTIONS,
  POLL_CHOICE_TYPES,
  DEFAULT_MIN_CHOICE,
  DEFAULT_NUMBER_RATING_MAX_CHOICE,
  DEFAULT_NUMBER_RATING_STEP,
  FORM_DEFAULT_VALUES,
} from '../constants';
import {
  changeListNumberOption,
  getListNumberStep,
  PollValueOutOfRange,
  PollValueRequired,
  formatDateTime,
  formatTime,
  generatePollMarkdown,
  parseInt,
  errorHandlerAlert,
  DuplicatePollOptionsError,
} from '../helpers';
import { useReplyPost, useSiteSettings } from '../hooks';
import { PollType } from '../generated/server';

export default function NewPoll() {
  const styles = useStyles();
  const { colors } = useTheme();

  const navigation = useNavigation<RootStackNavProp<'NewPoll'>>();
  const { navigate, goBack } = navigation;
  let { params } = useRoute<RootStackRouteProp<'NewPoll'>>();

  const { groups } = useSiteSettings({
    fetchPolicy: 'network-only',
  });

  const {
    control,
    getValues: getPollValues,
    setValue: setPollValues,
    watch: watchPollValues,
    reset: resetPollValues,
    handleSubmit,
    formState: { errors },
    clearErrors,
    trigger,
  } = useForm<PollFormValues>({
    defaultValues: {
      title: undefined,
      minChoice: DEFAULT_MIN_CHOICE,
      maxChoice: DEFAULT_MIN_CHOICE,
      step: DEFAULT_NUMBER_RATING_STEP,
      pollOptions: [{ option: '' }],
      results: 0,
      chartType: 0,
      groups: [],
      closeDate: undefined,
      isPublic: false,
    },
    mode: 'onChange',
  });

  const [pollChoiceState, setPollChoice] = useState(POLL_CHOICE_TYPES[0].value);
  const [showAdvancedSetting, setShowAdvancedSetting] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [neverClosePoll, setNeverClosePoll] = useState(
    !getPollValues('closeDate'),
  );

  const {
    fields: pollOptions,
    append,
    remove,
    replace,
  } = useFieldArray({ control, name: 'pollOptions' });
  const { setValue, getValues, reset: resetForm } = useFormContext();

  const { reply, loading: replyMessageLoading } = useReplyPost({
    onCompleted: ({ reply: { postNumber } }) => {
      navigate('MessageDetail', {
        id: params.messageTopicId || 0,
        postNumber,
        emptied: true,
        hyperlinkUrl: '',
        hyperlinkTitle: '',
      });
      resetForm(FORM_DEFAULT_VALUES);
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
  });

  useEffect(() => {
    const polls: Array<PollFormContextValues> = getValues('polls');

    let findPollByIndex =
      params && params.pollIndex !== undefined && polls.length > 0
        ? polls[params.pollIndex]
        : undefined;

    if (findPollByIndex) {
      const { pollChoiceType, pollOptions, chartType, ...data } =
        findPollByIndex;
      resetPollValues({
        ...data,
        pollOptions:
          pollChoiceType === 'number' ? [{ option: '' }] : pollOptions,
        chartType: chartType || 0,
        step: data.step || DEFAULT_NUMBER_RATING_STEP,
        minChoice: data.minChoice || DEFAULT_MIN_CHOICE,
      });
      setPollChoice(pollChoiceType);
      setNeverClosePoll(!data.closeDate);
    }
  }, [getValues, params, resetPollValues]);

  let pollTypeNumber = pollChoiceState === PollType.Number;
  let pollTypeMultiple = pollChoiceState === PollType.Multiple;
  const ios = Platform.OS === 'ios';
  let watchPollOptions = watchPollValues('pollOptions');

  /**
   * isPollOptionsValid checks the validity of poll options.
   * If indexParam is provided, it checks if the specified text input matches with any other options.
   * If indexParam is not provided, it checks if there are any duplicate options in the list.
   */

  let isPollOptionsValid = useCallback(
    (indexParam?: number) => {
      const cleanedPollOptions = watchPollOptions.map((item) =>
        typeof item === 'string' ? item.trim() : item.option.trim(),
      );

      const isIndexParamDefined = typeof indexParam === 'number';

      const duplicates = cleanedPollOptions.filter((item, index) =>
        isIndexParamDefined
          ? item === cleanedPollOptions[indexParam] && index !== indexParam
          : cleanedPollOptions.indexOf(item) !== index,
      );
      return duplicates.length === 0;
    },
    [watchPollOptions],
  );

  let isPollValid = useCallback(() => {
    if (pollTypeNumber) {
      return true;
    }

    let isValid = watchPollOptions.length !== 0;

    // We need to check for two different types because pollOptions
    // can contains a string or an object. For example, when the option
    // is not an empty string it will return as a string (ex. ['option']),
    // but if the option is an empty string it will return as an object with an id
    // (ex. [{option: '', id: 'abc123'}])
    if (typeof watchPollOptions[0] === 'string') {
      isValid = isValid && watchPollOptions[0] !== '';
    }
    if (typeof watchPollOptions[0] === 'object') {
      isValid = isValid && watchPollOptions[0].option !== '';
    }

    return isValid && isPollOptionsValid();
  }, [isPollOptionsValid, pollTypeNumber, watchPollOptions]);

  let filteredPollOptions = () => {
    return watchPollOptions.filter((pollOption) =>
      typeof pollOption === 'string'
        ? pollOption !== ''
        : pollOption.option !== '',
    );
  };

  const addPoll = handleSubmit(() => {
    const { pollOptions, results, chartType, groups, closeDate, ...values } =
      getPollValues();
    const { polls } = getValues();

    if (pollTypeNumber) {
      const newStepNumber = changeListNumberOption(
        getListNumberStep({
          min: values.minChoice,
          max: values.maxChoice,
          step: values.step,
        }),
      );
      setPollValues('chartType', undefined);
      replace(newStepNumber);
    }

    let closeDateTime = closeDate
      ? new Date(
          closeDate.getFullYear(),
          closeDate.getMonth(),
          closeDate.getDate(),
          closeDate.getHours(),
          closeDate.getMinutes(),
          closeDate.getSeconds(),
        ).toISOString()
      : '';

    let newPoll = generatePollMarkdown({
      type: pollChoiceState,
      options: pollTypeNumber ? [] : filteredPollOptions(),
      results: RESULTS_DROPDOWN_OPTIONS[results].value,
      chartType:
        pollTypeNumber || chartType === undefined
          ? undefined
          : CHART_TYPE_DROPDOWN_OPTIONS[chartType].value,
      groups,
      closeDateTime,
      index:
        params.pollIndex !== undefined
          ? params.pollIndex + 1
          : polls?.length + 1 || 1,
      ...values,
    });

    const listOldPolls = getValues('polls') || [];

    if (params.prevScreen === 'MessageDetail' && params.messageTopicId) {
      return reply({
        variables: {
          replyInput: {
            topicId: params.messageTopicId,
            raw: newPoll,
          },
        },
      });
    } else {
      /**
       * This condition determines how to update the form context's poll value:
       *
       * - If there is no pollIndex, it means we are adding a new poll.
       * - If there is a pollIndex value, it means we are editing a poll, and we only need to replace the existing value.
       */

      if (params.pollIndex !== undefined) {
        setValue(
          `polls.${params.pollIndex}`,
          {
            ...getPollValues(),
            pollChoiceType: pollChoiceState,
            pollContent: newPoll,
          },
          { shouldDirty: true },
        );
      } else {
        setValue(
          'polls',
          [
            ...listOldPolls,
            {
              ...getPollValues(),
              pollChoiceType: pollChoiceState,
              pollContent: newPoll,
            },
          ],
          { shouldDirty: true },
        );
      }
    }
    navigate(params.prevScreen);
  });

  function cancelAddPoll() {
    goBack();
  }

  const groupsDropdownOptions = groups
    ? groups.map((group) => {
        return { label: group.name, value: group.name };
      })
    : [];

  const Header = () =>
    ios ? (
      <ModalHeader
        title={t('Poll')}
        left={
          <HeaderItem
            label={t('Cancel')}
            left
            onPressItem={cancelAddPoll}
            loading={replyMessageLoading}
          />
        }
        right={
          <HeaderItem
            label={
              params.prevScreen === 'MessageDetail' ? t('Send') : t('Done')
            }
            onPressItem={addPoll}
            loading={replyMessageLoading}
            disabled={!isPollValid()}
          />
        }
      />
    ) : (
      <CustomHeader
        title={t('Poll')}
        noShadow
        isLoading={replyMessageLoading}
      />
    );

  return (
    <SafeAreaView style={styles.container} testID="NewPoll:SafeAreaView">
      <Header />
      <ScrollView
        style={styles.pollTypesContainer}
        directionalLockEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pollTypesContentContainer}
      >
        {POLL_CHOICE_TYPES.map((pollChoice, index) => (
          <Button
            key={index}
            content={pollChoice.label}
            style={styles.pollTypesButton}
            onPress={() => {
              setPollChoice(pollChoice.value);

              if (pollChoice.value === PollType.Multiple) {
                clearErrors();
                let options = filteredPollOptions();
                setPollValues(
                  'maxChoice',
                  options.length === 0 ? DEFAULT_MIN_CHOICE : options.length,
                );
              }
              if (pollChoice.value === PollType.Number) {
                clearErrors();
                setPollValues('minChoice', DEFAULT_MIN_CHOICE);
                setPollValues('maxChoice', DEFAULT_NUMBER_RATING_MAX_CHOICE);
              }
            }}
            outline={pollChoice.value !== pollChoiceState}
          />
        ))}
      </ScrollView>
      <KeyboardAwareScrollView
        scrollEventThrottle={0}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        nestedScrollEnabled
        keyboardShouldPersistTaps="always"
        testID="NewPoll:ScrollView"
      >
        {(pollTypeMultiple || pollTypeNumber) && (
          <View style={styles.multipleChoiceContainer}>
            <Controller
              name="minChoice"
              control={control}
              rules={{
                required: {
                  value: pollTypeMultiple || pollTypeNumber,
                  message: PollValueRequired,
                },
                validate: (value, { maxChoice, pollOptions }) => {
                  return (
                    (value > 0 &&
                      value <=
                        (pollTypeMultiple
                          ? pollOptions.length
                          : DEFAULT_NUMBER_RATING_MAX_CHOICE) &&
                      value <= maxChoice) ||
                    PollValueOutOfRange
                  );
                },
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  label={t('Min. Choice')}
                  value={`${value}`}
                  onChangeText={(text) => {
                    const parsed = parseInt(text);
                    onChange(parsed || text);
                    if (parsed && parsed > 0) {
                      trigger('maxChoice');
                    }
                  }}
                  onBlur={onBlur}
                  error={errors.minChoice != null}
                  errorMsg={errors.minChoice?.message}
                  style={styles.pollChoiceInput}
                  keyboardType="number-pad"
                />
              )}
            />
            <Controller
              name="maxChoice"
              control={control}
              rules={{
                required: {
                  value: pollTypeMultiple || pollTypeNumber,
                  message: PollValueRequired,
                },
                validate: (value, { minChoice, pollOptions, step }) => {
                  return (
                    (value > 0 &&
                      value >= minChoice &&
                      value >= step &&
                      value <=
                        (pollTypeMultiple
                          ? pollOptions.length
                          : DEFAULT_NUMBER_RATING_MAX_CHOICE)) ||
                    PollValueOutOfRange
                  );
                },
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  label={t('Max. Choice')}
                  value={`${value}`}
                  onChangeText={(text) => {
                    const parsed = parseInt(text);
                    onChange(parsed || text);
                    if (parsed && parsed > 0) {
                      trigger(['minChoice', 'step']);
                    }
                  }}
                  onBlur={onBlur}
                  error={errors.maxChoice != null}
                  errorMsg={errors.maxChoice?.message}
                  keyboardType="number-pad"
                  style={pollTypeNumber ? styles.pollChoiceInput : styles.flex}
                />
              )}
            />
            {pollTypeNumber && (
              <Controller
                name="step"
                rules={{
                  required: {
                    value: pollTypeMultiple || pollTypeNumber,
                    message: PollValueRequired,
                  },
                  validate: (value, { maxChoice }) => {
                    return (
                      (value > 0 && value <= maxChoice) || PollValueOutOfRange
                    );
                  },
                }}
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    label={t('Step')}
                    value={`${value}`}
                    onChangeText={(text) => {
                      const parsed = parseInt(text);
                      onChange(parsed || text);
                      if (parsed && parsed > 0) {
                        trigger('maxChoice');
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.step != null}
                    errorMsg={errors.step?.message}
                    keyboardType="number-pad"
                    style={styles.flex}
                  />
                )}
              />
            )}
          </View>
        )}
        {pollChoiceState !== PollType.Number && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => {
                setShowOptions(!showOptions);
              }}
            >
              <Icon name="Ballot" color={colors.textLighter} />
              <Text color="lightTextDarker" style={styles.dropdownHeaderText}>
                {t('Options')}
              </Text>
              <Icon
                name={showOptions ? 'ExpandLess' : 'ExpandMore'}
                color={colors.textLighter}
              />
            </TouchableOpacity>
            {showOptions && (
              <View style={styles.optionsContainer}>
                {pollOptions.map((option, index) => (
                  <View key={option.id} style={styles.optionItemContainer}>
                    <Controller
                      name={`pollOptions.${index}`}
                      defaultValue={{ option: '' }}
                      rules={{
                        required: true,
                        validate: () => {
                          return (
                            isPollOptionsValid(index) ||
                            DuplicatePollOptionsError
                          );
                        },
                      }}
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                          placeholder={t('Option')}
                          value={
                            typeof value === 'string' ? value : value.option
                          }
                          onChangeText={onChange}
                          onBlur={onBlur}
                          returnKeyType="next"
                          autoCapitalize="none"
                          style={styles.flex}
                          autoFocus
                          error={
                            errors.pollOptions && !!errors.pollOptions[index]
                          }
                          errorMsg={
                            errors.pollOptions
                              ? errors.pollOptions[index]?.message
                              : ''
                          }
                          testID="NewPoll:TextInput:Options"
                        />
                      )}
                    />
                    <View style={styles.removeOption}>
                      {(index !== 0 || pollOptions.length > 1) && (
                        <Icon
                          name="RemoveCircle"
                          onPress={() => {
                            remove(index);
                            trigger('maxChoice');
                          }}
                        />
                      )}
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addOption}
                  onPress={() => {
                    append({ option: '' });
                    trigger('maxChoice');
                  }}
                  testID="NewPoll:Button:AddOption"
                >
                  <Icon name="Add" />
                  <Text color="primary" style={styles.addOptionText}>
                    {t('Add Option')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        <View
          style={[styles.dropdownContainer, styles.advancedSettingDropdown]}
        >
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => {
              setShowAdvancedSetting(!showAdvancedSetting);
            }}
            testID="NewPoll:Button:AdvancedSettings"
          >
            <Icon name="Settings" color={colors.textLighter} />
            <Text color="lightTextDarker" style={styles.dropdownHeaderText}>
              {t('Advanced Settings')}
            </Text>
            <Icon
              name={showAdvancedSetting ? 'ExpandLess' : 'ExpandMore'}
              color={colors.textLighter}
            />
          </TouchableOpacity>
          {showAdvancedSetting && (
            // TODO: Add the advaced settings text inputs
            <View style={styles.advancedSettingContainer}>
              <Controller
                name="title"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    label={t('Title (Optional)')}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    autoCapitalize="none"
                    style={styles.advacedSettingInput}
                    testID="NewPoll:TextInput:Title"
                  />
                )}
              />
              <Controller
                name="groups"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Dropdown
                      label={t('Limit voting to these groups')}
                      selectedIndex={
                        value.length > 0
                          ? value.map((dataSelected) => {
                              const index = groupsDropdownOptions.findIndex(
                                (item) => item.value === dataSelected,
                              );
                              return index;
                            })
                          : []
                      }
                      placeholder={t('Select...')}
                      options={groupsDropdownOptions}
                      onSelect={(option) => {
                        let oldGroups = getPollValues('groups') || [];

                        if (oldGroups.includes(option.value)) {
                          let newGroups = [...oldGroups];
                          newGroups.splice(oldGroups.indexOf(option.value), 1);
                          onChange(newGroups);
                        } else {
                          onChange([...oldGroups, option.value]);
                        }
                      }}
                      style={styles.advacedSettingInput}
                    />
                  );
                }}
              />
              <View style={styles.advacedSettingInput}>
                <Text
                  size="s"
                  color={neverClosePoll ? 'textLighter' : 'textLight'}
                  style={styles.datePickerLabel}
                >
                  {t('Automatically close poll')}
                </Text>
                <View style={styles.row}>
                  <DropdownTextInput
                    value={formatDateTime(
                      getPollValues('closeDate')?.toISOString() || '',
                      'short',
                      false,
                    )}
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datePicker}
                    disabled={neverClosePoll}
                  />
                  <DropdownTextInput
                    value={formatTime({
                      dateString:
                        getPollValues('closeDate')?.toISOString() || '',
                      hour12: true,
                    })}
                    onPress={() => setShowTimePicker(true)}
                    style={styles.timePicker}
                    disabled={neverClosePoll}
                  />
                </View>
                <RadioButton
                  selected={neverClosePoll}
                  onPress={() => {
                    let closeDate = new Date();
                    // NOTE: We set the intial time to 00:00:00,
                    // the same with what Discourse site does.
                    closeDate.setHours(0);
                    closeDate.setMinutes(0);
                    closeDate.setSeconds(0);

                    setPollValues(
                      'closeDate',
                      neverClosePoll ? closeDate : undefined,
                    );
                    setNeverClosePoll(!neverClosePoll);
                  }}
                  disabled={false}
                  style={styles.radioButton}
                  checkCircleIcon={true}
                >
                  <Text>{t('Never close poll')}</Text>
                </RadioButton>
              </View>
              <Controller
                name="closeDate"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
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
                      date={value?.toISOString()}
                    />
                  );
                }}
              />
              <Controller
                name="closeDate"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
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
                      date={value?.toISOString()}
                    />
                  );
                }}
              />
              <Controller
                name="results"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label={t('Show results')}
                    selectedIndex={value}
                    options={RESULTS_DROPDOWN_OPTIONS}
                    onSelect={(_, index) => {
                      onChange(index);
                    }}
                    style={styles.advacedSettingInput}
                  />
                )}
              />
              {!pollTypeNumber && (
                <Controller
                  name="chartType"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Dropdown
                      label={t('Results chart')}
                      selectedIndex={value}
                      options={CHART_TYPE_DROPDOWN_OPTIONS}
                      onSelect={(_, index) => {
                        onChange(index);
                      }}
                      disabled={params.editPost}
                    />
                  )}
                />
              )}
              {watchPollValues('chartType') === 0 && (
                <Controller
                  control={control}
                  name="isPublic"
                  render={({ field: { onChange, value } }) => {
                    return (
                      <RadioButton
                        selected={value}
                        onPress={() => onChange(!value)}
                        disabled={false}
                        style={styles.radioButton}
                        checkCircleIcon={true}
                      >
                        <Text>{t('Show who voted')}</Text>
                      </RadioButton>
                    );
                  }}
                />
              )}
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      {!ios && (
        <KeyboardAccessoryView
          androidAdjustResize
          inSafeAreaView
          hideBorder
          alwaysVisible
          style={styles.container}
        >
          <Button
            content={
              params.prevScreen === 'MessageDetail' ? t('Send') : t('Done')
            }
            large
            onPress={addPoll}
            style={styles.bottomMenu}
            disabled={!isPollValid()}
            loading={replyMessageLoading}
          />
        </KeyboardAccessoryView>
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing, iconSizes }) => ({
  flex: { flex: 1 },
  row: { flexDirection: 'row' },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    backgroundColor: colors.border,
  },
  bottomMenu: {
    marginVertical: spacing.xl,
    marginHorizontal: spacing.xxl,
  },
  pollTypesContainer: {
    flexDirection: 'row',
    maxHeight: 40,
    marginBottom: spacing.xl,
  },
  pollTypesContentContainer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.s,
  },
  pollTypesButton: { marginRight: spacing.l },
  dropdownContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
  },
  dropdownHeader: {
    paddingBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownHeaderText: { marginLeft: spacing.m, flex: 1 },
  advancedSettingDropdown: { marginTop: spacing.s, paddingTop: spacing.xl },
  optionsContainer: {
    paddingLeft: spacing.xxl + spacing.m,
    paddingBottom: spacing.xl,
  },
  optionItemContainer: { flexDirection: 'row', marginBottom: spacing.l },
  addOption: { flexDirection: 'row', alignItems: 'center' },
  removeOption: { marginLeft: spacing.l, width: iconSizes.l },
  addOptionText: { marginLeft: spacing.s },
  multipleChoiceContainer: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  pollChoiceInput: { flex: 1, marginRight: spacing.xl },
  advancedSettingContainer: { marginBottom: spacing.xxl },
  advacedSettingInput: { marginBottom: spacing.l + spacing.m, flex: 1 },
  datePickerLabel: { paddingBottom: spacing.m },
  datePicker: { flex: 3, marginRight: 16 },
  timePicker: { flex: 2 },
  radioButton: { paddingVertical: 0, paddingTop: spacing.l },
}));
