import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFormContext } from 'react-hook-form';

import { makeStyles, useTheme } from '../../theme';
import { CustomHeader, HeaderItem, ModalHeader } from '../../components';
import {
  NewPostForm,
  PollFormContextValues,
  RootStackNavProp,
  StackRouteProp,
} from '../../types';
import { Divider, Icon, Text } from '../../core-ui';
import { deletePoll, getPollChoiceLabel } from '../../helpers';

export default function EditPollsList() {
  const ios = Platform.OS === 'ios';

  const styles = useStyles();
  const { colors } = useTheme();
  const {
    params: { messageTopicId },
  } = useRoute<StackRouteProp<'EditPollsList'>>();
  const navigation = useNavigation<RootStackNavProp<'EditPollsList'>>();
  const { navigate, goBack } = navigation;

  const { getValues, setValue } = useFormContext<NewPostForm>();

  const { polls } = getValues();

  const Header = () => {
    const title = `Polls (${polls?.length ?? 0})`;
    return ios ? (
      <ModalHeader
        title={title}
        left={<HeaderItem label={t('Close')} left onPressItem={goBack} />}
      />
    ) : (
      <CustomHeader title={title} noShadow />
    );
  };

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<PollFormContextValues>) => {
    return (
      <View style={styles.renderItemContainer}>
        <View style={styles.renderItemContentContainer}>
          <View style={styles.textDetailContainer}>
            <Text style={styles.textChoice}>
              {getPollChoiceLabel({
                title: item.title,
                pollType: item.pollChoiceType,
              })}
            </Text>
            <Text size="s" color="lightTextDarker">
              {t('{total} options', { total: item.pollOptions.length })}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon
              name="Edit"
              size="l"
              color={colors.textLighter}
              style={styles.editIcon}
              onPress={() => {
                navigate('NewPoll', {
                  prevScreen: 'EditPollsList',
                  messageTopicId: messageTopicId,
                  pollIndex: index,
                });
              }}
            />
            <Icon
              name="Delete"
              size="l"
              color={colors.textLighter}
              onPress={() => {
                !!polls?.length && deletePoll({ polls, setValue, index });
              }}
            />
          </View>
        </View>
        <Divider />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <FlatList
          data={polls}
          keyExtractor={(item, index) => `Edit-poll-${item.title}-${index}`}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => {
  return {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: spacing.xl,
    },

    renderItemContainer: {
      marginBottom: spacing.xl,
    },
    renderItemContentContainer: {
      flexDirection: 'row',
      marginBottom: spacing.xl,
      alignItems: 'center',
    },

    textDetailContainer: {
      flex: 1,
    },
    textChoice: {
      marginBottom: spacing.xs,
    },
    iconContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    editIcon: {
      marginRight: spacing.l,
    },
  };
});
