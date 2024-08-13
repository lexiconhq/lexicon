import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useNavigation } from '@react-navigation/native';

import { Color, makeStyles, useTheme } from '../../theme';
import { Button, Icon, Text } from '../../core-ui';
import {
  PollChartType,
  PollResult,
  PollStatus,
  PollType,
} from '../../generated/server';
import { PIE_CHART_COLORS } from '../../constants';
import {
  PollVoteFail,
  errorHandlerAlert,
  getImage,
  getDistanceToNow,
  parseInt,
  useStorage,
} from '../../helpers';
import { Poll, RootStackNavProp } from '../../types';
import { useTogglePollStatus, useUndoVotePoll, useVotePoll } from '../../hooks';
import { AlertBanner } from '../AlertBanner';
import { GET_TOPIC_DETAIL } from '../../graphql/server/getTopicDetail';
import { LoadingOverlay } from '../LoadingOverlay';

import { PollOptionItem } from './PollOptionItem';

type Props = {
  poll: Poll;
  pollVotes?: Array<string>;
  isCreator: boolean;
  postId?: number;
  topicId: number;
  loadingBackground?: Color;
};

export function PollPreview(props: Props) {
  const styles = useStyles();
  const { colors, graphSizes } = useTheme();
  const {
    poll: pollData,
    pollVotes,
    isCreator,
    postId,
    topicId,
    loadingBackground,
  } = props;

  const storage = useStorage();
  const userGroups = storage.getItem('user')?.groups || [];
  const canVote = pollData.groups
    ? pollData.groups.split(',').some((group) => userGroups.includes(group))
    : true;

  const [poll, setPoll] = useState<Poll>(pollData);
  const [votes, setVotes] = useState<Array<string>>(pollVotes || []);
  const [canUndoVote, setCanUndoVote] = useState<boolean>(
    pollVotes ? pollVotes.length !== 0 : false,
  );

  useEffect(() => {
    setVotes(pollVotes || []);
    setCanUndoVote(pollVotes ? pollVotes.length !== 0 : false);
  }, [pollVotes]);

  const {
    name,
    options,
    voters,
    status,
    results,
    chartType,
    public: isPublic,
    preloadedVoters,
    type,
    min,
    max,
    close: closeDate,
    groups,
    title,
  } = poll;

  const isClosedStatus = status === PollStatus.Closed;

  const isCloseFromDate = closeDate && new Date(closeDate) < new Date();
  const isClosed = isClosedStatus || isCloseFromDate;

  const showResult =
    results === PollResult.Always ||
    (results === PollResult.OnClose && isClosed) ||
    (results === PollResult.OnVote && votes.length !== 0);

  const navigation = useNavigation<RootStackNavProp<'NewPoll'>>();

  const getPercentage = (value: number, total: number) =>
    value === 0 || total === 0 ? 0 : Math.round((value / total) * 1000) / 10;
  const pieChartData = options.map((option) =>
    getPercentage(option.votes || 0, voters),
  );
  const countRating = () => {
    let total = 0;
    options.forEach((option) => {
      total += (parseInt(option.html) || 0) * (option.votes || 0);
    });

    const result = total / voters || 0;

    return Number.isInteger(result) ? result : result.toFixed(2);
  };

  const refetchQueries = [
    {
      query: GET_TOPIC_DETAIL,
      variables: { topicId, includeFirstPost: true },
    },
  ];
  const { votePoll, loading: loadingVote } = useVotePoll({
    onCompleted: ({ votePoll }) => {
      setPoll(votePoll.poll);
      setVotes(votePoll.vote || []);
      setCanUndoVote(true);
    },
    refetchQueries,
  });
  const { togglePollStatus, loading: loadingToggel } = useTogglePollStatus({
    onCompleted: ({ togglePollStatus }) => {
      setPoll(togglePollStatus);
    },
    refetchQueries,
  });
  const { undoVotePoll, loading: loadingUndoVote } = useUndoVotePoll({
    onCompleted: ({ undoVotePoll }) => {
      setPoll(undoVotePoll);
      setVotes([]);
      setCanUndoVote(false);
    },
    refetchQueries,
  });

  const onVotePoll = (optionIds: Array<string>) => {
    if (!postId) {
      errorHandlerAlert(PollVoteFail);
    } else {
      votePoll({
        variables: { postId, pollName: name, options: optionIds },
      });
    }
  };

  const onToggleStatus = () => {
    if (!postId) {
      errorHandlerAlert(PollVoteFail);
    } else {
      togglePollStatus({
        variables: {
          postId,
          pollName: name,
          status: isClosed ? PollStatus.Open : PollStatus.Closed,
        },
      });
    }
  };

  const onUndoVotePoll = () => {
    if (!postId) {
      errorHandlerAlert(PollVoteFail);
    } else {
      undoVotePoll({
        variables: {
          postId,
          pollName: name,
        },
      });
    }
  };

  const result = () => {
    const resultInfo = (color?: Color) => (
      <Text
        size="xs"
        color={color || 'pureWhite'}
        variant="semiBold"
        style={styles.textCenter}
      >
        {results === PollResult.OnVote
          ? t('Vote to view results')
          : t('Results will be displayed after the poll is closed')}
      </Text>
    );

    const isNumberRating = type === PollType.Number;
    if (!isNumberRating && chartType === PollChartType.Bar && !showResult) {
      return (
        <View style={styles.numberRatingResult}>{resultInfo('textLight')}</View>
      );
    }

    if (isNumberRating || chartType === PollChartType.Pie) {
      if (!showResult) {
        return isNumberRating ? (
          <View
            style={[styles.numberRatingResult, styles.hiddenNumberRatingResult]}
          >
            {resultInfo()}
          </View>
        ) : (
          <View style={styles.pieChartContainer}>
            <View style={styles.pieChartHiddenResult}>{resultInfo()}</View>
          </View>
        );
      } else {
        return isNumberRating ? (
          <View
            style={[styles.numberRatingResult, styles.shownNumberRatingResult]}
          >
            <Text size="l" variant="semiBold">
              {t('Average Rating')}
            </Text>
            <Text variant="semiBold" size="xxxl">
              {countRating()}
            </Text>
          </View>
        ) : (
          <View style={styles.pieChartContainer}>
            {
              /**
               * Fix the pie chart when there are zero values when summing the series.
               */
              pieChartData.reduce(
                (acc, currentValue) => acc + currentValue,
                0,
              ) === 0 ? (
                <View style={styles.pieChartHiddenResult} />
              ) : (
                <PieChart
                  widthAndHeight={graphSizes.l}
                  series={pieChartData}
                  sliceColor={PIE_CHART_COLORS.slice(0, pieChartData.length)}
                />
              )
            }
          </View>
        );
      }
    } else {
      return null;
    }
  };

  let loading = loadingVote || loadingToggel || loadingUndoVote;

  return (
    <View style={styles.container} testID="PollPreview:View">
      {title && (
        <Text variant="semiBold" style={styles.title}>
          {title}
        </Text>
      )}
      {!canVote && (
        <AlertBanner
          type="warning"
          message={t(
            'You need to be a member of {groups} to vote in this poll.',
            { groups: groups?.split(',').join(', ') },
          )}
          style={styles.alertBanner}
        />
      )}
      {result()}
      {type === PollType.Multiple && (
        <Text
          size="xs"
          color="lightTextDarker"
          style={styles.multipleChoiceText}
        >
          {t(`Vote with a min. of {min} choices and a max. of {max} choices`, {
            min,
            max,
          })}
        </Text>
      )}
      {options.map((option, index) => {
        const userVoters = preloadedVoters?.find(
          (voter) =>
            voter.pollOptionId.toLowerCase() === option.id.toLowerCase(),
        );

        const dataUserVoters =
          userVoters?.users.map((user) => ({
            name: user.name || user.username,
            username: user.username,
            avatar: getImage(user.avatarTemplate, 'l'),
          })) || [];

        return (
          <PollOptionItem
            key={option.id}
            option={option.html}
            percentage={getPercentage(option.votes || 0, voters)}
            selected={votes?.includes(option.id) ?? false}
            showResult={showResult}
            chartType={type !== PollType.Number ? chartType : undefined}
            onSelect={() => {
              onVotePoll(
                type === PollType.Multiple
                  ? [...votes, option.id]
                  : [option.id],
              );
            }}
            usersVoters={isPublic ? dataUserVoters : []}
            legendColor={PIE_CHART_COLORS[index]}
            disabled={isClosed || !canVote}
            onPressStackAvatar={() => {
              navigation.navigate('StackAvatar', {
                amountVote: option.votes || 0,
                option: option.html,
                users: dataUserVoters,
              });
            }}
          />
        );
      })}
      <View style={styles.pollStatusContainer}>
        <Text size="xs" color="lightTextDarker" style={styles.flex}>
          {t(`Total: {number} voter`, { number: voters })}
        </Text>
        {isClosed ? (
          <>
            <Icon
              name="Lock"
              size="xxs"
              color={colors.lightTextDarker}
              style={styles.pollClosedIcon}
            />
            <Text size="xs" color="lightTextDarker">
              {t('Poll Closed')}
            </Text>
          </>
        ) : closeDate ? (
          <>
            <Icon name="Clock" size="xxs" style={styles.pollClosedIcon} />
            <Text size="xs" color="primary">
              {t(`Poll closed in {duration}`, {
                duration: getDistanceToNow(closeDate),
              })}
            </Text>
          </>
        ) : (
          <Text size="xs" color="lightTextDarker">
            {t('Poll Open')}
          </Text>
        )}
      </View>
      {canUndoVote && !isClosed && (
        <Button
          onPress={onUndoVotePoll}
          content={t('Undo Vote')}
          outline={true}
          style={styles.toggleStatusButton}
        />
      )}
      {isCreator && !isCloseFromDate && (
        <Button
          onPress={onToggleStatus}
          content={!isClosed ? t('Close Poll') : t('Open Poll')}
          outline={!isClosed}
          style={styles.toggleStatusButton}
        />
      )}
      {loading && (
        <LoadingOverlay loading={loading} backgroundColor={loadingBackground} />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ spacing, colors, graphSizes }) => ({
  flex: { flex: 1 },
  container: { marginTop: spacing.xl },
  title: { marginBottom: spacing.l },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl + spacing.s,
  },
  numberRatingResult: {
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl + spacing.s,
    borderRadius: 4,
  },
  shownNumberRatingResult: { backgroundColor: colors.backgroundDarker },
  hiddenNumberRatingResult: {
    backgroundColor: colors.textLighter,
    height: 125,
  },
  pieChartHiddenResult: {
    height: graphSizes.l,
    width: graphSizes.l,
    borderRadius: graphSizes.l / 2,
    backgroundColor: colors.textLighter,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCenter: { textAlign: 'center' },
  multipleChoiceText: { marginBottom: spacing.m },
  pollStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.s,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  pollClosedIcon: { marginRight: spacing.s },
  toggleStatusButton: { marginBottom: spacing.xl },
  alertBanner: { marginBottom: spacing.xxl },
}));
