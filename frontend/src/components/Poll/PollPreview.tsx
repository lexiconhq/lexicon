import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { useDebouncedCallback } from 'use-debounce';

import { client } from '../../api/client';
import { topicsDetailPathBuilder } from '../../api/pathBuilder';
import { PIE_CHART_COLORS } from '../../constants';
import { Button, Icon, Text } from '../../core-ui';
import {
  GetTopicDetailDocument,
  PollChartType,
  PollResult,
  PollStatus,
  PollType,
  PostFragment,
  PostFragmentDoc,
  PreloadedVoters,
} from '../../generatedAPI/server';
import {
  PollVoteFail,
  errorHandlerAlert,
  getDistance,
  getDistanceToNow,
  getImage,
  isMultipleVoters,
  parseInt,
  useStorage,
} from '../../helpers';
import { useTogglePollStatus, useUndoVotePoll, useVotePoll } from '../../hooks';
import { Color, makeStyles, useTheme } from '../../theme';
import { Poll, PollsVotes, RootStackNavProp } from '../../types';
import { AlertBanner } from '../AlertBanner';
import { LoadingOverlay } from '../LoadingOverlay';

import { PollOptionItem } from './PollOptionItem';

type Props = {
  poll: Poll;
  pollVotes?: Array<string>;
  isCreator: boolean;
  postId?: number;
  topicId: number;
  loadingBackground?: Color;
  postCreatedAt: string;
};

