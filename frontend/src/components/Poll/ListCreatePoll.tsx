import React from 'react';
import { ScrollView } from 'react-native';

import { PollFormContextValues, RootStackParamList } from '../../types';
import { makeStyles } from '../../theme';
import { getPollChoiceLabel } from '../../helpers';

import { PollChoiceCard } from './PollChoiceCard';

type Props = {
  polls: Array<PollFormContextValues>;
  editPostId?: number;
  navigate: (screen: 'NewPoll', params: RootStackParamList['NewPoll']) => void;
  setValue: (name: 'polls', value: Array<PollFormContextValues>) => void;
  prevScreen: 'NewPost' | 'PostReply' | 'NewMessage';
};

export function ListCreatePoll(props: Props) {
  const styles = useStyles();
  const { polls, editPostId, navigate, setValue, prevScreen } = props;

  if (!polls?.length) {
    return null;
  }
  return (
    <ScrollView
      style={styles.pollCardContainer}
      contentContainerStyle={styles.pollCardContentContainer}
      nestedScrollEnabled={true}
    >
      {polls.map((data: PollFormContextValues, index: number) => (
        <PollChoiceCard
          choice={getPollChoiceLabel({
            title: data.title,
            pollType: data.pollChoiceType,
          })}
          totalOption={data.pollOptions.length}
          onDelete={() => {
            const updatedPolls = [
              ...polls.slice(0, index),
              ...polls.slice(index + 1),
            ];
            setValue('polls', updatedPolls);
          }}
          onEdit={() => {
            navigate('NewPoll', {
              pollIndex: index,
              prevScreen,
              editPost: !!editPostId,
            });
          }}
          key={`polls-card-${data.title}-${index}`}
          style={index > 0 && styles.pollCard}
        />
      ))}
    </ScrollView>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  pollCardContainer: {
    marginHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    maxHeight: 150,
  },
  pollCardContentContainer: {
    paddingBottom: spacing.xl,
  },
  pollCard: {
    marginTop: spacing.m,
  },
}));