const DEBOUNCE_WAIT_TIME = 1000;

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
    postCreatedAt,
  } = props;

  const storage = useStorage();
  const currentUser = storage.getItem('user');
  const userGroups = currentUser?.groups || [];
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

  const isCloseFromDate = closeDate ? new Date(closeDate) < new Date() : false;
  const isClosed = isClosedStatus || isCloseFromDate;

  const showResult =
    results === PollResult.Always ||
    (results === PollResult.OnClose && isClosed) ||
    (results === PollResult.OnVote && votes.length !== 0);

  const navigation = useNavigation<RootStackNavProp<'NewPoll'>>();

  const getPercentage = (value: number, total: number) =>
    value === 0 || total === 0 ? 0 : Math.round((value / total) * 1000) / 10;
  const countRating = () => {
    let total = 0;
    options.forEach((option) => {
      total += (parseInt(option.html) || 0) * (option.votes || 0);
    });

    const result = total / voters || 0;

    return Number.isInteger(result) ? result : result.toFixed(2);
  };

  let pieChartData = useMemo(() => {
    return poll.options.map((option) =>
      getPercentage(option.votes || 0, voters),
    );
  }, [poll.options, voters]);

  const refetchQueries = [
    {
      query: GetTopicDetailDocument,
      variables: {
        topicId,
        includeFirstPost: true,
        topicDetailPath: topicsDetailPathBuilder,
      },
    },
  ];
  const { votePoll } = useVotePoll({
    onError(error) {
      let post = client.readFragment<PostFragment>({
        fragment: PostFragmentDoc,
        fragmentName: 'PostFragment',
        id: `Post:${String(postId)}`,
      });

      let currentPoll = post?.polls?.find((poll) => poll.name === name);
      let currentPollVotes = post?.pollsVotes?.find(
        (pollVotes) => pollVotes.pollName === name,
      )?.pollOptionIds;

      if (currentPoll) {
        setPoll(currentPoll);
      }

      setVotes(currentPollVotes || []);
      setCanUndoVote(currentPollVotes ? currentPollVotes.length !== 0 : false);

      errorHandlerAlert(error);
    },
    update: (cache, { data }) => {
      if (!data) {
        return;
      }

      const { poll: newPoll, vote: newVote } = data.votePoll;

      cache.updateFragment(
        {
          id: `Post:${postId}`,
          fragmentName: 'PostFragment',
          fragment: PostFragmentDoc,
        },
        (data) => {
          if (!data) {
            return;
          }

          const { polls: previousPolls, pollsVotes: previousPollsVotes } = data;

          let polls = previousPolls.map((poll: Poll) => {
            if (poll.name === name) {
              return newPoll;
            }
            return poll;
          });
          let pollsVotes = previousPollsVotes
            ? previousPollsVotes.map((pollVote: PollsVotes) => {
                if (pollVote.pollName === name) {
                  return { ...pollVote, pollOptionIds: newVote };
                }
                return pollVote;
              })
            : [{ pollName: newPoll.name, pollOptionIds: newVote }];

          return { ...data, polls, pollsVotes };
        },
      );
    },
  });
  const { togglePollStatus, loading: loadingToggle } = useTogglePollStatus({
    onCompleted: ({ togglePollStatus }) => {
      setPoll(togglePollStatus?.poll);
    },
    refetchQueries,
  });
  const { undoVotePoll, loading: loadingUndoVote } = useUndoVotePoll({
    onCompleted: ({ undoVotePoll }) => {
      setPoll(undoVotePoll?.poll);
      setVotes([]);
      setCanUndoVote(false);
    },
    refetchQueries,
  });

  const debouncedVotePoll = useDebouncedCallback((optionIds: Array<string>) => {
    if (!postId) {
      errorHandlerAlert(PollVoteFail);
    } else {
      votePoll({
        variables: { postId, pollName: name, options: optionIds },
      });
    }
  }, DEBOUNCE_WAIT_TIME);

  const onVotePoll = useCallback(
    (newVote: string) => {
      const newVotes =
        type === PollType.Multiple ? [...votes, newVote] : [newVote];
      setVotes(newVotes);
      setCanUndoVote(true);
      setPoll((poll) => {
        let { voters, options, preloadedVoters } = poll;
        const newVoters = canUndoVote ? voters : voters + 1;

        let newOptions = options.map((option) => {
          let newOption = { ...option };
          if (option.id === newVote) {
            newOption.votes = option.votes ? option.votes + 1 : 1;
          }

          // This condition check if the poll type is multiple choice and the user has already cast a vote.
          // If the poll type is not multiple choice and the votes data count is not 0,
          // we remove the vote by decreasing the selected option's vote count.
          if (
            type !== PollType.Multiple &&
            votes.length > 0 &&
            option.id === votes[0]
          ) {
            newOption.votes = option.votes ? option.votes - 1 : 0;
          }
          return newOption;
        });

        const userVoter = currentUser
          ? {
              id: currentUser.id,
              name: currentUser.name,
              username: currentUser.username,
              avatarTemplate: currentUser.avatar,
            }
          : undefined;
        let newPreloadedVoters: Array<PreloadedVoters> = [];

        if (userVoter) {
          if (!preloadedVoters) {
            newPreloadedVoters = [
              {
                pollOptionId: newVote,
                users: [userVoter],
              },
            ];
          } else {
            newPreloadedVoters = preloadedVoters;
            // For when user haven't vote and the poll type is single choice
            if (canUndoVote && type !== PollType.Multiple) {
              // Remove user from other option if user already cast a vote and not allowed to have multiple vote
              newPreloadedVoters = preloadedVoters.map((voter) => {
                if (voter.pollOptionId !== newVote) {
                  const oldUserIndex = voter.users.findIndex(
                    (user) => user.username === currentUser?.username,
                  );
                  if (oldUserIndex >= 0) {
                    voter.users.splice(oldUserIndex, 1);
                  }
                }
                return voter;
              });
            }

            // This part is for adding the current user to the preloaded voters list.
            const optionIndex = newPreloadedVoters.findIndex(
              (voter) => voter.pollOptionId === newVote,
            );
            // Check if the selected option already exist in the list. If it does, we modify
            // the existing preloaded voter item by adding the current user to the list of users.
            if (optionIndex >= 0) {
              newPreloadedVoters[optionIndex] = {
                ...newPreloadedVoters[optionIndex],
                users: [...newPreloadedVoters[optionIndex].users, userVoter],
              };
            }
            // If the selected option doesn't exist in the list, then we create a new entry in the list.
            else {
              newPreloadedVoters = [
                ...newPreloadedVoters,
                {
                  pollOptionId: newVote,
                  users: [userVoter],
                },
              ];
            }
          }
        }

        debouncedVotePoll(newVotes);
        return {
          ...poll,
          voters: newVoters,
          options: newOptions,
          preloadedVoters: newPreloadedVoters,
        };
      });
    },
    [canUndoVote, currentUser, debouncedVotePoll, type, votes],
  );

  const onToggleStatus = () => {
    if (!postId) {
      errorHandlerAlert(PollVoteFail);
    } else {
      togglePollStatus({
        variables: {
          input: {
            postId,
            pollName: name,
            status: isClosed ? PollStatus.Open : PollStatus.Closed,
          },
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
                <>
                  <PieChart
                    widthAndHeight={graphSizes.l}
                    series={pieChartData}
                    sliceColor={PIE_CHART_COLORS.slice(0, pieChartData.length)}
                  />
                  {pieChartData.filter((data) => data === 100).length === 1 && (
                    <View style={styles.pieChartText}>
                      <Text color="pureWhite" variant="semiBold">
                        {options[pieChartData.indexOf(100)].html}
                      </Text>
                      <Text color="pureWhite" variant="semiBold">
                        100%
                      </Text>
                    </View>
                  )}
                </>
              )
            }
          </View>
        );
      }
    } else {
      return null;
    }
  };

  let loading = loadingToggle || loadingUndoVote;

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
          (voter) => voter.pollOptionId === option.id,
        );

        const dataUserVoters =
          userVoters?.users.map((user) => ({
            name: user.name || user.username,
            username: user.username,
            avatar: getImage(user.avatarTemplate, 'l'),
          })) || [];

        const selected = votes?.includes(option.id) ?? false;

        return (
          <PollOptionItem
            key={option.id}
            option={option.html}
            percentage={getPercentage(option.votes || 0, voters)}
            selected={selected}
            showResult={showResult}
            chartType={type !== PollType.Number ? chartType : undefined}
            onSelect={() => {
              if (!selected) {
                onVotePoll(option.id);
              }
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
          {isMultipleVoters(voters)
            ? t(`Total: {number} voters`, { number: voters })
            : t(`Total: {number} voter`, { number: voters })}
        </Text>
        {closeDate ? (
          isClosed ? (
            <>
              <Icon
                name="Lock"
                size="xxs"
                color={colors.lightTextDarker}
                style={styles.pollClosedIcon}
              />
              <Text size="xs" color="lightTextDarker">
                {t('Poll lasted {duration}', {
                  duration: getDistance(closeDate, postCreatedAt),
                })}
              </Text>
            </>
          ) : (
            <>
              <Icon name="Clock" size="xxs" style={styles.pollClosedIcon} />
              <Text size="xs" color="primary">
                {t(`Poll closes in {duration}`, {
                  duration: getDistanceToNow(closeDate),
                })}
              </Text>
            </>
          )
        ) : (
          <Text size="xs" color="lightTextDarker">
            {t('Poll open')}
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
  pieChartText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
